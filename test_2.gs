function myFunction() {
  
  const machinesArr = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.LISTS.NAME).getRange(2, 1, 2).getValues().flat();

  console.log(machinesArr);

}



function test_broadcastMsg() {

  const msg = 'test';

  lineClient.simpleBroadcastMessage(msg);

}


