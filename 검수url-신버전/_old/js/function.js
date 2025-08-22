function itostr(np){
  return (np>=10)?String(np):"0"+np;
};

function scroll(){
  var _h = window.innerHeight - 230;
  $("#board_contents_list").css("height",_h);
  $(".tabs").css("height",_h);
}

$(window).resize(function(){
  scroll();
});

function popup_cont(url, w, h) {
  //alert(w+"/"+h);
  window.open(url,"popup","width="+w+",height="+h+",toolbar=0, menubar=0, resizable=yes, location=no, scrollbars=0, top=0, left=0, frameborder=0");
}

$(window).ready(function(){
  var url = "";

  

  function set_list(no) {
    var total_list = "";
    var tab_length = contents_list[no].length;
  var title_length = $(".tabs li").length;
    var count = 1;

  for(var j=0; j<tab_length; j++){
    $(".tabs li").eq(j).attr("title",$(".tabs li").eq(j).html());
  }
    total_list += '<ul class="board_contents">'
    for(var i=1; i<tab_length; i++){
      var ok_icon = "";
      var ok_link = '<span class="ch_no off">'+itostr(count)+'차시</span>'+contents_list[no][i][0];

      if(contents_list[no][i][1]) {
        ok_link = '<span class="ch_no">'+itostr(count)+'차시</span>'+'<a href="javascript:popup_cont(\''+contents_list[no][i][2]+'\','+contents_list[no][i][4]+','+contents_list[no][i][5]+')">'+contents_list[no][i][0]+'</a>';
      }
      total_list += '<li>'+ok_link+'</li>'
      count++;
    }
    total_list += '</ul>';
    $("#board_contents_list").html(total_list);
  }

  var tab_no = 1;
  set_list(tab_no);

  $("ul.tabs li").click(function() {
    var activeTab = $(this).attr("rel");
    var this_index = $(this).index();
    if(activeTab == "tab0") return false;
    $("ul.tabs li").removeClass("active");

    if($(this).hasClass("l2")) {
      console.log("하위 메뉴 선택");
      $($("ul.tabs li").get().reverse()).each(function(index){
        if($(this).index() < this_index && $(this).attr("rel") == "tab0") {
          console.log("$(this).index():"+$(this).index());
          $(this).addClass("active");
          return false;
        }
      });
    }

    $(this).addClass("active");
    $(".tab_content").hide();
    $("#" + activeTab).show();

    var tab_no = activeTab.slice(3,5);
    set_list(tab_no);
  });

  //console.log($(".tabs").length);

  scroll();
});