/**
 * LINEに何かアクションがあったときに実行される関数
 * @param {object} e - LINEのWebhookイベントオブジェクト（JSONオブジェクト）
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