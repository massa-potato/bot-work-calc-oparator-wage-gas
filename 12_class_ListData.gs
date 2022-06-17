class ListData {

  constructor() {
    this.sh = SS.getSheetByName(SHEET_INFO.LISTS.NAME);
  }

  getMachinesList() {
    const machinesArr = this.sh.getRange(2, 1, 2).getValues().flat();
    return machinesArr;
  }

  getMachineName(machineId) {
    const machinesArr = this.getMachinesList()
    const machineName = machinesArr[machineId];
    return machineName;
  }

  getWorkersList() {
    const workersArr = this.sh.getRange(2, 2, 6).getValues().flat();
    return workersArr;

  }


}