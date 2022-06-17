class ReportData {

  constructor() {
    this.sh = SS.getSheetByName(SHEET_INFO.REPORTS.NAME);
  }

  saveReport(valuesObj) {
    // valuesObj = {WORKER_NAME=テストユーザー, TMP_MACHINE=ふつうの機械, TMP_S_TIME=Thu Jun 16 12:00:00 GMT+09:00 2022, TMP_E_TIME=Thu Jun 16 13:00:00 GMT+09:00 2022, TMP_MINUTES=60.0, USER_ID=U4e99427124639a7e9b3a1e739e9ebeaa}

    const valuesArr = [
      valuesObj['WORKER_NAME'],
      valuesObj['TMP_S_TIME'],
      valuesObj['TMP_E_TIME'],
      valuesObj['TMP_MACHINE'],
      valuesObj['TMP_MINUTES']
    ];

    return this.sh.appendRow(valuesArr);
  }

  getReportsArr() {
    const reports = this.sh.getDataRange().getValues();
    reports.shift();
    return reports
  }

  /**
   * 作業日報シートのレコードから、今年度分のレコードのみを抽出してオブジェクトにして返すメソッド
   * @return {object} reportsPerDateObj - 開始時刻の「日付」をキーとしたオブジェクト
   */
  getReportsPerDateObj() {
    const reportsArr = this.getReportsArr();

    const thisYear = new Date().getFullYear();
    const reports = reportsArr.filter(report => (report[COLUMN_INFO.REPORTS.S_TIME.NO - 1].getFullYear() === thisYear));

    const reportsPerDateObj = {};
    for(const report of reports) {
      const startTime = report[COLUMN_INFO.REPORTS.S_TIME.NO];
      const date = Utilities.formatDate(new Date(startTime), 'JST', 'MM/dd'); 

      if(date in reportsPerDateObj) { 
        reportsPerDateObj[date].push(report);
      }else {
        reportsPerDateObj[date] = [report];
      }
    }

    return reportsPerDateObj;
  }

  getReportsPerWorkerObj() {
    const reportsArr = this.getReportsArr();

    const thisYear = new Date().getFullYear();
    const reports = reportsArr.filter(report => (report[COLUMN_INFO.REPORTS.S_TIME.NO - 1].getFullYear() === thisYear));

    const reportsPerWorkerObj = {};
    for(const report of reports) {
      const worker = report[COLUMN_INFO.REPORTS.WORKER.NO - 1];

      if(worker in reportsPerWorkerObj) { 
        reportsPerWorkerObj[worker].push(report);
      }else {
        reportsPerWorkerObj[worker] = [report];
      }
    }

    return reportsPerWorkerObj;    

  }

  getTotalTimePerWorkerObj() {
    const reportsObj = this.getReportsPerWorkerObj();
    const workersArr = new ListData().getWorkersList();

    let totalTimeObj = {};
    for(const worker in reportsObj) {

      const transpose = arr => arr[0].map((_, c) => arr.map(r => r[c]));
      const arr = transpose(reportsObj[worker]);
      const minutes = arr[COLUMN_INFO.REPORTS.MINUTES.NO - 1];
      const totalTime = minutes.reduce((acc, cur) => acc + cur);

      totalTimeObj[worker] = totalTime;
    }

    return totalTimeObj;

  }

  /**
   * 「確認」機能のメッセージを作成するメソッド
   * @return {string} msg
   */
  createListMsg() {
    const reportsPerDateObj = this.getReportsPerDateObj();

    let msg = '今年のオペレーター作業履歴です。'
    for(const date in reportsPerDateObj) {
      msg += `\n\n${date}`
      for(const report of reportsPerDateObj[date]) {
        console.log(report);
        const machine = report[COLUMN_INFO.REPORTS.MACHINE.NO - 1];
        const worker = report[COLUMN_INFO.REPORTS.WORKER.NO - 1];

        const startTime = Utilities.formatDate(report[COLUMN_INFO.REPORTS.S_TIME.NO - 1], 'JTS', 'hh:mm');
        const minutes = report[COLUMN_INFO.REPORTS.MINUTES.NO - 1];
        const dispMinutes = `${Math.floor(minutes / 60)}h${minutes % 60}m`;

        msg += `\n${machine.slice(0, 2)} ${worker.slice(0, 2)} ${startTime}〜 （${dispMinutes}）`;

      }
    }

    return msg;
  }

  createAggrigateMsg() {
    const totalTimeObj = this.getTotalTimePerWorkerObj();

    let msg = '今年の作業時間の合計と賃金の集計結果です。\n'
    for(const worker in totalTimeObj){
      const minutes = totalTimeObj[worker];
      const dispMinutes = `${Math.floor( minutes / 60)}h${minutes % 60}m`;
      const wage = minutes / 60 * 1300;
      const dispWage = wage.toLocaleString();
      msg += `\n${worker.slice(0, 2)}: ${dispMinutes}（${dispWage}円）`;
    }

    return msg;

  }

}

function test_ReportData_getReportsPerDateObj() {

  const report = new ReportData();
  const obj = report.getReportsPerDateObj();

  Logger.log(obj)

}

function test_ReportData_createListMsg() {

  const report = new ReportData();
  const msg = report.createListMsg()

  console.log(msg);

}

function test_ReportData_getTotalTimePerWorkerObj() {

  const report = new ReportData();
  const obj = report.getTotalTimePerWorkerObj();

  Logger.log(obj)

}

function test_ReportData_createAggrigateMsg() {

  const report = new ReportData();
  const msg = report.createAggrigateMsg()

  console.log(msg);

}