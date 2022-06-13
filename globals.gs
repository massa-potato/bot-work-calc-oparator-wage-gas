/**
 * ライブラリ「LineBotTool」の初期設定
 */
const lineClient = LineBotTool.createClient(LINE_ACCESS_TOKEN);

/**
 * シートとカラムの情報
 */
const SHEET_INFO = Object.freeze({
  REPORTS: {NAME: '作業日報', HEADER_ROWS: 1},
  WORKERS: {NAME: '作業者情報', HEADER_ROWS: 1},
  LISTS: {NAME: 'lists', HEADER_ROWS: 1},
  LOGS: {NAME: 'logs', HEADER_ROWS: 1}
});

const COLUMN_INFO = Object.freeze({
  REPORTS: {
    S_TIME: {COL: 'A', NO: 1, NAME: '開始時刻'},
    E_TIME: {COL: 'B', NO: 2, NAME: '終了時刻'},
    MACHINE: {COL: 'C', NO: 3, NAME: '作業機'},
    WORKER: {COL: 'D', NO: 4, NAME: '作業者'},
    MINUTES: {COL: 'E', NO: 5, NAME: '作業時間'},    
  },
  WORKERS: {
    USER_ID: {COL: 'A', NO: 1, NAME: 'LINEユーザーID'},
    WORKER_NAME: {COL: 'B', NO: 2, NAME: '作業者'},
    TMP_S_TIME: {COL: 'C', NO: 3, NAME: 'tmp_開始時刻'},
    TMP_E_TIME: {COL: 'D', NO: 4, NAME: 'tmp_終了時刻'},
    TMP_MACHINE: {COL: 'E', NO: 5, NAME: 'tmp_作業機'},
    TMP_MINUTES: {COL: 'F', NO: 6, NAME: 'tmp_作業時間'}, // 作業時間カラムは不要かも
  },
  LOGS: {
    DATE: {COL: 'A', NO: 1, NAME: 'date'},
    TITLE: {COL: 'B', NO: 2, NAME: 'title'},
    VALUES: {COL: 'C', NO: 3, NAME: 'values'},
  }
});