// =========================================================================
// BANLIE COMPUTING - BACKEND API v2.2.5 (Stable Sync) wiht 2.8.8 html
// =========================================================================

function doPost(e) {
  var action = e.parameter.action;
  var dataObj = JSON.parse(e.postData.contents);
  var result = {};

  try {
    if (action === "saveService") {
      result = saveService(dataObj);
    } else if (action === "deleteService") {
      result = deleteService(dataObj.id);
    } else if (action === "saveKatalog") {
      result = saveKatalog(dataObj);
    } else if (action === "deleteKatalog") {
      result = deleteKatalog(dataObj.id);
    } else if (action === "saveUser") {
      result = saveUser(dataObj);
    } else if (action === "deleteUser") {
      result = deleteUser(dataObj.username);
    } else if (action === "saveKamus") {
      result = saveKamus(dataObj);
    } else if (action === "saveWaTemplate") {
      result = saveWaTemplate(dataObj.key, dataObj.text);
    } else {
      result = { error: "Action tidak dikenali" };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message, stack: err.stack })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var action = e.parameter.action;
  var result = {};
  
  try {
    if (action === "getServices") {
      result = getServices();
    } else if (action === "getKatalog") {
      result = getKatalog();
    } else if (action === "getUsers") {
      result = getUsers();
    } else if (action === "getSettings") {
      result = getSettings();
    } else {
      result = { error: "Gunakan parameter action (getServices, getKatalog, getUsers, getSettings)" };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ================= FUNGSI DATA SERVISAN =================

function getServices() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Services");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var services = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) {
      services.push({
        id: row[0],
        tanggalMasuk: row[1],
        nama: row[2],
        wa: row[3],
        jenis: row[4],
        merek: row[5],
        tipe: row[6],
        snid: row[7],
        kelengkapan: row[8],
        masalah: row[9],
        deskripsi: row[10],
        biayaEstimasi: row[11],
        biayaAkhir: row[12],
        garansi: row[13],
        status: row[14],
        techId: row[15],
        catatan: row[16],
        history: row[17] ? row[17] : "[]",
        pesanChat: row[18] ? row[18] : "[]",
        butuhKonfirmasi: (row[19] === true || row[19] === "TRUE" || row[19] === "true"),
        unreadByAdmin: (row[20] === true || row[20] === "TRUE" || row[20] === "true"),
        unreadByCust: (row[21] === true || row[21] === "TRUE" || row[21] === "true")
      });
    }
  }
  return services;
}

function saveService(dataObj) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Services");
  if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Services");
  
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == dataObj.id) {
      rowIndex = i + 1;
      break;
    }
  }
  
  var rowData = [
    dataObj.id,
    dataObj.tanggalMasuk || "",
    dataObj.nama || "",
    dataObj.wa || "",
    dataObj.jenis || "",
    dataObj.merek || "",
    dataObj.tipe || "",
    dataObj.snid || "",
    dataObj.kelengkapan || "",
    dataObj.masalah || "",
    dataObj.deskripsi || "",
    dataObj.biayaEstimasi || "",
    dataObj.biayaAkhir || 0,
    dataObj.garansi || "",
    dataObj.status || "Masuk",
    dataObj.techId || "",
    dataObj.catatan || "",
    dataObj.history || "[]",
    dataObj.pesanChat || "[]",
    dataObj.butuhKonfirmasi === true,
    dataObj.unreadByAdmin === true,
    dataObj.unreadByCust === true
  ];
  
  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  return { success: true, id: dataObj.id };
}

function deleteService(id) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Services");
  if (!sheet) return { success: false, error: "Sheet tidak ada" };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: "ID tidak ditemukan" };
}

// ================= FUNGSI DATA KATALOG / PENJUALAN =================

function getKatalog() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Katalog");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var katalog = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) {
      katalog.push({
        id: row[0],
        merek: row[1],
        tipe: row[2],
        spek: row[3],
        harga: row[4],
        stok: row[5],
        warna: row[6],
        garansi: row[7],
        tanggal: row[8],
        statusJual: row[9],
        fotos: row[10] ? row[10] : "[]",
        tanggalTerjual: row[11] || "",
        penjual: row[12] || "",
        email: row[13] || "",
        pass: row[14] || "",
        catatanInternal: row[15] || ""
      });
    }
  }
  return katalog;
}

function saveKatalog(dataObj) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Katalog");
  if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Katalog");
  
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == dataObj.id) {
      rowIndex = i + 1;
      break;
    }
  }
  
  var rowData = [
    dataObj.id, dataObj.merek || "", dataObj.tipe || "", dataObj.spek || "", 
    dataObj.harga || 0, dataObj.stok || 0, dataObj.warna || "", dataObj.garansi || "", 
    dataObj.tanggal || "", dataObj.statusJual || "Tersedia", dataObj.fotos || "[]",
    dataObj.tanggalTerjual || "", dataObj.penjual || "", dataObj.email || "", 
    dataObj.pass || "", dataObj.catatanInternal || ""
  ];
  
  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  return { success: true };
}

function deleteKatalog(id) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Katalog");
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

// ================= FUNGSI USERS & PENGATURAN =================

function getUsers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var users = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      users.push({
        username: data[i][0],
        password: data[i][1],
        role: data[i][2],
        nama: data[i][3]
      });
    }
  }
  return users;
}

function saveUser(dataObj) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Users");
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == dataObj.username) { rowIndex = i + 1; break; }
  }
  var rowData = [dataObj.username, dataObj.password, dataObj.role, dataObj.nama || ""];
  if (rowIndex > -1) sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  else sheet.appendRow(rowData);
  return { success: true };
}

function deleteUser(username) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == username) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

function getSettings() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  if (!sheet) return { kamus: null, waTemplates: null };
  var data = sheet.getDataRange().getValues();
  var settings = { kamus: null, waTemplates: {} };
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === "kamus") {
      try { settings.kamus = JSON.parse(data[i][1]); } catch(e) {}
    } else if (String(data[i][0]).indexOf("wa_") === 0) {
      var key = String(data[i][0]).replace("wa_", "");
      settings.waTemplates[key] = data[i][1];
    }
  }
  return settings;
}

function saveKamus(dataObj) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  if (!sheet) { sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Settings"); sheet.appendRow(["Key", "Value"]); }
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === "kamus") { rowIndex = i + 1; break; }
  }
  if (rowIndex > -1) { sheet.getRange(rowIndex, 2).setValue(JSON.stringify(dataObj)); } 
  else { sheet.appendRow(["kamus", JSON.stringify(dataObj)]); }
  return { success: true };
}

function saveWaTemplate(key, text) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  if (!sheet) { sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Settings"); sheet.appendRow(["Key", "Value"]); }
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  var rowKey = "wa_" + key;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === rowKey) { rowIndex = i + 1; break; }
  }
  if (rowIndex > -1) { sheet.getRange(rowIndex, 2).setValue(text); } 
  else { sheet.appendRow([rowKey, text]); }
  return { success: true };
}
