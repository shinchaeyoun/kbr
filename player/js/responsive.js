function responsiveInitialize(){
    $(window).resize(function(){
        interactTransformScaleChange($(".video_content"));
    })
}

function interactTransformScaleChange(_target) {
    var $target = _target;
  
    var _wid = window.innerWidth;
    var _hei = window.innerHeight;
  
    var _scaleX = _wid / contentsWidth;
    var _scaleY = _hei / contentsHeight;
    var _cWid, _cHei;
    if (_scaleX > _scaleY) {
      // "가로비율이 더 클 경구"
      _target.css("transform", "scale(" + _scaleY + ")");
      _target.css("-webkit-transform", "scale(" + _scaleY + ")");
      _target.css("-moz-transform", "scale(" + _scaleY + ")");
      _target.css("-o-transform", "scale(" + _scaleY + ")");
      _cWid = contentsWidth * _scaleY;
      scaleChangePosLeftValue = _wid - _cWid;
      _target.css({ "margin-left": (_wid - _cWid) / 2 + "px" });
      _target.css({ "margin-top": 0 });
    } else {
      // "세로비율이 더 크거나 동일한 비율"
      $target.css("transform", "scale(" + _scaleX + ")");
      $target.css("-webkit-transform", "scale(" + _scaleX + ")");
      $target.css("-moz-transform", "scale(" + _scaleX + ")");
      $target.css("-o-transform", "scale(" + _scaleX + ")");
      _cHei = contentsHeight * _scaleX;
      scaleChangePosTopValue = _hei - _cHei;
      _target.css({ "margin-top": (_hei - _cHei) / 2 + "px" });
      _target.css({ "margin-left": 0 });
    }
  }