# 🔧 GESTIONE UTENTI SMIRT - Guida Amministratore

## 🎯 Sistema di Gestione Utenti

Il sistema ora supporta **gestione dinamica degli utenti** con diversi livelli di accesso e ruoli.

## 📂 Struttura File

```
interventi/
├── index.html                 # Pagina di login
├── rapporti_intervento.V3.html # App principale  
├── admin.html                 # Pannello gestione utenti (solo admin)
├── js/
│   └── user-manager.js        # Sistema gestione utenti
└── config/
    └── users.json             # File configurazione utenti
```

## 🔐 Utenti Predefiniti

### **Admin Principal**
- Username: `Admin`
- Password: `2977`
- Ruolo: `admin`
- Permessi: Tutti (gestione utenti, modifica, eliminazione)

### **Utenti Tecnici (Esempio)**
- Username: `Valentino` | Password: `val123` | Ruolo: `tecnico`
- Username: `Marco` | Password: `mar456` | Ruolo: `tecnico`  
- Username: `Giuseppe` | Password: `giu789` | Ruolo: `tecnico`

## 🛠️ COME AGGIUNGERE/MODIFICARE UTENTI

### **Metodo 1: Pannello Admin (Raccomandato)**

1. **Accedi come Admin** (Admin/2977)
2. **Vai su**: `https://tuousername.github.io/tuorepo/admin.html`
3. **Compila il form "Aggiungi Nuovo Utente"**:
   - Username: nome utente unico
   - Password: password sicura
   - Nome Completo: nome visualizzato
   - Ruolo: tecnico o admin
4. **Clicca "Aggiungi Utente"**

### **Metodo 2: Modifica File JSON**

Modifica direttamente `config/users.json`:

```json
{
  "users": {
    "NuovoUtente": {
      "password": "password123",
      "role": "tecnico",
      "displayName": "Nome Completo", 
      "permissions": ["view", "edit"]
    }
  }
}
```

## 🎨 Ruoli e Permessi

### **Admin**
- ✅ Accesso completo all'applicazione
- ✅ Gestione utenti (aggiungi, modifica, elimina)
- ✅ Cambio password di tutti gli utenti
- ✅ Accesso al pannello admin

### **Tecnico** 
- ✅ Accesso all'applicazione principale
- ✅ Creazione e modifica rapporti
- ✅ Cambio della propria password
- ❌ Gestione altri utenti

## 🔄 Gestione Password

### **Cambio Password via Pannello Admin**
1. Accedi al pannello admin
2. Nella tabella utenti, clicca "Cambia Password"
3. Inserisci password attuale e nuova
4. Conferma

### **Cambio Password via Codice**
```javascript
userManager.changePassword('username', 'vecchiaPassword', 'nuovaPassword');
```

## ⚙️ Configurazioni Avanzate

Modifica `config/users.json`:

```json
{
  "settings": {
    "sessionTimeout": 3600000,    // Timeout sessione (1 ora)
    "maxLoginAttempts": 3,        // Max tentativi login
    "requirePasswordChange": false // Forza cambio password
  }
}
```

## 🛡️ Sicurezza

- **Sessioni protette**: Timeout automatico dopo inattività
- **Tentativi limitati**: Blocco temporaneo dopo 3 tentativi falliti  
- **Controllo permessi**: Accesso basato sui ruoli
- **Validazione credenziali**: Controllo server-side

## 🚀 Esempi Pratici

### **Aggiungere un nuovo tecnico**
```javascript
userManager.addUser(
    'francesco', 
    'franc789', 
    'tecnico', 
    'Francesco Bianchi'
);
```

### **Verificare permessi**
```javascript
if (userManager.hasPermission('admin')) {
    // Codice solo per admin
}
```

### **Ottenere utente corrente**
```javascript
const user = userManager.getCurrentUser();
console.log(user.displayName); // Nome completo
console.log(user.role);        // Ruolo
```

## 📱 Accessi URL

- **App Principale**: `https://tuorepo.github.io/tuorepo/`
- **Pannello Admin**: `https://tuorepo.github.io/tuorepo/admin.html`

---

**💡 Tip**: Per sicurezza massima, considera di hostare il file `users.json` su un server protetto e modificare il path in `user-manager.js`.