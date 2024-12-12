var agent = navigator.userAgent.toLowerCase();
if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
	fileType = ".html"
} else {
	fileType = ".mp4"
}

var contents_list = new Array();

// 학년 == 탭
contents_list[0] = new Array();
contents_list[1] = new Array();
contents_list[2] = new Array();
contents_list[3] = new Array();

contents_list[1][0] = new Array();

contents_list[1][1] = new Array();
contents_list[1][1][0] = ["동영상 자료", true, "", 0, 1280, 720];
contents_list[1][1][1] = ["카드뉴스", false, "", 0, 1280, 720];
contents_list[1][1][2] = ["오프라인 교구", false, "", 0, 1280, 720];
contents_list[1][1][3] = ["교재", false, "", 0, 1280, 720];

contents_list[1][2] = new Array();
contents_list[1][2][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[1][2][1] = ["디지털 교구", false, "", 0, 1280, 720];
contents_list[1][2][2] = ["교재", false, "", 0, 1280, 720];

contents_list[1][3] = new Array();
contents_list[1][3][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[1][3][1] = ["교재", false, "", 0, 1280, 720];
contents_list[1][3][2] = ["디지털 교구", false, "", 0, 1280, 720];

contents_list[1][4] = new Array();
contents_list[1][4][0] = ["오프라인 교구", false, "", 0, 1280, 720];
contents_list[1][4][1] = ["교재", false, "", 0, 1280, 720];

contents_list[1][5] = new Array();
contents_list[1][5][0] = ["읽기 자료", false, "", 0, 1280, 720];
contents_list[1][5][1] = ["교재", false, "", 0, 1280, 720];
contents_list[1][5][2] = ["오프라인 교구", false, "", 0, 1280, 720];
contents_list[1][5][3] = ["디지털 교구", false, "", 0, 1280, 720];

contents_list[1][6] = new Array();
contents_list[1][6][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[1][6][1] = ["카드뉴스", false, "", 0, 1280, 720];
contents_list[1][6][1] = ["교재", false, "", 0, 1280, 720];

contents_list[1][7] = new Array();
contents_list[1][7][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[1][7][1] = ["교재", false, "", 0, 1280, 720];

contents_list[1][8] = new Array();
contents_list[1][8][0] = ["오프라인 교구", false, "", 0, 1280, 720];
contents_list[1][8][1] = ["교재", false, "", 0, 1280, 720];

contents_list[1][9] = new Array();
contents_list[1][9][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[1][9][1] = ["카드뉴스", false, "", 0, 1280, 720];
contents_list[1][9][0] = ["오프라인 교구", false, "", 0, 1280, 720];
contents_list[1][9][1] = ["교재", false, "", 0, 1280, 720];

contents_list[1][10] = new Array();
contents_list[1][10][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[1][10][1] = ["오프라인 교구", false, "", 0, 1280, 720];
contents_list[1][10][1] = ["교재", false, "", 0, 1280, 720];

contents_list[1][11] = new Array();
contents_list[1][11][0] = ["오프라인 교구", false, "", 0, 1280, 720];
contents_list[1][11][1] = ["교재", false, "", 0, 1280, 720];

contents_list[1][12] = new Array();
contents_list[1][12][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[1][12][1] = ["오프라인 교구", false, "", 0, 1280, 720];
contents_list[1][12][1] = ["교재", false, "", 0, 1280, 720];

// 3,4 학년
contents_list[2][0] = new Array();

contents_list[2][1] = new Array();
contents_list[2][1][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[2][1][1] = ["카드뉴스", false, "", 0, 1280, 720];
contents_list[2][1][2] = ["교재", false, "", 0, 1280, 720];

contents_list[2][2] = new Array();
contents_list[2][2][0] = ["교재", false, "", 0, 1280, 720];

contents_list[2][3] = new Array();
contents_list[2][3][0] = ["교재", false, "", 0, 1280, 720];

contents_list[2][4] = new Array();
contents_list[2][4][0] = ["디지털 교구", false, "", 0, 1280, 720];
contents_list[2][4][1] = ["교재", false, "", 0, 1280, 720];

contents_list[2][5] = new Array();
contents_list[2][5][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[2][5][1] = ["교재", false, "", 0, 1280, 720];

contents_list[2][6] = new Array();
contents_list[2][6][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[2][6][1] = ["교재", false, "", 0, 1280, 720];

contents_list[2][7] = new Array();
contents_list[2][7][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[2][7][1] = ["디지털 교구", false, "", 0, 1280, 720];
contents_list[2][7][2] = ["교재", false, "", 0, 1280, 720];

contents_list[2][8] = new Array();
contents_list[2][8][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[2][8][1] = ["교재", false, "", 0, 1280, 720];

contents_list[2][9] = new Array();
contents_list[2][9][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[2][9][1] = ["교재", false, "", 0, 1280, 720];

contents_list[2][10] = new Array();
contents_list[2][10][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[2][10][1] = ["교재", false, "", 0, 1280, 720];

contents_list[2][11] = new Array();
contents_list[2][11][0] = ["모의실험", false, "", 0, 1280, 720];
contents_list[2][11][1] = ["교재", false, "", 0, 1280, 720];

contents_list[2][12] = new Array();
contents_list[2][12][0] = ["교재", false, "", 0, 1280, 720];

contents_list[2][13] = new Array();
contents_list[2][13][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[2][13][1] = ["카드뉴스", false, "", 0, 1280, 720];

contents_list[2][14] = new Array();
contents_list[2][14][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[2][14][1] = ["카드뉴스", false, "", 0, 1280, 720];
contents_list[2][14][2] = ["교재", false, "", 0, 1280, 720];
contents_list[2][14][3] = ["시범 수업 영상", false, "", 0, 1280, 720];


// 5,6 학년
contents_list[3][0] = new Array();

contents_list[3][1] = new Array();
contents_list[3][1][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[3][1][1] = ["교재", false, "", 0, 1280, 720];

contents_list[3][2] = new Array();
contents_list[3][2][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[3][2][1] = ["오프라인 교구", false, "", 0, 1280, 720];
contents_list[3][2][2] = ["교재", false, "", 0, 1280, 720];

contents_list[3][3] = new Array();
contents_list[3][3][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[3][3][1] = ["카드뉴스", false, "", 0, 1280, 720];
contents_list[3][3][2] = ["교재", false, "", 0, 1280, 720];

contents_list[3][4] = new Array();
contents_list[3][4][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[3][4][1] = ["교재", false, "", 0, 1280, 720];
contents_list[3][4][2] = ["디지털 교구", false, "", 0, 1280, 720];
contents_list[3][4][3] = ["시범 수업 영상", false, "", 0, 1280, 720];

contents_list[3][5] = new Array();
contents_list[3][5][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[3][5][1] = ["카드뉴스", false, "", 0, 1280, 720];
contents_list[3][5][2] = ["교재", false, "", 0, 1280, 720];

contents_list[3][6] = new Array();
contents_list[3][6][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[3][6][1] = ["교재", false, "", 0, 1280, 720];

contents_list[3][7] = new Array();
contents_list[3][7][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[3][7][1] = ["교재", false, "", 0, 1280, 720];

contents_list[3][8] = new Array();
contents_list[3][8][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[3][8][1] = ["교재", false, "", 0, 1280, 720];

contents_list[3][9] = new Array();
contents_list[3][9][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[3][9][1] = ["교재", false, "", 0, 1280, 720];

contents_list[3][10] = new Array();
contents_list[3][10][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[3][10][1] = ["교재", false, "", 0, 1280, 720];

contents_list[3][11] = new Array();
contents_list[3][11][0] = ["디지털 교구", false, "", 0, 1280, 720];
contents_list[3][11][1] = ["교재", false, "", 0, 1280, 720];

contents_list[3][12] = new Array();
contents_list[3][12][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[3][12][1] = ["교재", false, "", 0, 1280, 720];

contents_list[3][13] = new Array();
contents_list[3][13][0] = ["동영상 자료", false, "", 0, 1280, 720];
contents_list[3][13][1] = ["교재", false, "", 0, 1280, 720];

contents_list[3][14] = new Array();
contents_list[3][14][0] = ["애니메이션", false, "", 0, 1280, 720];
contents_list[3][14][1] = ["교재", false, "", 0, 1280, 720];