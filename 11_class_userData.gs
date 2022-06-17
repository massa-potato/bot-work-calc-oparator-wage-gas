class UserData {
  
  constructor(userId) {
    this.sh = SS.getSheetByName(SHEET_INFO.USERS.NAME);
    this.userId = userId;
  }

  getRowNum() {
    const userIdsArr = this.sh.getRange(2, 1, this.sh.getLastRow() - 1).getValues().flat();
    const rowNum = userIdsArr.indexOf(this.userId) + 2;
    return rowNum;
  }

  getTmpValue(colmunNum) {
    const rowNum = this.getRowNum();
    return this.sh.getRange(rowNum, colmunNum).getValue();
  }

  getTmpValuesObj() {
    const rowNum = this.getRowNum();
    const valuesArr = this.sh.getRange(rowNum, 1, 1, this.sh.getLastColumn()).getValues().flat();
    const keys = Object.keys(COLUMN_INFO.USERS);

    let valuesObj = {};
    valuesArr.forEach((_, i) => {
      const column = COLUMN_INFO.USERS[keys[i]];
      valuesObj[keys[i]] = valuesArr[column.NO - 1];
    });

    return valuesObj;

  }

  saveTmpValue(value, columnNum) {
    const rowNum = this.getRowNum();
    this.sh.getRange(rowNum, columnNum).setValue(value);
    return;
  }

  saveChooseMachine(machineId) {
    const machineName =  new ListData().getMachineName(machineId);
    this.saveTmpValue(machineName, COLUMN_INFO.USERS.TMP_MACHINE.NO);
    return;
  }

  saveChooseTime(time, option) {
    let targetColumnNum;

    switch(option) {
      case 'start':
        targetColumnNum = COLUMN_INFO.USERS.TMP_S_TIME.NO;
        break;
      case 'end':
        targetColumnNum = COLUMN_INFO.USERS.TMP_E_TIME.NO;
        break;
    }

    this.saveTmpValue(time, targetColumnNum);
    return;
  }

  saveMinutes(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const minutes = (end - start) / 60000;

    if(minutes <= 0) { return false }; // 終了時刻が開始時刻より前にあったらfalseを返す

    let roundedMinutes = Math.floor(minutes / 15) * 15;
    roundedMinutes = minutes % 15 >= 10 ? roundedMinutes + 15 : roundedMinutes;

    this.saveTmpValue(roundedMinutes, COLUMN_INFO.USERS.TMP_MINUTES.NO);
    return;
  }

}


function test_user_getTmpValues(){

  const userId = 'U4e99427124639a7e9b3a1e739e9ebeaa';
  const user = new UserData(userId);

  Logger.log(user.getTmpValuesObj());


    // USER_ID: {COL: 'A', NO: 1, NAME: 'LINEユーザーID'},
    // WORKER_NAME: {COL: 'B', NO: 2, NAME: '作業者'},
    // TMP_S_TIME: {COL: 'C', NO: 3, NAME: 'tmp_開始時刻'},
    // TMP_E_TIME: {COL: 'D', NO: 4, NAME: 'tmp_終了時刻'},
    // TMP_MACHINE: {COL: 'E', NO: 5, NAME: 'tmp_作業機'},
    // TMP_MINUTES: {COL: 'F', NO: 6, NAME: 'tmp_作業時間'}, // 作業時間カラムは不要かも


}