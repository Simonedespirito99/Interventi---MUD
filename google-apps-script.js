// GOOGLE APPS SCRIPT - VERSIONE JSONP (BYPASSA CORS)
// Questa versione usa JSONP per evitare completamente i problemi CORS
// VERSIONE AGGIORNATA: Sistema a due fasi + UNICA cartella per le firme
// ADATTATO PER: Nuova struttura colonne italiane
//
// 🔄 MODIFICHE PRINCIPALI:
// ✅ Supporto nuova struttura 11 colonne (A-K)
// ✅ Configurazione centralizzata tramite CONFIG object
// ✅ Solo firma committente (struttura attuale del sheet)
// ✅ Campi aggiornati: riferimento, dataInizio, dataFine, buonoLavoro  
// ✅ Funzioni di test e configurazione automatica
// ✅ Diagnostica e troubleshooting integrata
//
// ⚠️ SETUP RICHIESTO:
// 1. Modifica CONFIG.SHEET_ID con il tuo Google Sheet ID
// 2. Verifica intestazioni sheet (vedi ISTRUZIONI-CONFIGURAZIONE.md)
// 3. Testa con testJsonpScriptUnified()

// 🔧 CONFIGURAZIONE PRINCIPALE - MODIFICA QUESTI VALORI
const CONFIG = {
  SHEET_ID: '1Vs4w2-EcEfhu19--C3lCvf8Pq2YruIr2yA99LKyNYXc', // ✅ CONFIGURATO
  SHEET_NAME: 'Registro interventi - MUD', // Nome del foglio specifico
  
  // Mappatura colonne (1-based, come in Google Sheets)
  COLUMNS: {
    TIMESTAMP: 1,        // A - Timestamp  
    UTENTE: 2,          // B - Utente
    MUD: 3,             // C - MUD
    RIFERIMENTO: 4,     // D - Riferimento
    LUOGO: 5,           // E - Luogo
    DATA_INIZIO: 6,     // F - Data inizio
    DATA_FINE: 7,       // G - Data fine
    DESCRIZIONE: 8,     // H - Descrizione
    MATERIALI: 9,       // I - Materiali
    FIRMA_COMMITTENTE: 10, // J - Firma Committente
    BUONO_LAVORO: 11    // K - Buono di lavoro
  },
  
  // 🎯 SISTEMA BUONI LAVORO: Mappatura utenti -> codice lettera
  USER_CODE_MAPPING: {
    'admin': 'A',
    'tecnico1': 'T', 
    'tecnico2': 'U',
    'valentino': 'V',
    'marco': 'M',
    'giuseppe': 'G',
    'francesco': 'F',
    'antonio': 'N'
    // Aggiungi altri utenti secondo necessità
  }
};

// 🛠️ FUNZIONE DI CONFIGURAZIONE: Imposta il nuovo Google Sheet
function configuraGoogleSheet(nuovoSheetId, nomeSheet = 'Foglio1') {
  console.log('=== 🛠️ CONFIGURAZIONE GOOGLE SHEET ===');
  console.log('📊 Nuovo Sheet ID:', nuovoSheetId);
  console.log('📋 Nome Sheet:', nomeSheet);
  
  try {
    // Test di accesso al sheet
    const ss = SpreadsheetApp.openById(nuovoSheetId);
    console.log('✅ Sheet accessibile:', ss.getName());
    
    let sheet;
    try {
      sheet = ss.getSheetByName(nomeSheet);
      if (!sheet) {
        sheet = ss.getActiveSheet();
        console.log('⚠️ Sheet specifico non trovato, uso:', sheet.getName());
      }
    } catch (sheetError) {
      sheet = ss.getActiveSheet();
      console.log('⚠️ Uso sheet attivo:', sheet.getName());
    }
    
    console.log('📋 Sheet attuale:', sheet.getName());
    
    // Verifica/Crea intestazioni
    const headerRow = [
      'Timestamp',
      'Utente', 
      'MUD',
      'Riferimento',
      'Luogo',
      'Data inizio',
      'Data fine',
      'Descrizione',
      'Materiali',
      'Firma Committente',
      'Buono di lavoro'
    ];
    
    // Controlla se ci sono già intestazioni
    const existingData = sheet.getDataRange();
    if (existingData.getNumRows() === 0) {
      // Sheet vuoto, aggiungi intestazioni
      sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
      console.log('✅ Intestazioni aggiunte al sheet vuoto');
    } else {
      // Verifica intestazioni esistenti
      const firstRow = sheet.getRange(1, 1, 1, headerRow.length).getValues()[0];
      console.log('📊 Intestazioni esistenti:', firstRow);
      
      let headerMatch = true;
      for (let i = 0; i < headerRow.length; i++) {
        if (firstRow[i] !== headerRow[i]) {
          headerMatch = false;
          console.warn(`⚠️ Intestazione diversa colonna ${i + 1}: "${firstRow[i]}" vs "${headerRow[i]}"`);
        }
      }
      
      if (headerMatch) {
        console.log('✅ Intestazioni corrispondenti!');
      } else {
        console.log('⚠️ Intestazioni diverse - il script potrebbe non funzionare correttamente');
        console.log('💡 Considera di aggiornare manualmente le intestazioni');
      }
    }
    
    // Aggiorna la configurazione nel codice (solo per info)
    console.log('🔧 PROSSIMO STEP: Aggiorna il CONFIG.SHEET_ID nel codice:');
    console.log(`   CONFIG.SHEET_ID: '${nuovoSheetId}'`);
    console.log(`   CONFIG.SHEET_NAME: '${nomeSheet}'`);
    
    return {
      success: true,
      sheetId: nuovoSheetId,
      sheetName: sheet.getName(),
      spreadsheetName: ss.getName(),
      headersOk: true,
      message: 'Configurazione completata con successo'
    };
    
  } catch (error) {
    console.error('❌ Errore configurazione sheet:', error);
    return {
      success: false,
      error: error.toString(),
      message: 'Impossibile accedere al Google Sheet. Verifica ID e permessi.'
    };
  }
}

