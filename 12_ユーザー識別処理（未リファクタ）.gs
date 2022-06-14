function saveUserTmpRecord_(userId, value, colmunNum) {

  const sh = SS.getSheetByName(SHEET_INFO.USERS.NAME);
  
  const userIdsArr = sh.getRange(2, 1, sh.getLastRow() - 1).getValues().flat();
  const rowNum = userIdsArr.indexOf(userId) + 2;

  return sh.getRange(rowNum, colmunNum).setValue(value);

}

function getUserTmpRecord_(userId, colmunNum) {

  const sh = SS.getSheetByName(SHEET_INFO.USERS.NAME);
  
  const userIdsArr = sh.getRange(2, 1, sh.getLastRow() - 1).getValues().flat();
  const rowNum = userIdsArr.indexOf(userId) + 2;

  return sh.getRange(rowNum, colmunNum).getValue();

}

function getReportValues_(userId) {

  const sh = SS.getSheetByName(SHEET_INFO.USERS.NAME);
  const userIdsArr = sh.getRange(2, 1, sh.getLastRow() - 1).getValues().flat();
  const rowNum = userIdsArr.indexOf(userId) + 2;

  const userTmpRecordArr = sh.getRange(rowNum, 2, 1, sh.getLastColumn() - 1).getValues().flat();

  return userTmpRecordArr;

}

function makeConfirmMsg_(userId) {

  const [workerName, startTime, endTime, machine, minutes] = getReportValues_(userId);

  const dispStartTime = Utilities.formatDate(startTime, 'JST', 'MM/dd HH:mm');
  const dispEndTime = Utilities.formatDate(endTime, 'JST', 'MM/dd HH:mm');
  
  const msg = `この日報を登録しますか？

コンバイン：${machine}
作業者：${workerName}
開始：${dispStartTime}
終了：${dispEndTime}
合計時間：${minutes} 分`

  return msg;

}


function saveReport_(userId) {

  const values = getReportValues_(userId);

  const sh = SS.getSheetByName(SHEET_INFO.REPORTS.NAME);

  return sh.appendRow(values);
}


function getMinutes_(startDatetime, endDatetime) {

  const minutes = (endDatetime - startDatetime) / 60000;
  let roundedMinutes = Math.floor(minutes / 15) * 15;

  roundedMinutes = minutes % 15 >= 10 ? roundedMinutes + 15 : roundedMinutes

  return roundedMinutes;
}


/**
 * LINEユーザーIDがデータベースに保管されているかどうかをチェックし、無ければ登録する関数
 */

function checkUserId_(userId) {

  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.USERS.NAME);

  // ユーザーシートから該当のIDを探す
  const userIds = sh.getRange(2, 1, sh.getLastRow()-1).getValues().flat();
  const idx = userIds.indexOf(userId);

  // ユーザーが既に登録されていればリターン
  if(idx >= 0) return;

  // ユーザーが登録されていなければ行追加
  sh.appendRow([userId]);

}


function test_checkUserId() {

  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.USERS.NAME);

  const userId = 'U4e99427124639a7e9b3a1e739e9ebeaa';

  // ユーザーシートから該当のIDを探す
  const userIds = sh.getRange(2, 1, sh.getLastRow()-1).getValues().flat();
  const idx = userIds.indexOf(userId);

  console.log(userIds);
  console.log(idx);

  // // ユーザーが既に登録されていればリターン
  // if(idx >= 0) return;

  // // ユーザーが登録されていなければ行追加
  // sh.appendRow([userId])

}