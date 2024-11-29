$(document).ready(function () {
  EXP = window.KOFAC_KBC;
  pageInit();
});

let EXP, snd;

function pageInit() {
  EXP.BUTTON_LOCK.isLock();

  console.log(EXP, 'pageInit exp');
}