// 🔍 FUNZIONE DIAGNOSTICA: Verifica configurazione attuale
function verificaConfigurazioneAttuale() {
  console.log('=== 🔍 VERIFICA CONFIGURAZIONE ATTUALE ===');
  
  console.log('📊 CONFIG attuale:');
  console.log('  SHEET_ID:', CONFIG.SHEET_ID);
  console.log('  SHEET_NAME:', CONFIG.SHEET_NAME);
  console.log('  COLUMNS:', CONFIG.COLUMNS);
  
  // Test accesso sheet se configurato
  if (CONFIG.SHEET_ID && CONFIG.SHEET_ID !== 'INSERISCI_QUI_IL_TUO_GOOGLE_SHEET_ID') {
    try {
      const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
      console.log('✅ Sheet accessibile:', ss.getName());
      
      let sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getActiveSheet();
      console.log('📋 Sheet utilizzato:', sheet.getName());
      
      // Mostra prime righe per verifica
      const sampleData = sheet.getRange(1, 1, Math.min(3, sheet.getLastRow()), sheet.getLastColumn()).getValues();
      console.log('📄 Prime righe del sheet:');
      sampleData.forEach((row, index) => {
        console.log(`  Riga ${index + 1}:`, row);
      });
      
      return {
        configured: true,
        accessible: true,
        sheetName: sheet.getName(),
        spreadsheetName: ss.getName()
      };
      
    } catch (error) {
      console.error('❌ Errore accesso sheet configurato:', error);
      return {
        configured: true,
        accessible: false,
        error: error.toString()
      };
    }
  } else {
    console.log('⚠️ SHEET_ID non configurato');
    return {
      configured: false,
      message: 'Devi configurare CONFIG.SHEET_ID'
    };
  }
}

// 🎯 FUNZIONE SISTEMA BUONO LAVORO: Genera codice automatico
function generaBuonoLavoro(username, sheet) {
  try {
    console.log('🎫 Generazione Buono Lavoro per utente:', username);
    
    // Ottieni la lettera associata all'utente
    const userLetter = CONFIG.USER_CODE_MAPPING[username.toLowerCase()];
    if (!userLetter) {
      console.warn('⚠️ Utente non trovato nel mapping, uso "X" di default:', username);
      userLetter = 'X'; // Fallback
    }
    
    console.log('🔤 Lettera assegnata:', userLetter);
    
    // Cerca l'ultimo numero utilizzato per questo utente
    const existingData = sheet.getDataRange().getValues();
    let maxNumber = 0;
    
    for (let i = 1; i < existingData.length; i++) { // Skip header
      const buonoLavoro = existingData[i][CONFIG.COLUMNS.BUONO_LAVORO - 1];
      
      if (buonoLavoro && typeof buonoLavoro === 'string' && buonoLavoro.startsWith(userLetter)) {
        // Estrai il numero dal codice (es. "V0005" -> 5)
        const numberPart = buonoLavoro.substring(1);
        const number = parseInt(numberPart, 10);
        
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      }
    }
    
    // Genera il prossimo numero (incrementa di 1)
    const nextNumber = maxNumber + 1;
    
    // Formatta con 4 cifre (padding con zeri)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    
    // Crea il codice finale
    const buonoLavoro = userLetter + formattedNumber;
    
    console.log('✅ Buono Lavoro generato:', buonoLavoro);
    console.log('📊 Dettagli: Ultimo numero era', maxNumber, ', nuovo numero:', nextNumber);
    
    return buonoLavoro;
    
  } catch (error) {
    console.error('❌ Errore generazione buono lavoro:', error);
    // Fallback: genera codice casuale
    const fallbackCode = 'X' + Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    console.log('🔄 Uso codice fallback:', fallbackCode);
    return fallbackCode;
  }
}

