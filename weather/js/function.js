function itostr(np) {
    return (np >= 10) ? String(np) : "0" + np;
};

function scroll() {
    var _h = window.innerHeight - 230;
    $("#board_contents_list").css("height", _h);
    $(".tabs").css("height", _h);
}

$(window).resize(function () {
    scroll();
});

function popup_cont(url, w, h) {
    //alert(w+"/"+h);
    window.open(url, "popup", "width=" + w + ",height=" + h + ",toolbar=0, menubar=0, resizable=yes, location=no, scrollbars=0, top=0, left=0, frameborder=0");
};

$(window).ready(function () {
    function set_list(no) {
        let chasi = '';
        let chasiNum = '';
        let chasiList = '';

        let num = '';

        var tab_length = contents_list[no].length;
        var count = 1;
        let tabList = $('.tabs li');
        tabList.each(function (i) {
            $(this).attr('data-tab', 'tab' + (i + 1));
        });


        for (var j = 0; j < tab_length; j++) {
            $(".tabs li").eq(j).attr("title", $(".tabs li").eq(j).html());
        };

        for (var i = 1; i < tab_length; i++) {
            chasi = $('<div class="chasi"></div>');
            chasiNum = $('<div class="num"></div>');
            chasiList = $('<div class="list"></div>');

            chasiNum.append(i);

            for (let k = 0; k < contents_list[no][i].length; k++) {
                let div = $('<div></div>');
                let ok_link = contents_list[no][i][k][0];
                folder_path = itostr(no) + '/' + itostr(i) + '/'

                if (contents_list[no][i][k][1]) {
                    ok_link = '<a href="javascript:popup_cont(\'' + folder_path + contents_list[no][i][k][2] + '\',' + contents_list[no][i][k][4] + ',' + contents_list[no][i][k][5] + ')">' + contents_list[no][i][k][0] + '</a>';
                    div.addClass('active');
                }

                div.append(ok_link);

                chasiList.append(div);
            };
            
            chasi.append(chasiNum);
            chasi.append(chasiList);
            $(".content").append(chasi);
        };
    };


    let tabNo = 1;
    set_list(tabNo);

    $("ul.tabs li").click(function () {
        let activeTab = $(this).data('tab');
        let thisIdx = $(this).index();

        if (activeTab == 'tab0') return false;
        $("ul.tabs li").removeClass('active');

        if ($(this).hasClass("l2")) {
            console.log("하위 메뉴 선택");
            $($("ul.tabs li").get().reverse()).each(function (index) {
                if ($(this).index() < thisIdx && $(this).attr("rel") == "tab0") {
                    console.log("$(this).index():" + $(this).index());
                    $(this).addClass("active");
                    return false;
                }
            });
        }

        $(this).addClass("active");
        $(".tab_content").hide();
        $("#" + activeTab).show();

        var tab_no = activeTab.slice(3, 4);
        set_list(tab_no);
    });
});