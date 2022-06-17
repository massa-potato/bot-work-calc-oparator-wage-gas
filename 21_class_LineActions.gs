class LineActions {
  /**
   * 日報入力機能① ボタンテンプレートメッセージで機械を選択する処理
   * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
   * @return {object} - リプライメッセージのレスポンスオブジェクト
   */
  static entryMachine(event) {

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
  static entryDatetime(event, option) {

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

  /**
   * 日報入力機能③ 入力データの確認メッセージとクイックリプライ（はい／いいえ）を送る処理
   * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
   * @param {string} valuesObj - ユーザーが入力した一時保存データのオブジェクト
   * @return {object} - リプライメッセージのレスポンスオブジェクト
   */
  static confirmReport(event, valuesObj) {

      const replyToken = event.replyToken;

      // valuesObj = {WORKER_NAME=テストユーザー, TMP_MACHINE=ふつうの機械, TMP_S_TIME=Thu Jun 16 12:00:00 GMT+09:00 2022, TMP_E_TIME=Thu Jun 16 13:00:00 GMT+09:00 2022, TMP_MINUTES=60.0, USER_ID=U4e99427124639a7e9b3a1e739e9ebeaa}

      const dispStartDate = Utilities.formatDate(new Date(valuesObj['TMP_S_TIME']), 'JST', 'MM/dd HH:mm');
      const dispEndDate = Utilities.formatDate(new Date(valuesObj['TMP_E_TIME']), 'JST', 'MM/dd HH:mm');

      const msg = `この日報を登録しますか？

コンバイン：${valuesObj['TMP_MACHINE']}
作業者：${valuesObj['WORKER_NAME']}
開始：${dispStartDate}
終了：${dispEndDate}
合計時間：${valuesObj['TMP_MINUTES']} 分`

      const postbackOption = [
        {label: 'はい', data: 'confirmedReport=yes', displayText: 'はい'},
        {label: 'いいえ', data: 'confirmedReport=no', displayText: 'いいえ'}
      ];

      return lineClient.quickReply(replyToken, msg, postbackOption);

  }

  /**
   * 日報入力機能③-2 日報キャンセル時のリプライメッセージを送る処理。
   * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
   * @return {object} - リプライメッセージのレスポンスオブジェクト
   */
  static replyIncorrectTime(event) {

      const replyToken = event.replyToken;

      const msg = 'もう一度入力してください。\n（終了時間は開始時間より後に設定してください）';
      return lineClient.simpleReplyMessage(replyToken, msg);
  }

  /**
   * 日報入力機能④-1 日報登録時のリプライメッセージを送る処理。
   * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
   * @return {object} - リプライメッセージのレスポンスオブジェクト
   */
  static replyEntryReport(event) {
      const replyToken = event.replyToken;

      const msg = '日報を登録しました！';
      return lineClient.simpleReplyMessage(replyToken, msg);

  }

  /**
   * 日報入力機能④-2 日報キャンセル時のリプライメッセージを送る処理。
   * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
   * @return {object} - リプライメッセージのレスポンスオブジェクト
   */
  static replyCancelEntryReport(event) {
      const replyToken = event.replyToken;

      const msg = 'もう一度入力してください。';
      return lineClient.simpleReplyMessage(replyToken, msg);

  }

  /**
   * 確認機能
   * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
   * @return {object} - リプライメッセージのレスポンスオブジェクト
   */
  static listRecords(event) {
    const report = new ReportData();
    const msg = report.createListMsg();
    return lineClient.simpleReplyMessage(event.replyToken, msg);
  }

  /**
   * 確認機能
   * @param {object} event - LINEのWebhookイベントオブジェクトから得られたオブジェクト
   * @return {object} - リプライメッセージのレスポンスオブジェクト
   */
  static aggrigateRecords(event) {
    const report = new ReportData();
    const msg = report.createAggrigateMsg();
    return lineClient.simpleReplyMessage(event.replyToken, msg);
  }

}