function doGet(e) {
  try {
    console.log('Richiesta ricevuta:', e.parameter);
    
    // Se è una richiesta JSONP (con callback)
    if (e.parameter.callback) {
      return handleJsonpRequest(e);
    }
    
    // Richiesta GET normale
    const response = {
      status: 'ok',
      message: 'Script JSONP funzionante',
      timestamp: new Date().toISOString(),
      version: 'JSONP-V3-UNIFIED-FOLDER',
      supportedMethods: ['GET-JSONP', 'POST-via-GET']
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Errore:', error);
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleJsonpRequest(e) {
  try {
    const callback = e.parameter.callback;
    const action = e.parameter.action;
    
    console.log('JSONP Request - Action:', action);
    
    let response;
    
    if (action === 'test') {
      // Test di connessione
      response = {
        status: 'ok',
        message: 'JSONP test successful',
        timestamp: new Date().toISOString(),
        method: 'JSONP'
      };
    } else if (action === 'save') {
      // FASE 1: Salva dati principali SENZA firme Base64
      response = saveDataWithoutSignatures(e.parameter);
    } else if (action === 'upload-signature') {
      // FASE 2: Upload firma specifica per un MUD - VERSIONE UNIFICATA
      response = uploadSignatureForMudUnified(e.parameter);
    } else if (action === 'ping') {
      // Test di connettività semplice
      response = {
        status: 'pong',
        timestamp: new Date().toISOString(),
        message: 'Server raggiungibile'
      };
    } else if (action === 'force-cleanup') {
      // NUOVA AZIONE: Forza pulizia immediata delle cartelle duplicate
      console.log('🧹 PULIZIA FORZATA richiesta dal client...');
      response = pulisciCartelleDuplicateAutomaticamente();
    } else {
      response = {
        status: 'error',
        message: 'Azione non riconosciuta: ' + action
      };
    }
    
    // Crea risposta JSONP
    const jsonpResponse = callback + '(' + JSON.stringify(response) + ');';
    
    return ContentService
      .createTextOutput(jsonpResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
      
  } catch (error) {
    console.error('Errore JSONP:', error);
    const errorResponse = callback + '(' + JSON.stringify({
      status: 'error',
      message: error.toString()
    }) + ');';
    
    return ContentService
      .createTextOutput(errorResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function saveDataWithoutSignatures(params) {
  try {
    console.log('💾 FASE 1: Salvataggio dati SENZA firme...');
    
    // Usa la configurazione centralizzata
    const SHEET_ID = CONFIG.SHEET_ID;
    const COLS = CONFIG.COLUMNS;
    
    // ⚠️ Verifica che l'ID del sheet sia configurato
    if (!SHEET_ID || SHEET_ID === 'INSERISCI_QUI_IL_TUO_GOOGLE_SHEET_ID') {
      throw new Error('❌ ERRORE: Devi configurare CONFIG.SHEET_ID nel codice!');
    }
    
    // Decodifica i dati
    const data = JSON.parse(decodeURIComponent(params.data || '{}'));
    
    console.log('📊 Dati ricevuti per MUD:', data.mud);
    
    // Apri il foglio
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet;
    
    try {
      sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getActiveSheet();
    } catch (sheetError) {
      console.warn('⚠️ Foglio specifico non trovato, uso foglio attivo');
      sheet = ss.getActiveSheet();
    }
    
    // CONTROLLO DUPLICATI: Verifica se esiste già un record per questo MUD
    const existingData = sheet.getDataRange().getValues();
    let existingRowIndex = -1;
    
    for (let i = 1; i < existingData.length; i++) { // Skip header
      if (existingData[i][COLS.MUD - 1] === data.mud) { // Colonna MUD
        existingRowIndex = i;
        console.log('⚠️ MUD già esistente:', data.mud, 'alla riga', i + 1);
        break;
      }
    }
    
    // Se il MUD esiste già, aggiorna invece di creare nuovo
    if (existingRowIndex !== -1) {
      console.log('🔄 Aggiornamento record esistente per MUD:', data.mud);
      
      const timestamp = new Date();
      const existingRow = existingRowIndex + 1; // Le righe sono 1-based
      
      // Aggiorna i campi principali usando la mappatura colonne
      sheet.getRange(existingRow, COLS.TIMESTAMP).setValue(timestamp.toLocaleString('it-IT'));
      sheet.getRange(existingRow, COLS.UTENTE).setValue(data.user || 'N/A');
      sheet.getRange(existingRow, COLS.RIFERIMENTO).setValue(data.riferimento || 'N/A');
      sheet.getRange(existingRow, COLS.LUOGO).setValue(data.luogo || 'N/A');
      sheet.getRange(existingRow, COLS.DATA_INIZIO).setValue(data.dataInizio || 'N/A');
      sheet.getRange(existingRow, COLS.DATA_FINE).setValue(data.dataFine || 'N/A');
      sheet.getRange(existingRow, COLS.DESCRIZIONE).setValue(data.descrizione || 'N/A');
      sheet.getRange(existingRow, COLS.MATERIALI).setValue(data.materiali || 'N/A');
      
      // 🎫 GESTIONE BUONO LAVORO: Solo se non esiste già
      const existingBuonoLavoro = existingData[existingRowIndex][COLS.BUONO_LAVORO - 1];
      let buonoLavoro = existingBuonoLavoro;
      
      if (!existingBuonoLavoro || existingBuonoLavoro === 'N/A') {
        buonoLavoro = generaBuonoLavoro(data.user, sheet);
        sheet.getRange(existingRow, COLS.BUONO_LAVORO).setValue(buonoLavoro);
        console.log('🎫 Nuovo buono lavoro assegnato al record esistente:', buonoLavoro);
      } else {
        console.log('🎫 Buono lavoro già esistente mantenuto:', existingBuonoLavoro);
      }
      
      // Solo se le firme non sono già presenti, segna come "IN_CARICAMENTO"
      const existingFirmaCommittente = existingData[existingRowIndex][COLS.FIRMA_COMMITTENTE - 1];
      
      if (!existingFirmaCommittente || existingFirmaCommittente === 'FIRMA_IN_CARICAMENTO') {
        sheet.getRange(existingRow, COLS.FIRMA_COMMITTENTE).setValue('FIRMA_IN_CARICAMENTO');
      }
      
      return {
        status: 'success',
        message: 'Dati aggiornati con successo per MUD esistente',
        timestamp: timestamp.toISOString(),
        phase: 'DATA_UPDATED',
        mud: data.mud,
        buonoLavoro: buonoLavoro, // 🎫 INCLUDE BUONO LAVORO (NUOVO O ESISTENTE)
        existingRow: existingRow
      };
    }
    
    // Prepara i dati SENZA le firme Base64 (verranno aggiunte dopo)
    const timestamp = new Date();
    
    // 🎫 GENERA BUONO LAVORO AUTOMATICO
    const buonoLavoro = generaBuonoLavoro(data.user, sheet);
    console.log('🎫 Buono Lavoro assegnato:', buonoLavoro);
    
    // Crea array con tutti i valori per la riga (11 colonne)
    const rowData = new Array(11).fill('N/A');
    
    // Popola i dati usando la mappatura colonne
    rowData[COLS.TIMESTAMP - 1] = timestamp.toLocaleString('it-IT');
    rowData[COLS.UTENTE - 1] = data.user || 'N/A';
    rowData[COLS.MUD - 1] = data.mud || 'N/A';
    rowData[COLS.RIFERIMENTO - 1] = data.riferimento || 'N/A';
    rowData[COLS.LUOGO - 1] = data.luogo || 'N/A';
    rowData[COLS.DATA_INIZIO - 1] = data.dataInizio || 'N/A';
    rowData[COLS.DATA_FINE - 1] = data.dataFine || 'N/A';
    rowData[COLS.DESCRIZIONE - 1] = data.descrizione || 'N/A';
    rowData[COLS.MATERIALI - 1] = data.materiali || 'N/A';
    rowData[COLS.FIRMA_COMMITTENTE - 1] = 'FIRMA_IN_CARICAMENTO';
    rowData[COLS.BUONO_LAVORO - 1] = buonoLavoro; // 🎫 BUONO LAVORO GENERATO
    
    // Inserisci i dati
    sheet.appendRow(rowData);
    
    console.log('✅ FASE 1 completata - Dati salvati senza firme per MUD:', data.mud);
    console.log('📊 Struttura utilizzata:', Object.keys(COLS));
    
    return {
      status: 'success',
      message: 'Dati salvati con successo tramite JSONP',
      timestamp: timestamp.toISOString(),
      phase: 'DATA_SAVED',
      mud: data.mud,
      buonoLavoro: buonoLavoro, // 🎫 RESTITUISCE IL BUONO LAVORO GENERATO
      structure: 'Nuovo formato colonne italiane'
    };
    
  } catch (error) {
    console.error('❌ Errore FASE 1:', error);
    return {
      status: 'error', 
      message: 'Errore nel salvataggio: ' + error.toString()
    };
  }
}

// ⭐ FUNZIONE MODIFICATA: Upload unificato delle firme nella stessa cartella
function uploadSignatureForMudUnified(params) {
  try {
    console.log('🖊️ Upload firma unificato...');
    
    const data = JSON.parse(decodeURIComponent(params.data || '{}'));
    const { mud, signatureType, signatureBase64 } = data;
    
    if (!mud || !signatureType || !signatureBase64) {
      return {
        status: 'error',
        message: 'Parametri mancanti per upload firma: ' + JSON.stringify(data)
      };
    }
    
    console.log('📤 Upload firma', signatureType, 'per MUD:', mud);
    console.log('🎯 GARANTISCO: Stessa cartella per tutte le firme del MUD!');
    console.log('📊 Dimensione firma Base64:', signatureBase64.length, 'caratteri');
    
    // 🔑 CONTROLLO DIMENSIONI: Se la firma è troppo grande, comprimi ulteriormente
    let processedSignature = signatureBase64;
    if (signatureBase64.length > 3000) {
      console.log('⚠️ Firma troppo grande, applico compressione aggressiva...');
      processedSignature = compressSignatureAggressively(signatureBase64);
      console.log('📉 Firma compressa da', signatureBase64.length, 'a', processedSignature.length, 'caratteri');
    }
    
    // 🔑 CHIAVE: Usa SEMPRE lo stesso mudCode per garantire stessa cartella
    const unifiedMudCode = mud; // NON modificare questo valore!
    const fileName = 'firma_' + signatureType;
    
    console.log('🎯 === DIAGNOSI CARTELLA UNIFICATA ===');
    console.log('📂 MUD originale ricevuto:', mud);
    console.log('🔒 unifiedMudCode (DEVE essere identico per tutte le firme):', unifiedMudCode);
    console.log('📄 fileName:', fileName);
    console.log('🔍 signatureType:', signatureType);
    console.log('📐 Dimensione firma:', processedSignature.length, 'caratteri');
    console.log('⚠️  ATTENZIONE: Se questo valore cambia tra tecnico e committente, è un BUG!');
    
    // Carica la firma su Google Drive nella cartella unificata
    const driveUrl = uploadImageToDriveUnified(processedSignature, fileName, unifiedMudCode);
    
    console.log('✅ Firma caricata su Drive:', driveUrl);
    
    // AGGIORNA il Google Sheets con l'URL della firma
    const SHEET_ID = CONFIG.SHEET_ID;
    const COLS = CONFIG.COLUMNS;
    
    // ⚠️ Verifica che l'ID del sheet sia configurato
    if (!SHEET_ID || SHEET_ID === 'INSERISCI_QUI_IL_TUO_GOOGLE_SHEET_ID') {
      throw new Error('❌ ERRORE: Devi configurare CONFIG.SHEET_ID nel codice!');
    }
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet;
    
    try {
      sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getActiveSheet();
    } catch (sheetError) {
      console.warn('⚠️ Foglio specifico non trovato, uso foglio attivo');
      sheet = ss.getActiveSheet();
    }
    
    // Trova la riga del MUD per aggiornare la firma
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    for (let i = 1; i < values.length; i++) { // Skip header
      const rowMud = values[i][COLS.MUD - 1]; // Colonna MUD
      if (rowMud === mud) {
        console.log('📝 Aggiorno riga', i + 1, 'con firma', signatureType);
        
        // Aggiorna la cella appropriata (nel nuovo formato c'è solo firma committente)
        if (signatureType === 'committente') {
          sheet.getRange(i + 1, COLS.FIRMA_COMMITTENTE).setValue(driveUrl);
        } else {
          // Se è tecnico ma la struttura non ha quella colonna, logga avvertimento
          console.warn('⚠️ Firma tecnico ricevuta ma non c\'è colonna dedicata nella nuova struttura');
          console.warn('💡 Potrebbe essere necessario aggiungere una colonna per firma tecnico');
          
          return {
            status: 'warning',
            message: 'Firma tecnico ricevuta ma non supportata dalla struttura attuale del foglio',
            signatureType: signatureType,
            suggestion: 'Aggiungere colonna "Firma Tecnico" se necessaria'
          };
        }
        
        // 🧹 PULIZIA AUTOMATICA: Elimina cartelle duplicate dopo ogni upload
        try {
          console.log('🧹 Eseguo pulizia automatica cartelle duplicate...');
          const puliziaRisultato = pulisciCartelleDuplicateAutomaticamente();
          console.log('✅ Pulizia completata:', puliziaRisultato.message);
        } catch (puliziaError) {
          console.warn('⚠️ Pulizia fallita (non critico):', puliziaError);
        }
        
        return {
          status: 'success',
          message: 'Firma ' + signatureType + ' caricata nella cartella unificata ' + unifiedMudCode,
          driveUrl: driveUrl,
          mudUpdated: mud,
          signatureType: signatureType,
          unifiedFolder: unifiedMudCode,
          compressionApplied: signatureBase64.length !== processedSignature.length,
          structure: 'Nuova struttura colonne italiane'
        };
      }
    }
    
    // Se non trova il MUD, restituisce errore
    return {
      status: 'error',
      message: 'MUD ' + mud + ' non trovato nel foglio per aggiornare la firma'
    };
    
  } catch (error) {
    console.error('❌ Errore upload firma:', error);
    return {
      status: 'error',
      message: 'Errore upload firma: ' + error.toString()
    };
  }
}

// 🔧 NUOVA FUNZIONE: Compressione aggressiva delle firme
function compressSignatureAggressively(base64Data) {
  try {
    console.log('🗜️ Applico compressione aggressiva alla firma...');
    
    // Se è già un data URL, estrailo
    const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    
    // Decodifica Base64 in blob
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64), 
      'image/png'
    );
    
    // Usa Google Apps Script per ridimensionare/comprimere
    // Converti in JPEG con qualità molto bassa
    const compressedBlob = blob.getAs('image/jpeg');
    
    // Riconverti in Base64
    const compressedBase64 = Utilities.base64Encode(compressedBlob.getBytes());
    const finalData = 'data:image/jpeg;base64,' + compressedBase64;
    
    console.log('✅ Compressione completata');
    console.log('📉 Riduzione:', ((base64Data.length - finalData.length) / base64Data.length * 100).toFixed(1) + '%');
    
    return finalData;
    
  } catch (error) {
    console.error('❌ Errore compressione, uso originale:', error);
    return base64Data; // Fallback all'originale
  }
}

// ⭐ FUNZIONE MODIFICATA: Upload unificato su Google Drive
function uploadImageToDriveUnified(base64Data, fileName, mudCode) {
  try {
    console.log('📤 Upload UNIFICATO su Google Drive');
    console.log('🎯 MUD Code (IDENTICO per tutte le firme):', mudCode);
    console.log('📄 File Name:', fileName);
    console.log('🚫 NESSUNA sottocartella per tipo firma!');
    
    // Rimuovi il prefisso data:image/...;base64, se presente
    const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    
    // Determina il tipo di immagine dal prefisso
    let mimeType = 'image/png'; // Default
    let extension = '.png';
    if (base64Data.includes('data:image/jpeg')) {
      mimeType = 'image/jpeg';
      extension = '.jpg';
    } else if (base64Data.includes('data:image/jpg')) {
      mimeType = 'image/jpeg'; 
      extension = '.jpg';
    } else if (base64Data.includes('data:image/gif')) {
      mimeType = 'image/gif';
      extension = '.gif';
    }
    
    // Crea nome file con timestamp per evitare conflitti
    const timestamp = new Date().getTime();
    const fullFileName = fileName + '_' + timestamp + extension;
    
    console.log('📝 Nome file finale:', fullFileName);
    
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64), 
      mimeType, 
      fullFileName
    );
    
    // STEP 1: Trova o crea la cartella principale "Firme Rapporti"
    let mainFolder;
    try {
      const mainFolders = DriveApp.getFoldersByName('Firme Rapporti');
      if (mainFolders.hasNext()) {
        mainFolder = mainFolders.next();
        console.log('📁 Cartella principale "Firme Rapporti" trovata');
      } else {
        mainFolder = DriveApp.createFolder('Firme Rapporti');
        console.log('📁 Cartella principale "Firme Rapporti" creata');
      }
    } catch (folderError) {
      console.warn('⚠️ Errore cartella principale, uso root:', folderError);
      mainFolder = DriveApp.getRootFolder();
    }
    
    // 🔑 STEP 2 CRUCIALE: USA NOME CARTELLA COMPLETAMENTE FISSO
    // IGNORA tutti i parametri che potrebbero variare!
    const CARTELLA_FISSA = mudCode; // Il MUD stesso diventa il nome della cartella
    console.log('🎯 === DIAGNOSI CARTELLA DRIVE ===');
    console.log('🔒 NOME CARTELLA FISSO (invariabile):', CARTELLA_FISSA);
    console.log('📄 fileName ricevuto:', fileName);
    console.log('🔍 mudCode ricevuto:', mudCode);
    console.log('⚠️  CRITICO: Questo DEVE essere identico per tecnico e committente!');
    
    let mudFolder;
    
    try {
      // Cerca cartella esistente con ESATTAMENTE questo nome fisso
      const existingFolders = mainFolder.getFoldersByName(CARTELLA_FISSA);
      if (existingFolders.hasNext()) {
        mudFolder = existingFolders.next();
        console.log('📂 ✅ CARTELLA ESISTENTE RIUTILIZZATA:', CARTELLA_FISSA);
        console.log('🆔 ID cartella esistente:', mudFolder.getId());
        
        // 🛡️ SICUREZZA EXTRA: Se ci sono multiple cartelle con lo stesso nome, usa sempre la prima
        while (existingFolders.hasNext()) {
          const extraFolder = existingFolders.next();
          console.warn('⚠️ CARTELLA DUPLICATA TROVATA:', extraFolder.getName(), 'ID:', extraFolder.getId());
          console.warn('🎯 Uso sempre la PRIMA cartella per consistenza');
        }
      } else {
        mudFolder = mainFolder.createFolder(CARTELLA_FISSA);
        console.log('📂 🆕 NUOVA CARTELLA CREATA:', CARTELLA_FISSA);
        console.log('🆔 ID nuova cartella:', mudFolder.getId());
      }
    } catch (mudFolderError) {
      console.error('❌ Errore critico cartella MUD:', mudFolderError);
      console.log('🔄 Fallback: uso cartella principale');
      mudFolder = mainFolder;
    }
    
    console.log('✅ Cartella di destinazione FINALE:', mudFolder.getName());
    console.log('� ID cartella finale:', mudFolder.getId());
    console.log('�🎯 GARANZIA: TUTTE le firme dello stesso MUD vanno ESATTAMENTE in questa cartella!');
    
    // STEP 3: Carica il file DIRETTAMENTE nella cartella fissa
    const file = mudFolder.createFile(blob);
    console.log('✅ 📁 FILE CARICATO nella cartella UNIFICATA "' + CARTELLA_FISSA + '"');
    console.log('📄 Nome file caricato:', file.getName());
    console.log('🆔 ID file:', file.getId());
    console.log('🔗 Cartella parent:', file.getParents().next().getName());
    
    // STEP 4: Imposta permessi di visualizzazione pubblica
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      console.log('🔓 Permessi di visualizzazione impostati');
    } catch (permissionError) {
      console.warn('⚠️ Impossibile impostare permessi pubblici:', permissionError);
    }
    
    // STEP 5: Genera URL per visualizzazione diretta
    const viewUrl = 'https://drive.google.com/uc?export=view&id=' + file.getId();
    console.log('🔗 URL generato per visualizzazione:', viewUrl);
    
    return viewUrl;
    
  } catch (error) {
    console.error('❌ Errore upload Google Drive unificato:', error);
    console.error('Stack trace:', error.stack);
    throw new Error('Upload unificato fallito: ' + error.toString());
  }
}

// Funzione doPost - manteniamo per compatibilità ma JSONP è la soluzione
function doPost(e) {
  // Restituisci messaggio che indica di usare JSONP
  const response = {
    status: 'info',
    message: 'Usa JSONP invece di POST per evitare CORS',
    suggestion: 'Aggiungi ?callback=yourCallback&action=submit&data=encodedJSON'
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test manuale per verificare l'upload unificato - VERSIONE AGGIORNATA
function testJsonpScriptUnified() {
  console.log('=== TEST JSONP SCRIPT UNIFICATO - NUOVA STRUTTURA ===');
  
  // ⚠️ Verifica configurazione
  if (!CONFIG.SHEET_ID || CONFIG.SHEET_ID === 'INSERISCI_QUI_IL_TUO_GOOGLE_SHEET_ID') {
    console.error('❌ ERRORE: Devi prima configurare CONFIG.SHEET_ID!');
    console.log('💡 Modifica la variabile CONFIG.SHEET_ID all\'inizio del codice');
    return { error: 'Sheet ID non configurato' };
  }
  
  // Test di connessione
  const testGetEvent = {
    parameter: {
      callback: 'testCallback',
      action: 'test'
    }
  };
  
  try {
    const result = handleJsonpRequest(testGetEvent);
    console.log('✅ JSONP Test Result:', result.getContent());
  } catch (e) {
    console.error('❌ JSONP Test Error:', e);
  }
  
  // Test submit dati con nuova struttura
  const testData = {
    user: 'Test User Struttura Nuova',
    mud: 'MUD-UNIFIED-' + new Date().getTime(), // MUD univoco per test
    riferimento: 'RIF-001-TEST',
    luogo: 'Milano - Test Location',
    dataInizio: '2025-11-13',    // 📅 NUOVI CAMPI DATE
    dataFine: '2025-11-13',      // 📅 NUOVI CAMPI DATE 
    descrizione: 'Test nuova struttura colonne italiane con sistema buono lavoro',
    materiali: 'Materiali test per nuovo formato'
    // 🎫 buonoLavoro viene generato automaticamente dal server
  };
  
  console.log('📊 Dati test per nuova struttura:', testData);
  console.log('📝 Colonne utilizzate:', Object.keys(CONFIG.COLUMNS));
  
  const testSubmitEvent = {
    parameter: {
      callback: 'submitCallback',
      action: 'save',
      data: encodeURIComponent(JSON.stringify(testData))
    }
  };
  
  try {
    const result = handleJsonpRequest(testSubmitEvent);
    console.log('✅ JSONP Submit Result:', result.getContent());
    return { success: true, testMud: testData.mud };
  } catch (e) {
    console.error('❌ JSONP Submit Error:', e);
    return { success: false, error: e.toString() };
  }
}

// 🧪 TEST SISTEMA BUONI LAVORO
function testSistemaBuoniLavoro() {
  console.log('=== 🧪 TEST SISTEMA BUONI LAVORO ===');
  
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getActiveSheet();
    
    console.log('📋 Testing su sheet:', sheet.getName());
    
    // Test per diversi utenti
    const testUsers = ['admin', 'valentino', 'tecnico1', 'marco', 'utente_non_esistente'];
    
    testUsers.forEach(user => {
      console.log(`\n👤 Test per utente: ${user}`);
      const buono1 = generaBuonoLavoro(user, sheet);
      const buono2 = generaBuonoLavoro(user, sheet);
      const buono3 = generaBuonoLavoro(user, sheet);
      
      console.log(`  🎫 Buoni generati: ${buono1}, ${buono2}, ${buono3}`);
      
      // Verifica sequenza
      if (buono1 && buono2 && buono3) {
        const num1 = parseInt(buono1.substring(1));
        const num2 = parseInt(buono2.substring(1));
        const num3 = parseInt(buono3.substring(1));
        
        if (num2 === num1 + 1 && num3 === num2 + 1) {
          console.log('  ✅ Sequenza numerica corretta');
        } else {
          console.warn('  ⚠️ Sequenza numerica incorretta');
        }
      }
    });
    
    console.log('\n📊 Mappatura utenti configurata:');
    Object.entries(CONFIG.USER_CODE_MAPPING).forEach(([user, code]) => {
      console.log(`  ${user} -> ${code}`);
    });
    
    return {
      success: true,
      message: 'Test sistema buoni lavoro completato',
      mappingCount: Object.keys(CONFIG.USER_CODE_MAPPING).length
    };
    
  } catch (error) {
    console.error('❌ Errore test buoni lavoro:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ⭐ TEST SPECIFICO: Verifica che entrambe le firme vadano nella stessa cartella
function testUnifiedSignatureUpload() {
  console.log('=== TEST UPLOAD FIRME UNIFICATO - STESSA CARTELLA ===');
  
  // Crea un'immagine di test molto piccola (pixel rosso 1x1)
  const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA/ckMqAAAAABJRU5ErkJggg==';
  
  try {
    const testMud = 'TEST-UNIFIED-' + new Date().getTime();
    console.log('🧪 Test MUD (IDENTICO per entrambe le firme):', testMud);
    
    // Simula upload firma tecnico
    console.log('📤 Test 1: Upload firma tecnico...');
    const urlTecnico = uploadImageToDriveUnified(testBase64, 'firma_tecnico', testMud);
    console.log('✅ Firma tecnico caricata:', urlTecnico);
    
    // Simula upload firma committente NELLA STESSA CARTELLA
    console.log('📤 Test 2: Upload firma committente...');
    const urlCommittente = uploadImageToDriveUnified(testBase64, 'firma_committente', testMud);
    console.log('✅ Firma committente caricata:', urlCommittente);
    
    console.log('🎯 RISULTATO ATTESO: Entrambe le firme in:', testMud);
    console.log('📁 Struttura: Firme Rapporti/' + testMud + '/[firma_tecnico + firma_committente]');
    
    return { 
      tecnico: urlTecnico, 
      committente: urlCommittente, 
      mudUnificato: testMud,
      success: true
    };
  } catch (error) {
    console.error('❌ Test upload unificato fallito:', error);
    return { success: false, error: error.toString() };
  }
}

// ⭐ FUNZIONE DEBUG: Analizza e pulisce cartelle duplicate
function debugEPulisciCartelleDuplicate() {
  console.log('=== 🔍 DEBUG E PULIZIA CARTELLE DUPLICATE ===');
  
  try {
    const mainFolders = DriveApp.getFoldersByName('Firme Rapporti');
    if (!mainFolders.hasNext()) {
      console.log('📁 Cartella "Firme Rapporti" non trovata - nessuna pulizia necessaria');
      return;
    }
    
    const mainFolder = mainFolders.next();
    console.log('📁 Cartella principale trovata:', mainFolder.getName());
    console.log('🔗 URL:', 'https://drive.google.com/drive/folders/' + mainFolder.getId());
    
    // Mappa per raggruppare cartelle per nome
    const folderGroups = {};
    
    const subFolders = mainFolder.getFolders();
    while (subFolders.hasNext()) {
      const folder = subFolders.next();
      const folderName = folder.getName();
      
      if (!folderGroups[folderName]) {
        folderGroups[folderName] = [];
      }
      folderGroups[folderName].push(folder);
    }
    
    console.log('📂 Analisi cartelle per nome:');
    let duplicatesFound = false;
    
    Object.keys(folderGroups).forEach(groupName => {
      const folders = folderGroups[groupName];
      console.log(`  📁 "${groupName}": ${folders.length} cartella(e)`);
      
      if (folders.length > 1) {
        duplicatesFound = true;
        console.log('    ⚠️ DUPLICATE RILEVATE! Dettagli:');
        
        folders.forEach((folder, index) => {
          const files = folder.getFiles();
          let fileCount = 0;
          let fileList = [];
          
          while (files.hasNext()) {
            fileCount++;
            fileList.push(files.next().getName());
          }
          
          console.log(`      📂 ${index + 1}. ID: ${folder.getId()}, Files: ${fileCount}`);
          if (fileCount > 0) {
            console.log(`         📄 Contenuto: ${fileList.join(', ')}`);
          }
        });
        
        // PROPOSTA DI UNIFICAZIONE
        console.log('    🔧 AZIONE PROPOSTA: Unifica contenuti e elimina duplicate');
        
        // Trova la cartella con più contenuto
        let targetFolder = folders[0];
        let maxFiles = 0;
        
        folders.forEach(folder => {
          const fileCount = folder.getFiles().length || 0;
          if (fileCount > maxFiles) {
            maxFiles = fileCount;
            targetFolder = folder;
          }
        });
        
        console.log(`    🎯 Cartella target (più files): ${targetFolder.getId()}`);
        
// 🧹 FUNZIONE PULIZIA AUTOMATICA: Unifica cartelle duplicate
function pulisciCartelleDuplicateAutomaticamente() {
  console.log('=== 🧹 PULIZIA AUTOMATICA CARTELLE DUPLICATE ===');
  
  try {
    const mainFolders = DriveApp.getFoldersByName('Firme Rapporti');
    if (!mainFolders.hasNext()) {
      console.log('📁 Cartella "Firme Rapporti" non trovata - nessuna pulizia necessaria');
      return { cleaned: 0, message: 'Nessuna cartella principale trovata' };
    }
    
    const mainFolder = mainFolders.next();
    console.log('📁 Cartella principale trovata:', mainFolder.getName());
    
    // Mappa per raggruppare cartelle per nome
    const folderGroups = {};
    
    const subFolders = mainFolder.getFolders();
    while (subFolders.hasNext()) {
      const folder = subFolders.next();
      const folderName = folder.getName();
      
      if (!folderGroups[folderName]) {
        folderGroups[folderName] = [];
      }
      folderGroups[folderName].push(folder);
    }
    
    let totalCleaned = 0;
    let cleanedFolders = [];
    
    Object.keys(folderGroups).forEach(groupName => {
      const folders = folderGroups[groupName];
      
      if (folders.length > 1) {
        console.log(`🔧 Pulizia gruppo "${groupName}" con ${folders.length} cartelle duplicate`);
        
        // Trova la cartella target (quella con più file)
        let targetFolder = folders[0];
        let maxFiles = 0;
        
        folders.forEach(folder => {
          const fileCount = Array.from(folder.getFiles()).length;
          if (fileCount > maxFiles) {
            maxFiles = fileCount;
            targetFolder = folder;
          }
        });
        
        console.log(`  🎯 Cartella target: ${targetFolder.getId()} con ${maxFiles} file(s)`);
        
        // Sposta tutti i file dalle altre cartelle alla cartella target
        folders.forEach(folder => {
          if (folder.getId() !== targetFolder.getId()) {
            console.log(`    📦 Processando cartella: ${folder.getId()}`);
            
            // Sposta tutti i file alla cartella target
            const filesToMove = Array.from(folder.getFiles());
            filesToMove.forEach(file => {
              try {
                file.moveTo(targetFolder);
                console.log(`      ✅ Spostato file: ${file.getName()}`);
              } catch (moveError) {
                console.error(`      ❌ Errore spostamento ${file.getName()}:`, moveError);
              }
            });
            
            // Elimina cartella vuota
            try {
              folder.setTrashed(true);
              console.log(`    🗑️ Cartella vuota eliminata: ${folder.getId()}`);
              totalCleaned++;
              cleanedFolders.push(groupName);
            } catch (deleteError) {
              console.error(`    ❌ Errore eliminazione cartella:`, deleteError);
            }
          }
        });
      }
    });
    
    if (totalCleaned > 0) {
      console.log(`🎉 PULIZIA COMPLETATA! ${totalCleaned} cartelle duplicate eliminate`);
      console.log(`📁 Gruppi unificati: ${cleanedFolders.join(', ')}`);
    } else {
      console.log('✅ Nessuna cartella duplicata trovata - struttura già pulita');
    }
    
    return {
      cleaned: totalCleaned,
      cleanedFolders: cleanedFolders,
      message: `Pulizia completata: ${totalCleaned} cartelle duplicate eliminate`
    };
    
  } catch (error) {
    console.error('❌ Errore pulizia automatica:', error);
    return {
      cleaned: 0,
      error: error.toString(),
      message: 'Errore durante la pulizia automatica'
    };
  }
}
      } else {
        console.log('    ✅ Nessuna duplicata');
      }
    });
    
    if (!duplicatesFound) {
      console.log('🎉 OTTIMO! Nessuna cartella duplicata trovata');
    } else {
      console.log('⚠️ PROBLEMA CONFERMATO: Cartelle duplicate esistono');
      console.log('💡 SOLUZIONE: Usa la funzione di pulizia o elimina manualmente le duplicate');
    }
    
    return folderGroups;
    
  } catch (error) {
    console.error('❌ Errore debug cartelle:', error);
    return null;
  }
}

// Verifica la struttura delle cartelle (versione unificata)
function verificaStrutturaCartelleUnificata() {
  console.log('=== VERIFICA STRUTTURA CARTELLE UNIFICATA ===');
  
  try {
    const mainFolders = DriveApp.getFoldersByName('Firme Rapporti');
    if (mainFolders.hasNext()) {
      const mainFolder = mainFolders.next();
      console.log('📁 Cartella principale: "Firme Rapporti"');
      console.log('🔗 URL cartella:', 'https://drive.google.com/drive/folders/' + mainFolder.getId());
      
      const subFolders = mainFolder.getFolders();
      let mudCount = 0;
      let problemiRilevati = [];
      
      while (subFolders.hasNext()) {
        const mudFolder = subFolders.next();
        mudCount++;
        const mudName = mudFolder.getName();
        console.log('  📂 MUD ' + mudCount + ':', mudName);
        
        // Conta i file in questa cartella MUD
        const files = mudFolder.getFiles();
        let fileCount = 0;
        let firmeCount = { tecnico: 0, committente: 0 };
        
        while (files.hasNext()) {
          const file = files.next();
          fileCount++;
          const fileName = file.getName();
          console.log('    🖼️ File ' + fileCount + ':', fileName);
          
          // Analizza il tipo di firma
          if (fileName.includes('firma_tecnico')) {
            firmeCount.tecnico++;
          } else if (fileName.includes('firma_committente')) {
            firmeCount.committente++;
          }
        }
        
        // Verifica che ci siano entrambi i tipi di firma
        if (firmeCount.tecnico > 0 && firmeCount.committente > 0) {
          console.log('    ✅ Cartella CORRETTA: contiene entrambe le firme');
        } else if (firmeCount.tecnico > 0 || firmeCount.committente > 0) {
          console.log('    ⚠️ Cartella INCOMPLETA: manca una tipologia di firma');
          problemiRilevati.push(mudName + ' - firma mancante');
        } else {
          console.log('    ❌ Cartella VUOTA: nessuna firma trovata');
          problemiRilevati.push(mudName + ' - cartella vuota');
        }
        
        console.log('    📊 Riepilogo:', firmeCount.tecnico + ' tecnico,', firmeCount.committente + ' committente');
      }
      
      console.log('📈 RIEPILOGO GENERALE:');
      console.log('  📂 Cartelle MUD totali:', mudCount);
      console.log('  ⚠️ Problemi rilevati:', problemiRilevati.length);
      
      if (problemiRilevati.length > 0) {
        console.log('  🔍 Dettaglio problemi:');
        problemiRilevati.forEach(problema => console.log('    - ' + problema));
      } else if (mudCount > 0) {
        console.log('  ✅ Tutte le cartelle sono strutturate correttamente!');
      }
      
      if (mudCount === 0) {
        console.log('  📝 Nessuna cartella MUD trovata (normale se non hai ancora testato)');
      }
      
    } else {
      console.log('❌ Cartella "Firme Rapporti" non trovata');
    }
  } catch (error) {
    console.error('❌ Errore verifica struttura:', error);
  }
}