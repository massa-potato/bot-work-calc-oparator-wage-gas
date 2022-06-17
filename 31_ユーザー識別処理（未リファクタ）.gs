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
