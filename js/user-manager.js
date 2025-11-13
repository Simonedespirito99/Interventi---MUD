// GESTIONE UTENTI E AUTENTICAZIONE
// File di configurazione per credenziali e permessi utenti

class UserManager {
    constructor() {
        this.users = null;
        this.settings = null;
        this.currentUser = null;
    }

    // Carica la configurazione utenti
    async loadUsers() {
        try {
            const response = await fetch('./config/users.json');
            const config = await response.json();
            this.users = config.users;
            this.settings = config.settings;
            return true;
        } catch (error) {
            console.warn('Impossibile caricare users.json, uso credenziali di default');
            // Fallback alle credenziali hardcoded
            this.users = {
                'Admin': {
                    password: '2977',
                    role: 'admin',
                    displayName: 'Amministratore',
                    permissions: ['view', 'edit', 'delete', 'admin']
                }
            };
            this.settings = {
                sessionTimeout: 3600000,
                maxLoginAttempts: 3,
                requirePasswordChange: false
            };
            return false;
        }
    }

    // Verifica credenziali
    authenticate(username, password) {
        if (!this.users) return false;
        
        const user = this.users[username];
        if (user && user.password === password) {
            this.currentUser = {
                username: username,
                ...user
            };
            return true;
        }
        return false;
    }

    // Salva sessione
    saveSession(username) {
        const sessionData = {
            username: username,
            loginTime: Date.now(),
            displayName: this.users[username].displayName,
            role: this.users[username].role,
            permissions: this.users[username].permissions
        };
        
        sessionStorage.setItem('smirt_session', JSON.stringify(sessionData));
        sessionStorage.setItem('smirt_logged_in', 'true');
        sessionStorage.setItem('smirt_user', username);
    }

    // Verifica sessione valida
    isSessionValid() {
        try {
            const sessionData = JSON.parse(sessionStorage.getItem('smirt_session') || '{}');
            const loginTime = sessionData.loginTime || 0;
            const now = Date.now();
            
            if (now - loginTime > this.settings.sessionTimeout) {
                this.logout();
                return false;
            }
            
            return sessionStorage.getItem('smirt_logged_in') === 'true';
        } catch {
            return false;
        }
    }

    // Ottieni utente corrente
    getCurrentUser() {
        try {
            return JSON.parse(sessionStorage.getItem('smirt_session') || '{}');
        } catch {
            return null;
        }
    }

    // Verifica permesso
    hasPermission(permission) {
        const user = this.getCurrentUser();
        return user && user.permissions && user.permissions.includes(permission);
    }

    // Logout
    logout() {
        sessionStorage.removeItem('smirt_session');
        sessionStorage.removeItem('smirt_logged_in'); 
        sessionStorage.removeItem('smirt_user');
        this.currentUser = null;
    }

    // Ottieni lista utenti (solo per admin)
    getUsers() {
        if (this.hasPermission('admin')) {
            return Object.keys(this.users).map(username => ({
                username,
                displayName: this.users[username].displayName,
                role: this.users[username].role
            }));
        }
        return [];
    }

    // Aggiungi nuovo utente (solo per admin)
    addUser(username, password, role, displayName) {
        if (!this.hasPermission('admin')) return false;
        
        this.users[username] = {
            password: password,
            role: role,
            displayName: displayName,
            permissions: role === 'admin' ? ['view', 'edit', 'delete', 'admin'] : ['view', 'edit']
        };
        
        return true;
    }

    // Cambia password
    changePassword(username, oldPassword, newPassword) {
        const currentUser = this.getCurrentUser();
        
        // Solo admin può cambiare password di altri, o utente può cambiare la propria
        if (!this.hasPermission('admin') && currentUser.username !== username) {
            return false;
        }
        
        const user = this.users[username];
        if (user && user.password === oldPassword) {
            user.password = newPassword;
            return true;
        }
        
        return false;
    }
}

// Istanza globale
const userManager = new UserManager();