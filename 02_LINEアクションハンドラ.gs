/**
 * LINEのメッセージアクションに対して行う分岐処理
 * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
 */
function handleMessageAction_(event) {

  const messageText = event.message.text;

  if(messageText === '日報入力') {
    LineActions.entryMachine(event);
    return;
  }

  if(messageText === '確認') {
    LineActions.listRecords(event);
    return;
  }

  if(messageText === '集計') {
    LineActions.aggrigateRecords(event);
    return;
  }

  return;

}


/**
 * LINEのポストバックアクションに対して行う分岐処理
 * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
 */
function handlePostbackAction_(event) {
  
  const [postbackData, postbackParam] = event.postback.data.split('=');

  const user = new UserData(event.source.userId);

  // ①機械選択の後
  if(postbackData === 'chooseMachine') {
    user.saveChooseMachine(postbackParam);

    LineActions.entryDatetime(event, 'start');
    return 
  };

  // ②スタート時間選択の後
  if(postbackData === 'chooseStartTime') {
    const startTime = event.postback.params.datetime;
    user.saveChooseTime(startTime, 'start');
    LineActions.entryDatetime(event, 'end');
    return;
  }

  // ③終了時間選択の後
  if(postbackData === 'chooseEndTime') {

    const endTime = event.postback.params.datetime;
    const startTime = user.getTmpValuesObj()['TMP_S_TIME'];

    user.saveChooseTime(endTime, 'end');
    if(user.saveMinutes(startTime, endTime) === false) { return LineActions.replyIncorrectTime(event) }; // 作業時間が0以下の場合はリプライを返して終了

    LineActions.confirmReport(event, user.getTmpValuesObj());
    return;
  }

  if(postbackData === 'confirmedReport') {

    if(postbackParam === 'yes') {
      const report = new ReportData();
  
      report.saveReport(user.getTmpValuesObj());
      LineActions.replyEntryReport(event);

    }

    if(postbackParam === 'no') {
      LineActions.replyCancelEntryReport(event);
    }
  }

  return;

}