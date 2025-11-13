# 🛠️ CONFIGURAZIONE COMPLETATA ✅

## 📋 IL TUO GOOGLE SHEET
- **Nome**: "Registro interventi - MUD"  
- **URL**: https://docs.google.com/spreadsheets/d/1Vs4w2-EcEfhu19--C3lCvf8Pq2YruIr2yA99LKyNYXc/edit
- **ID**: `1Vs4w2-EcEfhu19--C3lCvf8Pq2YruIr2yA99LKyNYXc`

## ✅ CONFIGURAZIONE AUTOMATICA APPLICATA

## 📋 STRUTTURA COLONNE SUPPORTATA

Il script è stato aggiornato per supportare questa struttura di colonne:

| Colonna | Nome | Descrizione |
|---------|------|-------------|
| A | Timestamp | Data e ora di inserimento automatica |
| B | Utente | Nome dell'utente che compila |
| C | MUD | Codice identificativo MUD |
| D | Riferimento | Riferimento aggiuntivo |
| E | Luogo | Luogo dell'intervento |
| F | Data inizio | Data inizio intervento |
| G | Data fine | Data fine intervento |
| H | Descrizione | Descrizione dell'intervento |
| I | Materiali | Materiali utilizzati |
| J | Firma Committente | URL firma committente (auto-compilata) |
| K | Buono di lavoro | Numero buono di lavoro |

## 🔧 STEP 1: ✅ CONFIGURAZIONE COMPLETATA

**Google Sheet ID e nome foglio già configurati nel codice:**
- Sheet ID: `1Vs4w2-EcEfhu19--C3lCvf8Pq2YruIr2yA99LKyNYXc` ✅
- Nome foglio: "Registro interventi - MUD" ✅

1. ~~**Apri il tuo Google Sheet**~~ ✅ Fatto
2. ~~**Copia l'ID dall'URL**~~ ✅ Fatto  
   - ~~URL tipo: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI/edit`~~
   - ~~ID = `1ABC123DEF456GHI` (la parte tra `/d/` e `/edit`)~~

3. **File google-apps-script.js già configurato**:
   ```javascript
   const CONFIG = {
     SHEET_ID: '1Vs4w2-EcEfhu19--C3lCvf8Pq2YruIr2yA99LKyNYXc', // ✅ CONFIGURATO
     SHEET_NAME: 'Registro interventi - MUD', // ✅ CONFIGURATO
     // ... resto configurazione
   };
   ```

## 🔧 STEP 2: CONFIGURAZIONE INTESTAZIONI

Il Google Sheet deve avere queste intestazioni nella prima riga:

```
Timestamp | Utente | MUD | Riferimento | Luogo | Data inizio | Data fine | Descrizione | Materiali | Firma Committente | Buono di lavoro
```

### Opzione A: Sheet Esistente
Se hai già un sheet, verifica che le intestazioni corrispondano.

### Opzione B: Sheet Nuovo
Se crei un nuovo sheet, usa la funzione di configurazione automatica:

```javascript
// Esegui questa funzione nel Google Apps Script Editor
configuraGoogleSheet('1Vs4w2-EcEfhu19--C3lCvf8Pq2YruIr2yA99LKyNYXc', 'Registro interventi - MUD');
```

## 🔧 STEP 3: VERIFICA CONFIGURAZIONE

Dopo aver configurato, esegui:

```javascript
// Test configurazione
verificaConfigurazioneAttuale();

// Test completo
testJsonpScriptUnified();
```

## 📊 CAMPI DATI SUPPORTATI

Il form deve inviare questi campi:

```javascript
const formData = {
  user: 'Nome Utente',
  mud: 'MUD-001',
  riferimento: 'RIF-001', 
  luogo: 'Milano',
  dataInizio: '2025-11-13',
  dataFine: '2025-11-13',
  descrizione: 'Descrizione intervento',
  materiali: 'Lista materiali',
  buonoLavoro: 'BL-001'
};
```

## 🖊️ GESTIONE FIRME

- **Supportata**: Solo firma committente (colonna J)
- **Upload**: Firma viene caricata su Google Drive
- **Organizzazione**: Cartelle per MUD in "Firme Rapporti"

### Se serve anche firma tecnico:
Aggiungi una colonna "Firma Tecnico" e modifica la configurazione:

```javascript
COLUMNS: {
  // ... altre colonne
  FIRMA_TECNICO: 12,     // Nuova colonna L
  FIRMA_COMMITTENTE: 10, // Rimane colonna J
  // ...
}
```

## 🚀 PROSSIMI STEP

### 1. **Verifica intestazioni nel tuo Google Sheet**
Assicurati che la prima riga abbia queste intestazioni:
```
Timestamp | Utente | MUD | Riferimento | Luogo | Data inizio | Data fine | Descrizione | Materiali | Firma Committente | Buono di lavoro
```

### 2. **Copia il codice nel Google Apps Script Editor**
- Vai su [script.google.com](https://script.google.com)
- Crea nuovo progetto
- Incolla il contenuto di `google-apps-script.js`
- Salva il progetto

### 3. **Testa la configurazione** 
Esegui queste funzioni nell'editor:
```javascript
verificaConfigurazioneAttuale();  // Verifica accesso sheet
testJsonpScriptUnified();         // Test completo funzionalità
```

### 4. **Deploy come Web App**
- Deploy → Nuova distribuzione
- Tipo: Applicazione web  
- Autorizza permessi Google Sheets + Drive
- Copia URL per il form frontend

## 🔍 TROUBLESHOOTING

### Errore "Sheet ID non configurato"
- Verifica di aver modificato `CONFIG.SHEET_ID`
- ID deve essere tra apici singoli

### Errore "Sheet non accessibile"
- Verifica permessi del Google Sheet
- Lo script deve poter accedere al sheet

### Firma non viene caricata
- Verifica permessi Google Drive
- Controlla dimensioni firma (max ~3MB)

### Colonne sbagliate
- Esegui `verificaConfigurazioneAttuale()` per diagnosticare
- Confronta intestazioni sheet con struttura richiesta

## 📝 NOTES

- **Formato Date**: Usa formato ISO (YYYY-MM-DD)
- **MUD**: Deve essere univoco per evitare duplicati
- **Firme**: Solo committente supportata di default
- **Drive**: Cartelle create automaticamente
- **Pulizia**: Cartelle duplicate vengono pulite automaticamente

---
*Script aggiornato per nuova struttura colonne italiane*