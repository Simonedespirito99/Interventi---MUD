# SMIRT - Rapporti Intervento v3.0

Applicazione web per la gestione dei rapporti di intervento SMIRT con funzionalità PWA (Progressive Web App).

## 🔐 Accesso all'Applicazione

**[🔗 Apri l'Applicazione](https://tuonomeuser.github.io/tuorepo/)**

### Credenziali di Accesso:
- **Username**: `Admin`
- **Password**: `2977`

Sostituisci `tuonomeuser` e `tuorepo` con il tuo username GitHub e il nome del repository.

## ✨ Nuove Funzionalità (v3.0)

### 🗓️ **Date Separate**
- **Data Inizio Lavoro**: Campo dedicato per l'inizio dell'intervento
- **Data Fine Lavoro**: Campo dedicato per la conclusione dell'intervento
- Validazione automatica (data fine deve essere >= data inizio)

### ✍️ **Firma Semplificata**
- **Rimossa** la firma del tecnico
- **Mantenuta** solo la firma del cliente
- Processo più rapido e semplificato

### 🎫 **Codice Automatico Buono di Lavoro**
- Generazione automatica del codice intervento
- Formato: **Lettera + 4 cifre** (es. V0001, A0002)
- Assegnazione lettera basata sull'utente:
  - **V** = Valentino
  - **A** = Admin
- Numerazione sequenziale automatica

## 📋 Funzionalità Principali

- ✅ **PWA**: Installabile su dispositivi mobili
- ✅ **Offline**: Funziona senza connessione internet
- ✅ **Google Sheets**: Sincronizzazione automatica
- ✅ **Firma Digitale**: Canvas per firma cliente
- ✅ **Validazione Dati**: Controlli automatici dei campi
- ✅ **Responsive**: Ottimizzata per mobile e desktop

## 🔧 Configurazione

L'applicazione è già configurata con:
- **Google Sheet ID**: `1Vs4w2-EcEfhu19--C3lCvf8Pq2YruIr2yA99LKyNYXc`
- **Google Apps Script**: URL configurato per l'invio dati

## 📱 Installazione su Mobile

1. Apri l'applicazione nel browser mobile
2. Tocca il menu del browser (⋮)
3. Seleziona "Aggiungi alla schermata home"
4. L'app sarà installata come applicazione nativa

## 🛠️ File Struttura

```
├── index.html                     # Pagina di reindirizzamento
├── rapporti_intervento.V3.html    # Applicazione principale
├── google-apps-script.js          # Script backend
├── manifest.json                  # Configurazione PWA
├── sw.js                          # Service Worker
├── SMIRT_Icon_Final.svg           # Icona applicazione
├── MODIFICHE-IMPLEMENTATE.md      # Log delle modifiche
└── ISTRUZIONI-CONFIGURAZIONE.md  # Istruzioni configurazione
```

## 📖 Utilizzo

1. **Compila il form** con i dati dell'intervento
2. **Seleziona le date** di inizio e fine lavoro
3. **Firma del cliente** nell'apposita area
4. **Invia**: Il sistema genera automaticamente il codice buono di lavoro
5. **Dati salvati** automaticamente su Google Sheets

## 🔄 Aggiornamenti

Versione corrente: **v3.0** (Novembre 2025)

---

**© 2025 SMIRT S.r.l** - Sistema di gestione rapporti intervento