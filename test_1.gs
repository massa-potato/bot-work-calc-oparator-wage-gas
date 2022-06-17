/**
 * クイックリプライ用テスト関数
 * 関数名をdoPost(e)に修正して使用
 */
function test_quickReply_doPost(e) {

  const json = JSON.parse(e.postData.contents);
  const replyToken = json.events[0].replyToken;

  const ev_type = json.events[0].type;

  if(ev_type === 'postback') {
    
    const postbackData = json.events[0].postback.data;

    const msg = postbackData;

    return lineClient.simpleReplyMessage(replyToken, msg);d

  }

  if(ev_type === 'message') {

    const msg = 'これで良いですか？';
    const postbackOption = [
      {label: 'はい', data: 'confirm_yes', displayText: 'はい'},
      {label: 'いいえ', data: 'confirm_no', displayText: 'いいえ'}
    ];

    outputLogs('msg', msg);

    return lineClient.quickReply(replyToken, msg, postbackOption);

  }

}

/**
 * 日時選択アクション用テスト関数
 * 関数名をdoPost(e)に修正して使用
 */
function test_datetimePicker_doPost(e) {

  const json = JSON.parse(e.postData.contents);
  const replyToken = json.events[0].replyToken;

  const ev_type = json.events[0].type;

  if(ev_type === 'postback') {
    
    const postbackData = json.events[0].postback.data;
    const postbackParam = json.events[0].postback.params.datetime;

    const msg = `${postbackData}: ${postbackParam}`;

    const res = lineClient.simpleReplyMessage(replyToken, msg);

    return;

  }

  if(ev_type === 'message') {

    const text = 'スタート時間を入力してください。'
    const label = '入力';

    outputLogs('label', label);

    const actions = [
      {
        type: 'datetimepicker',
        label: label,
        data: 'startTime',
        mode: 'datetime'
      }
    ];

    outputLogs('actions', actions);

    const messages = [{
      type: 'template',
      altText: 'altTextが入ります',
      template: {
        type: 'buttons',
        text: text,
        actions: actions
      }
    }];

    outputLogs('messages', messages);

    const res = lineClient.replyMessages(replyToken, messages);

    outputLogs('res', res);

  }

}

/**
 * ボタンテンプレート用テスト関数
 * 関数名をdoPost(e)に修正して使用
 */
function test_buttonTemplate_doPost(e) {

  const json = JSON.parse(e.postData.contents);
  const replyToken = json.events[0].replyToken;

  const imageUrl = 'https://www.nh-hft.co.jp/wp/wp-content/uploads/2019/09/NH-CX5-CX6.jpg';
  const title = 'コンバインを選択';
  const text = 'テキストです';

  const machinesArr = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.LISTS.NAME).getRange(2, 1, 2).getValues().flat();

  const actions = [
    {
      type: 'message',
      label: machinesArr[0],
      text: `${machinesArr[0]}を選択しました。`
    }, {
      type: 'message',
      label: machinesArr[1],
      text: `${machinesArr[1]}を選択しました。`
    }
  ];

  const messages = [{
    type: 'template',
    altText: 'altTextが入ります',
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
 * おうむ返し用テスト関数
 * 関数名をdoPost(e)に修正して使用
 */
function test_simpleReply_doPost(e) {

  const json = JSON.parse(e.postData.contents);
  const replyToken = json.events[0].replyToken;
  const message = json.events[0].message.text;

  lineClient.simpleReplyMessage(replyToken, message);
}


