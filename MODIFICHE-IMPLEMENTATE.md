# 🔄 MODIFICHE APPLICAZIONE SMIRT - RAPPORTI INTERVENTO

## 📋 SUMMARY DELLE MODIFICHE IMPLEMENTATE

### 1. 📅 **DUE DATE SEPARATE**
- **PRIMA**: Un singolo campo "Data"
- **ADESSO**: Due campi separati "Data Inizio" e "Data Fine"

**Modifiche file:**
- ✅ `rapporti_intervento.V3.html`: Aggiornati i campi del form
- ✅ `google-apps-script.js`: Mappatura colonne aggiornata
- ✅ Google Sheet: Colonne F (Data inizio) e G (Data fine)

**Validazione implementata:**
- Data fine non può essere precedente a data inizio
- Entrambe le date sono obbligatorie

---

### 2. 🖊️ **RIMOZIONE FIRMA TECNICO**
- **PRIMA**: Due firme (tecnico + committente)
- **ADESSO**: Solo firma committente

**Modifiche file:**
- ✅ `rapporti_intervento.V3.html`: Rimossa sezione firma tecnico
- ✅ `google-apps-script.js`: Gestione solo firma committente
- ✅ Struttura foglio: Solo colonna J (Firma Committente)

**Semplificazioni:**
- Meno complessità nel form
- Upload più veloce (una sola firma)
- Interfaccia più pulita

---

### 3. 🎫 **SISTEMA BUONO LAVORO AUTOMATICO**
- **PRIMA**: Campo manuale o non presente
- **ADESSO**: Generazione automatica server-side

**Sistema implementato:**
```
Utente "valentino" → Codici: V0001, V0002, V0003...
Utente "admin"     → Codici: A0001, A0002, A0003...
Utente "tecnico1"  → Codici: T0001, T0002, T0003...
```

**Mappatura utenti configurata:**
```javascript
USER_CODE_MAPPING: {
  'admin': 'A',
  'tecnico1': 'T', 
  'tecnico2': 'U',
  'valentino': 'V',
  'marco': 'M',
  'giuseppe': 'G',
  'francesco': 'F',
  'antonio': 'N'
}
```

**Caratteristiche:**
- ✅ **Numerazione sequenziale**: Ogni utente ha la propria sequenza
- ✅ **Formato fisso**: Lettera + 4 cifre (es. V0012)
- ✅ **Anti-duplicati**: Controlla l'ultimo numero utilizzato
- ✅ **Fallback**: Genera codice casuale in caso di errore
- ✅ **Persistente**: Salva automaticamente in colonna K

---

## 🔧 MODIFICHE TECNICHE DETTAGLIATE

### Frontend (HTML + JavaScript)
```html
<!-- PRIMA -->
<input id="data" type="date" required>

<!-- ADESSO -->
<input id="data-inizio" type="date" required>
<input id="data-fine" type="date" required>
```

```javascript
// PRIMA: Validazione firma tecnico
if (isCanvasEmpty(canvasTecnico)) {
    showAlert('Errore', 'Firma tecnico obbligatoria');
}

// ADESSO: Solo validazione committente
if (isCanvasEmpty(canvasCommittente)) {
    showAlert('Errore', 'Firma committente obbligatoria');
}
```

### Backend (Google Apps Script)
```javascript
// NUOVA FUNZIONE: Generazione buono lavoro
function generaBuonoLavoro(username, sheet) {
  const userLetter = CONFIG.USER_CODE_MAPPING[username.toLowerCase()];
  
  // Cerca ultimo numero per questo utente
  let maxNumber = 0;
  const existingData = sheet.getDataRange().getValues();
  
  // Logica di incremento sequenziale...
  
  return userLetter + nextNumber.toString().padStart(4, '0');
}
```

**Nuova struttura dati:**
```javascript
const formData = {
  // ... altri campi
  dataInizio: '2025-11-13',  // NUOVO
  dataFine: '2025-11-13',    // NUOVO
  // buonoLavoro: GENERATO AUTOMATICAMENTE
};
```

---

## 📊 STRUTTURA GOOGLE SHEET FINALE

| Col | Nome | Descrizione | Esempio |
|-----|------|-------------|---------|
| A | Timestamp | Auto-generato | 13/11/2025 14:30:15 |
| B | Utente | Nome operatore | valentino |
| C | MUD | Codice intervento | MUD-001 |
| D | Riferimento | Rif. aggiuntivo | RIF-ABC |
| E | Luogo | Località | Milano, Via Roma 10 |
| F | Data inizio | Data inizio lavori | 2025-11-13 |
| G | Data fine | Data fine lavori | 2025-11-15 |
| H | Descrizione | Dettagli intervento | Riparazione impianto |
| I | Materiali | Materiali usati | Tubi, valvole |
| J | Firma Committente | URL Google Drive | https://drive.google.com/... |
| K | Buono di lavoro | **NUOVO AUTOMATICO** | **V0047** |

---

## 🧪 TESTING E VALIDAZIONE

### Funzioni di test aggiunte:
```javascript
// Test sistema buoni lavoro
testSistemaBuoniLavoro();

// Test configurazione completa
verificaConfigurazioneAttuale();

// Test con nuova struttura
testJsonpScriptUnified();
```

### Test case coperti:
- ✅ Generazione sequenziale buoni lavoro
- ✅ Gestione utenti non mappati
- ✅ Validazione date (inizio <= fine)
- ✅ Upload firma unica (committente)
- ✅ Persistenza dati con nuova struttura

---

## 🚀 DEPLOYMENT STEPS

1. **Copia `google-apps-script.js` aggiornato** nel Google Apps Script Editor
2. **Verifica permessi** Google Sheets + Google Drive
3. **Testa** con `verificaConfigurazioneAttuale()`
4. **Deploy** come Web App con nuovo URL
5. **Aggiorna SCRIPT_URL** in `rapporti_intervento.V3.html`
6. **Carica** tutti i file aggiornati sul server/GitHub Pages

---

## 🔍 TROUBLESHOOTING

### Buono lavoro non generato?
- Verifica mappatura utente in `CONFIG.USER_CODE_MAPPING`
- Controlla permessi su Google Sheet
- Esegui `testSistemaBuoniLavoro()` per diagnostica

### Date non validate?
- Controlla formato date (YYYY-MM-DD)
- Verifica che data fine >= data inizio

### Firma non caricata?
- Solo firma committente è richiesta ora
- Controlla permessi Google Drive
- Verifica dimensioni firma (max ~3MB)

---

## 📝 NOTES PER SVILUPPO FUTURO

- **Estensibilità**: Facile aggiungere nuovi utenti al mapping
- **Scalabilità**: Sistema buoni lavoro supporta teoricamente 9999 interventi per utente
- **Manutenibilità**: Configurazione centralizzata in CONFIG object
- **Monitoring**: Log dettagliati per debugging

**Versione**: V4 - Sistema Date Doppie + Buono Lavoro Automatico
**Data**: 13 Novembre 2025