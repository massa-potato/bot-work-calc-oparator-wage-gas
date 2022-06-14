/**
 * 日報入力機能① ボタンテンプレートメッセージで機械を選択する処理
 * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
 * @return {object} - リプライメッセージのレスポンスオブジェクト
 */
function entryMachine_(event) {

  const replyToken = event.replyToken;

  const imageUrl = 'https://www.nh-hft.co.jp/wp/wp-content/uploads/2019/09/NH-CX5-CX6.jpg';
  const title = '日報入力';
  const text = 'コンバインを選択してください。';

  const machinesArr = SS.getSheetByName(SHEET_INFO.LISTS.NAME).getRange(2, 1, 2).getValues().flat();

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
 * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
 * @param {string} option - どの日時選択かを示すオプション文字列
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
