/**
 * LINEに何かアクションがあったときに実行される関数
 * @param e {object} - LINEのWebhookイベントオブジェクト（JSONオブジェクト）
 * 
 * 参考：https://developers.line.biz/ja/reference/messaging-api/#webhook-event-objects
 */
function doPost(e) {

  const json = JSON.parse(e.postData.contents);
  const event = json.events[0]
  const ev_type = json.events[0].type;

  if(ev_type === 'postback') { handlePostbackAction_(event) };
  if(ev_type === 'message') { handleMessageAction_(event) };

  return;
}

/**
 * LINEのメッセージアクションに対して行う分岐処理
 * @param event {object} - LINEのWebhookイベントオブジェクトから得られたオブジェクト
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
 * @param event {object} - LINEのWebhookイベントオブジェクトから得られたオブジェクト
 */
function handlePostbackAction_(event) {
  
  const postbackData = event.postback.data;
  const postback = postbackData.split('=')[0];

  if(postback === 'chooseMachine') {
    entryDatetime_(event, 'start');
    return;
  };

  if(postback === 'chooseStartTime') {
    entryDatetime_(event, 'end');
    return;
  }

  if(postback === 'chooseEndTime') {
    // [TODO]confirmDailyReport_関数を実装
    lineClient.simpleBroadcastMessage('Done!');
    return;
  }

  return;

}


/**
 * 日報入力機能① ボタンテンプレートメッセージで機械を選択する処理
 * @param event {object} - LINEのWebhookイベントオブジェクトから得られたオブジェクト
 * @return {object} - リプライメッセージのレスポンスオブジェクト
 */
function entryMachine_(event) {

  const replyToken = event.replyToken;

  const imageUrl = 'https://www.nh-hft.co.jp/wp/wp-content/uploads/2019/09/NH-CX5-CX6.jpg';
  const title = '日報入力';
  const text = 'コンバインを選択してください。';

  const machinesArr = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.LISTS.NAME).getRange(2, 1, 2).getValues().flat();

  const actions = [
    {
      type: 'postback',
      label: machinesArr[0],
      data: 'chooseMachine=0'
    }, {
      type: 'postback',
      label: machinesArr[1],
      data: 'chooseMachine=1'
    }
  ];

  const messages = [{
    type: 'template',
    altText: 'コンバインを選択',
    template: {
      type: 'buttons',
      thumbnailImageUrl: imageUrl,
      title: title,
      text: text,
      actions: actions
    }
  }];

  return lineClient.replyMessages(replyToken, messages);

}

/**
 * 日報入力機能① 日時選択アクションで開始・終了日時を選択する処理
 * @param event {object} - LINEのWebhookイベントオブジェクトから得られたオブジェクト
 * @param option {string} - どの日時選択かを示すオプション文字列
 * @return {object} - リプライメッセージのレスポンスオブジェクト
 */
function entryDatetime_(event, option) {

    const replyToken = event.replyToken;

    let optionText, optionData;

    switch(option) {
      case 'start':
        optionText = 'スタート';
        optionData = 'chooseStartTime';
        break;
  
      case 'end':
        optionText = '作業を終えた';
        optionData = 'chooseEndTime';
        break;

    }
    const text = `${optionText}時間を入力してください。`
    const label = '入力';

    const actions = [
      {
        type: 'datetimepicker',
        label: label,
        data: optionData,
        mode: 'datetime'
      }
    ];

    const messages = [{
      type: 'template',
      altText: 'スタート時間を選択',
      template: {
        type: 'buttons',
        text: text,
        actions: actions
      }
    }];

    return lineClient.replyMessages(replyToken, messages);

}