/**
 * LINEのメッセージアクションに対して行う分岐処理
 * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
 */
function handleMessageAction_(event) {

  const message = event.message.text;

  if(message === '日報入力') {
    entryMachine_(event);
    return;
  }

  if(message === '確認') {
    // [TODO] 関数作成
    // comfirmRecords_(event);
    return;
  }

  if(message === '集計') {
    // [TODO]関数作成
    // aggrigateRecords_(event);
    return;
  }

  return;

}


/**
 * LINEのポストバックアクションに対して行う分岐処理
 * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
 */
function handlePostbackAction_(event) {
  
  const [data, param] = event.postback.data.split('=');
  const userId = event.source.userId;
  const replyToken = event.replyToken;

  let msg;

  // ①機械選択の後
  if(data === 'chooseMachine') {
    
    const machinesArr = SS.getSheetByName(SHEET_INFO.LISTS.NAME).getRange(2, 1, 2).getValues().flat();
    const machine = machinesArr[param];

    saveUserTmpRecord_(userId, machine, COLUMN_INFO.USERS.TMP_MACHINE.NO);
    entryDatetime_(event, 'start');

    return;
  };

  // ②スタート時間選択の後
  if(data === 'chooseStartTime') {
    const startDatetime = event.postback.params.datetime;

    saveUserTmpRecord_(userId, startDatetime, COLUMN_INFO.USERS.TMP_S_TIME.NO);
    entryDatetime_(event, 'end');

    return;
  }

  // ③終了時間選択の後
  if(data === 'chooseEndTime') {
    const endDatetime = new Date(event.postback.params.datetime);
    const startDatetime = new Date(getUserTmpRecord_(userId, COLUMN_INFO.USERS.TMP_S_TIME.NO));

    if(endDatetime <= startDatetime) {
      msg = 'もう一度入力してください。（終了時間は開始時間より後に設定してください）';
      return lineClient.simpleReplyMessage(replyToken, msg);
    }

    const minutes = getMinutes_(startDatetime, endDatetime);

    saveUserTmpRecord_(userId, endDatetime, COLUMN_INFO.USERS.TMP_E_TIME.NO);
    saveUserTmpRecord_(userId, minutes, COLUMN_INFO.USERS.TMP_MINUTES.NO);

    msg = makeConfirmMsg_(userId);

    const postbackOption = [
      {label: 'はい', data: 'confirmedReport=yes', displayText: 'はい'},
      {label: 'いいえ', data: 'confirmedReport=no', displayText: 'いいえ'}
    ];

    return lineClient.quickReply(replyToken, msg, postbackOption);
  }

  if(data === 'confirmedReport') {
    if(param === 'yes') {
      msg = '日報を登録しました！';
      saveReport_(userId);
      return lineClient.simpleReplyMessage(replyToken, msg);
    }

    if(param === 'no') {
      msg = 'もう一度入力してください。';
      return lineClient.simpleReplyMessage(replyToken, msg);
    }
  }

  return;

}