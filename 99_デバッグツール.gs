function outputLogs(title, message) {

  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.LOGS.NAME);

  sh.appendRow([new Date(), title, message]);


}
