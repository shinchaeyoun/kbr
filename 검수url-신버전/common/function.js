function itostr(np) {
  return np >= 10 ? String(np) : "0" + np;
}
function scroll() {
  var _h = window.innerHeight - 230;
  $("#board_contents_list").css("height", _h);
  $(".tabs").css("height", _h);
}
$(window).resize(function () {
  scroll();
});

function popup_cont(url, w, h) {
  window.open(url, "popup", "width=" + w + ",height=" + h + ",toolbar=0, menubar=0, resizable=yes, location=no, scrollbars=0, top=0, left=0, frameborder=0");
}

$(window).ready(function () {
  var tab_no = 0;

  function init_set_list() {
    var group_list = "";
    var globalIdx = 0;

    Object.entries(contents_list).forEach(([item, contentsGroup]) => {
      group_list += `
        <ul>
          <div 
            class="tab ${globalIdx == 0 ? "active" : ""} ${item.length == 0 ? "hide" : ""}"
            style="${depth == 1 ? "margin-top:0" : ""}"
            rel="tab${globalIdx}"
          >
            ${item}
          </div>
      `;

      if (depth == 1) {
        globalIdx++;
      } else {
        Object.keys(contentsGroup)
          .slice(1)
          .forEach((subItem) => {
            group_list += `<li class="tab ${globalIdx == 0 ? "active" : ""}" rel="tab${globalIdx}">${subItem}</li>`;
            globalIdx++;
          });
      }

      group_list += `</ul>`;
    });

    $(".tabs-container .tabs").html(group_list);
  }

  function set_list(no) {
    var total_list = "";
    var globalIndex = 0;

    Object.entries(contents_list).forEach(([item, contentsGroup], index) => {
      // const folderUrl = contentsGroup.folder;
      const folderUrl = contentsGroup.folder;

      Object.entries(contentsGroup)
        .slice(1)
        .forEach(([groupKey, groupContents], idx) => {
          if (no == globalIndex) {
            total_list += '<ul class="chasi">';

            if (depth == 1) {
              total_list += `<li class="title ${!groupKey || groupKey.length === 0 ? "hide" : ""}"><strong>${groupKey}</strong></li>`;
            }

            groupContents.forEach((content, chasiNum) => {
              const { title, isActive, url, type, width, height, extra } = content;

              const contentUrl = url.startsWith("*/") ? (folderUrl.length == 0 ? `${folderUrl}${url.split("*/")[1]}` : `${folderUrl}${url.split("*")[1]}`) : `/${url}`;

              // const contentUrl = url.split("//").length > 1 ? `${url}` : `${folderUrl}${url}`;
              chasiNum = chasiNum + 1;
              let ok_link = "";
              let icon_css = isActive ? "" : "off";
              let icon = `<span class="ch_type ${icon_css}">${itostr(chasiNum)}차시</span>`;

              if (isActive) {
                const _title = title;
                ok_link = `<a href="javascript:popup_cont('${contentUrl}',${width},${height})">${_title}</a>`;
              } else {
                ok_link = `${title}`;
              }

              if (depth == 2 && type === 2) {
                total_list += `<li class="title"><strong>${ok_link}</strong></li>`;
              } else if (type === 1) {
                total_list += `<li>${icon}${ok_link}</li>`;
              } else {
                total_list += `<li>${icon}${ok_link}</li>`;
              }
            });

            total_list += "</ul>";
          }

          depth == 2 && globalIndex++;
        });

      depth == 1 && globalIndex++;
      $("#board_contents_list").html(total_list);
    });
  }

  init_set_list();
  set_list(tab_no);

  $("div.tabs .tab").click(function () {
    var activeTab = $(this).attr("rel");
    tab_no = activeTab.slice(3, 5);

    $("div, li").removeClass("active");

    if ($(this).prop("tagName").toLowerCase() === "div") {
      $(this).siblings(`li[rel='tab${tab_no}']`).addClass("active");
    } else if ($(this).prop("tagName").toLowerCase() === "li") {
      $(this).siblings("div").addClass("active");
    }

    $(this).addClass("active");

    // $(".tab_content").hide();
    // $("#" + activeTab).show();

    set_list(tab_no);
  });

  scroll();
});
