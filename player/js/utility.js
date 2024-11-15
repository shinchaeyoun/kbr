function itostr($num) {
  return $num < 10 ? '0' + $num : $num;
};

function secToStr($num) {
  if ($num < 10) return "0" + $num;
  return $num;
}

function setPoint($num) {
  let num = $num.toString();
  if (num.length == 1 ) return num+'.0';
  return $num;
}