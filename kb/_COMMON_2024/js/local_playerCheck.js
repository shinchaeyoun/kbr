var playerChk = {
	CODE : {
		RESPONSE_RESULT_TYPE: {
			SUCCESS: 'success',
			FAIL: 'fail',
		},
		RESPONSE_CODE_TYPE: {
			E001: {
				name: "E001",
				desc: "서버 내부 오류"
			},
			E002: {
				name: 'E002',
				desc: '잘못된 접근 경로'
			},
			E401: {
				name: 'E401',
				desc: '코인 변경 오류'
			},
			E900: {
				name: 'E900',
				desc: '정의되지 않은 에러 유형'
			}
		},
	},
	id: new Date().getTime(),
	
	playerId: '', //플레이어 중복 실행 방지를 위한 uuid값을 세션에 저장한 값
	timeCount: 0,
	popPlayerWin: "",
	playerCheck: "",
	leftMenu: "",
	openerLessonInnbList: "",

	isCompleted: false, // 모듈 완료 여부

	saveYn: "", // 이력 저장여부
	bkmkGbnList: [], // 북마크 그룹 목록
	bkmkList: [], // 북마크 이력 목록
	playVdoInfo: {},
	shareHelpList: [], // 저작권 유형 목록
	wrtInfo: {}, // 저작권 표시를 위한  텍스트 값
	popGbn: -1, // 1 학생(수업) ,2.학생(과제) ,3 학생(교재/여행모드),  4 선생미리보기(수업),5 선생미리보기(과제), 6. 선생미리보기(학습자료)
	innb: -1, //차시 고유번호
	contsInnb: -1, //콘텐츠 고유번호
	curInfo: {}, // Map Object {content_innb : 콘텐츠 고유번호, conts_dc : 콘텐츠 설명, lesson_innb : 차시고유번호, playerGbn : 플레이어구분)
	user_info: "", //사용자 정보(암호호된 값)
	r_point: 30, //읽기 포인트
	l_point: 300, //듣기 포인트
	w_point: 100, //쓰기 포인트
	s_point: 3, //말하기 포인트
	coin: 15, // 코인
	eval_yn: '', //평가차시여부
	lmk_list: [], //랜드마크 구매 목록
	kb_lmk_list_origin: [],
	kb_lmk_list: {
		"LMK001": {
			"name": "LMK001",
			"price": 30,
			"ko_name": "동방명주",
			"get_yn": "Y"
		},
		"LMK002": {
			"name": "LMK002",
			"price": 30,
			"ko_name": "모나스타워",
			"get_yn": "N"
		},
		"LMK003": {
			"name": "LMK003",
			"price": 30,
			"ko_name": "라이스 테라스",
			"get_yn": "N"
		},
		"LMK004": {
			"name": "LMK004",
			"price": 30,
			"ko_name": "칼랸의 탑",
			"get_yn": "Y"
		},
		"LMK005": {
			"name": "LMK005",
			"price": 30,
			"ko_name": "연꽃사원",
			"get_yn": "N"
		},
		"LMK006": {
			"name": "LMK006",
			"price": 30,
			"ko_name": "경복궁",
			"get_yn": "N"
		},
		"LMK007": {
			"name": "LMK007",
			"price": 30,
			"ko_name": "후지산",
			"get_yn": "N"
		},
		"LMK008": {
			"name": "LMK008",
			"price": 30,
			"ko_name": "쉐다곤 파고다",
			"get_yn": "N"
		},
		"LMK009": {
			"name": "LMK009",
			"price": 30,
			"ko_name": "앙코르와트",
			"get_yn": "N"
		},
		"LMK010": {
			"name": "LMK010",
			"price": 30,
			"ko_name": "하롱베이",
			"get_yn": "N"
		},
		"LMK011": {
			"name": "LMK011",
			"price": 30,
			"ko_name": "구엘공원",
			"get_yn": "N"
		},
		"LMK012": {
			"name": "LMK012",
			"price": 30,
			"ko_name": "콜로세움",
			"get_yn": "N"
		},
		"LMK013": {
			"name": "LMK013",
			"price": 30,
			"ko_name": "에펠탑",
			"get_yn": "N"
		},
		"LMK014": {
			"name": "LMK014",
			"price": 30,
			"ko_name": "빅 벤",
			"get_yn": "N"
		},
		"LMK015": {
			"name": "LMK015",
			"price": 30,
			"ko_name": "붉은 광장",
			"get_yn": "N"
		},
		"LMK016": {
			"name": "LMK016",
			"price": 30,
			"ko_name": "파르테논 신전",
			"get_yn": "N"
		},
		"LMK017": {
			"name": "LMK017",
			"price": 30,
			"ko_name": "톱피카 궁전",
			"get_yn": "N"
		},
		"LMK018": {
			"name": "LMK018",
			"price": 30,
			"ko_name": "세체니 다리",
			"get_yn": "N"
		},
		"LMK019": {
			"name": "LMK019",
			"price": 30,
			"ko_name": "베를린 장벽",
			"get_yn": "N"
		},
		"LMK020": {
			"name": "LMK020",
			"price": 30,
			"ko_name": "벨렘",
			"get_yn": "N"
		},
		"LMK021": {
			"name": "LMK021",
			"price": 30,
			"ko_name": "올드스퀘어",
			"get_yn": "N"
		},
		"LMK022": {
			"name": "LMK022",
			"price": 30,
			"ko_name": "자유의 여신상",
			"get_yn": "N"
		},
		"LMK023": {
			"name": "LMK023",
			"price": 30,
			"ko_name": "안데스산맥",
			"get_yn": "N"
		},
		"LMK024": {
			"name": "LMK024",
			"price": 30,
			"ko_name": "나이아가라 폭포",
			"get_yn": "N"
		},
		"LMK025": {
			"name": "LMK025",
			"price": 30,
			"ko_name": "마추픽추",
			"get_yn": "N"
		},
		"LMK026": {
			"name": "LMK026",
			"price": 30,
			"ko_name": "브라질 예수상",
			"get_yn": "N"
		},
		"LMK027": {
			"name": "LMK027",
			"price": 30,
			"ko_name": "우유니 사막",
			"get_yn": "N"
		},
		"LMK028": {
			"name": "LMK028",
			"price": 30,
			"ko_name": "지첸이트사",
			"get_yn": "N"
		},
		"LMK029": {
			"name": "LMK029",
			"price": 30,
			"ko_name": "아마존",
			"get_yn": "N"
		},
		"LMK030": {
			"name": "LMK030",
			"price": 30,
			"ko_name": "달의 계곡",
			"get_yn": "N"
		},
		"LMK031": {
			"name": "LMK031",
			"price": 30,
			"ko_name": "바이아 궁전",
			"get_yn": "N"
		},
		"LMK032": {
			"name": "LMK032",
			"price": 30,
			"ko_name": "오페라하우스",
			"get_yn": "N"
		},
		"LMK033": {
			"name": "LMK033",
			"price": 30,
			"ko_name": "피라미드",
			"get_yn": "N"
		},
		"LMK034": {
			"name": "LMK034",
			"price": 30,
			"ko_name": "나이로비 국립공원",
			"get_yn": "N"
		},
		"LMK035": {
			"name": "LMK035",
			"price": 30,
			"ko_name": "테이블 마운틴",
			"get_yn": "N"
		},
		"LMK036": {
			"name": "LMK036",
			"price": 30,
			"ko_name": "모론다바 바오밥 나무 숲",
			"get_yn": "N"
		},
		"LMK037": {
			"name": "LMK037",
			"price": 30,
			"ko_name": "사하라 사막",
			"get_yn": "N"
		},
		"LMK038": {
			"name": "LMK038",
			"price": 30,
			"ko_name": "키위새",
			"get_yn": "N"
		},
		"LMK039": {
			"name": "LMK039",
			"price": 30,
			"ko_name": "빅토리아 폭포",
			"get_yn": "N"
		},
		"LMK040": {
			"name": "LMK040",
			"price": 30,
			"ko_name": "그레이트 짐바브웨",
			"get_yn": "N"
		},
		"LMK041": {
			"name": "LMK041",
			"price": 30,
			"ko_name": "게르",
			"get_yn": "N"
		},
		"LMK042": {
			"name": "LMK042",
			"price": 30,
			"ko_name": "왓 사켓",
			"get_yn": "N"
		}
	}, //kb_랜드마크 전체 목록(get_yn 보유여부)

	passYn_list: {
		"result": "success",
		"list": [
			{
				"group_nm": "1단원",
				"parnts_group_innb": 174,
				"group_innb": 693,
				"pass_yn": "N",
				"seq": "1"
			},
			{
				"group_nm": "2단원",
				"parnts_group_innb": 174,
				"group_innb": 694,
				"pass_yn": "N",
				"seq": "2"
			},
			{
				"group_nm": "3단원",
				"parnts_group_innb": 174,
				"group_innb": 695,
				"pass_yn": "N",
				"seq": "3"
			},
			{
				"group_nm": "4단원",
				"parnts_group_innb": 174,
				"group_innb": 696,
				"pass_yn": "N",
				"seq": "4"
			},
			{
				"group_nm": "5단원",
				"parnts_group_innb": 174,
				"group_innb": 697,
				"pass_yn": "N",
				"seq": "5"
			},
			{
				"group_nm": "6단원",
				"parnts_group_innb": 174,
				"group_innb": 698,
				"pass_yn": "N",
				"seq": "6"
			},
			{
				"group_nm": "7단원",
				"parnts_group_innb": 174,
				"group_innb": 699,
				"pass_yn": "N",
				"seq": "7"
			},
			{
				"group_nm": "8단원",
				"parnts_group_innb": 174,
				"group_innb": 700,
				"pass_yn": "N",
				"seq": "8"
			},
			{
				"group_nm": "예비단원",
				"parnts_group_innb": 174,
				"group_innb": 1734,
				"pass_yn": "N",
				"seq": null
			}
		]
	}, // 단원완료여부
	conts_game_rank_info: [], // 게임 결과 순위정보
	prinla_cd: "EN", // 주요 언어
	trans_lang: "EN", // 번역 언어
	conts_se_cd: 0, // 콘텐츠 학교 급 (1:초등, 2:중등)	
	conts_type: 0, // 콘텐츠 타입 (1:한국어 교재, 2:익힘, 3:평가, 4:게임)
	conts_step: 4, // 콘텐츠 단계(1~4)	
	conts_unit: 0, // 콘텐츠 단원(1~8)
	conts_ele: 0, // 콘텐츠 차시(1~11)	
	mainLangs: ["KM", "EN", "RU", "VI", "ZH", "AE", "JP", "KK", "MN", "PH"], // 번역 가능 5개국어  + 추가5종 (아랍어,일본어,카자흐어,몽골어,필리핀어) 
	bdg_chk_cd: "", // 배지체크 튜터 구분코드
	can_question_submit: "",
	schlGbn: "", //여행모드 초중등구분
	isFirstConts: false, //첫번째 콘텐츠 여부

	// 학습자 정답 리스트
	conts_objective_answer_list: [], //객관답변 리스트 in 평가차시(12차시)
	conts_subjective_answer_list: [], //주관답변 리스트 in 평가차시(12차시)
	conts_objective_answer_flags: [], //객관 정답여부 리스트 in 평가차시(12차시)
	conts_subjective_answer_flags: [], //주관 정답여부 리스트 in 평가차시(12차시)

	// response result
	response_result: {
		result: 'fail',
		message: '',
		code: '',
	},

	open: function (popGbn, innb, contsInnb) {
		this.popGbn = popGbn;
		this.innb = innb;
		this.contsInnb = contsInnb;

		//메인메뉴 닫기_gnbSlideUp()
		if ($('.bgColor').length != 0) {//메뉴 존재시
			$('.subNav, .subBg').stop().slideUp('fast', function () {
				document.querySelector('.bgColor').className = 'bgColor';
			});
			$('.mainNav').removeClass('active');
		}

		//popGbn : //1 학생(수업) ,2.학생(과제) ,3 학생(학습자료),  4 선생(수업),5 선생(과제), 6. 선생(학습자료) 7. 스토리모드(학생) 8. 스토리모드(선생) 10.나의지도
		if (this.popPlayerWin && this.popPlayerWin.closed === false) {
			fAlert('재생 중인 영상이 있습니다.<br/>재생 중인 창을 닫고 실행해 주세요!', 'blue');
			return false;
		}

		var _this = this;
		/* $.ajax({
			url: "/lms/content/setPlayerId.do",
			type: 'POST',
			async: false,
			data: { player_gbn: popGbn, innb: innb },
			dataType: "json",
			success: function (result) {

				var saveYn = result.saveYn;
				_this.saveYn = result.saveYn;
				_this.bkmkGbnList = result.bkmkGbnList;
				_this.bkmkList = result.bkmkList;
				_this.shareHelpList = result.shareHelpList;
				if (result.result == 'fail') {
					if (result.msg == "login") {
						if ($('.nlogin_login_btn').length > 0) {
							fAlert("로그인이 필요한 서비스입니다.", "blue", function () {
								$('.nlogin_login_btn').trigger('click');
							});
						} else {
							fAlert("로그아웃되었습니다.", 'blue', function () {
								location.href = "/lms/cm/mcom/pmco000b00.do?loginPop=true";
							});
						}
					} else if (result.msg != "") {
						fAlert(result.msg, "red");
					} else {
						fAlert("오류가 발생하였습니다.", "red")
					}
					return;
				}


				if (saveYn == "Y") {
					_this.playerId = result.playerId;
				}
				if ($('body').find('#_playerForm').length == 0) {
					$('body').append('<form id="_playerForm" method="post" style="display:none" target="playerPop" />');
				}
				var storyMode = "N"
				if (popGbn == '7') {
					popGbn = '3'; //여행모드 = 교재모드 같은 구분으로 로 변경 8.22(학생)
					storyMode = "Y";
				} else if (popGbn == '8') {
					popGbn = '6'; //여행모드 = 교재모드 같은 구분으로 로 변경 8.22(선생)
					storyMode = "Y";
				}
				$('#_playerForm').empty();

				$('#_playerForm').append('<input type="hidden" name ="innb" value="' + $.trim(innb) + '" >');
				$('#_playerForm').append('<input type="hidden" name ="conts_innb" value="' + $.trim(contsInnb) + '" >');
				$('#_playerForm').append('<input type="hidden" name ="player_gbn" value="' + popGbn + '" >');
				$('#_playerForm').append('<input type="hidden" name ="storyMode" value="' + storyMode + '" >');

				var left = window.screenX + (window.outerWidth / 2) - (1024 / 2);
				var top = window.screenY + (window.outerHeight / 2) - (650 / 2);


				if (popGbn == '3' && saveYn == 'N') {
					var fOption = {};
					function onConfirm() {
						$('.nlogin_login_btn').trigger('click');
						$('#playerFormInnb').val($.trim(innb));
					}

					function onCancel() {
						_this.popPlayerWin = window.open("", "playerPop", 'toolbar=no, location=no, directories=no, status=no , menubar=no, scrollbars=no,fullscreen=yes, resizable=yes, copyhistory=no, width=' + screen.width + ', height=' + screen.height + ', top=' + top + ', left=' + left);
						$('#_playerForm').attr("action", "/lms/content/play.do").submit();
					}
					$.confirm({
						type: "blue"
						, boxWidth: resizeVal
						, useBootstrap: false
						, title: ''
						, content: '로그인을 하시면 진도율 저장 및 메모, 책갈피 기능을  <br/>사용할 수 있습니다.'
						, buttons: {
							confirm: {
								text: '로그인',
								action: onConfirm
							},
							cancel: {
								text: '비로그인 재생',
								action: onCancel
							},
							somethingElse: {
								text: '취소',
								keys: ['esc'],
								action: function () {
									return;
								}
							}
						}
					});
				} else {
					_this.popPlayerWin = window.open("", "playerPop", 'toolbar=no, location=no, directories=no, status=no , menubar=no, scrollbars=no,fullscreen=yes, resizable=yes, copyhistory=no, width=' + screen.width + ', height=' + screen.height + ', top=' + top + ', left=' + left);
					$('#_playerForm').attr("action", "/lms/content/play.do").submit();
				}

				if (saveYn == 'Y') {
					_this.loading();
					_this.playerCheck = setInterval(function () {
						_this.timeCount++

						if (_this.popPlayerWin.closed) {
							clearInterval(_this.playerCheck);
							_this.save();
							if (storyMode == 'Y') {
								badgeCheck(_this.popGbn);
							} else if (_this.bdg_chk_cd == 'TUTOR') {
								badgeCheck();
								_this.bdg_chk_cd = '';
							}
						};
						//일정시간마다 통신하여 세션 연장
						if (600 < _this.timeCount) {  //10분마다 서버와 통신하여 세션이 끊기지 않게 처리
							_this.timeCount = 0;
							_this.sessionCheck()
						}
					}, 500);
				}

			}, error: function () {
				console.log("error");
				_this.loading('off');
			}
		});
 */

	},

	save: function () {
		if (this.saveYn != "Y") {
			return;
		}
		var _this = this;
		var videoData = this.playVdoInfo;
		_this.timeCount = 0;
		var pdata = {};
		if ($.trim(this.playVdoInfo.full_vdo_pnttm) != "") {
			pdata.max_vdo_pnttm = videoData.max_vdo_pnttm;
			pdata.recent_vdo_pnttm = videoData.recent_vdo_pnttm;
			pdata.full_vdo_pnttm = videoData.full_vdo_pnttm;
		}
		pdata.playerId = _this.playerId;
		pdata.gbn = "Y";

		/* $.ajax({
			url: "/lms/content/updContsPlayTimeBySession.do",
			type: 'POST',
			data: pdata,
			dataType: "json",
			success: function (data) {
				_this.loading('off');
				_this.close_fn();

			}, error: function () {
				console.log("error");
				loading('off');
				self.close();
			}
		}); */

	},
	sessionCheck: function () {

		if (this.saveYn != "Y") {
			return;
		}

		var _this = this;
		/* $.ajax({
			url: "/lms/content/sessionCheck.do",
			type: 'POST',
			data: {},
			dataType: "json",
			success: function (data) {

			}, error: function () {
				clearInterval(_this.playerCheck);
				_this.popPlayerWin.close();
				fAlert("세션이 종료되었습니다.", 'red', function () {
					_this.loading('off');
					_this.close_fn();
					location.href = "/lms/cm/mcom/pmco000b00.do?loginPop=true";
				});

			}

		}); */
	},

	// API Name : 모듈_완료
	// API Desc : 웹 콘텐츠(모듈) 완료시 진도율 100프로 처리를 하기 위한 함수
	wcontsComplete: async function (nextYn) {
		console.log("wcontsComplete-call")
		await window.parent.parent.Local_frame.set_move_page()
		//console.log(window.parent.parent.Local_frame.set_move_page())
		/* return new Promise((resolve, reject) => {
			var _this = this;
			_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCESS;
			_this.response_result.code = '';
			_this.response_result.message = '';
			resolve(_this.response_result);
		}) */
	},
	// API Name : 이전 콘텐츠 이동
	// API Desc : 이전 콘텐츠 이동하기
	preContent: async function () {
		await window.parent.parent.Local_frame.set_move_page(null, "prev");
		/* if (this.innb == -1) {
			return;
		}
		var idx = $(this.popPlayerWin.document).find('.selConts').index($(this.popPlayerWin.document).find('.selConts.on'));
		console.log("kdw 플레이어체크  : " + $('.selConts').index($('.selConts.on')) + ";;;" + idx);
		if (idx != 0) {
			var a = $(this.popPlayerWin.document).find('.selConts').eq(idx - 1);
			a.get(0).click();
		} */
	},
	// API Name : 모듈_기본정보
	// API Desc : 웹 모듈 실행 시 정보 셋팅값을 전달 하기 위한 함수	 
	getDefaultInfo: function () {
		return new Promise((resolve, reject) => {
			var _this = this;
			_this.response_result.result = 'success';
			_this.response_result.code = '';
			_this.response_result.message = '';
			resolve(_this.response_result);
		});
	},

	// API Name : 코인_획득
	// API Desc : 코인 획득 함수
	setPoint: function (lanEle, point) {
		return new Promise((resolve, reject) => {
			var _this = this;
			_this.response_result.result = 'success';
			_this.response_result.code = '';
			_this.response_result.message = '';
			resolve(_this.response_result);
		})
	},

	// API Name : 코인_획득2
	// API Desc : 코인 획득 함수2
	setPoint2: function (lanEle, point, qstnNum) {
		return new Promise((resolve, reject) => {
			var _this = this;
			_this.response_result.result = 'success';
			_this.response_result.code = '';
			_this.response_result.message = '';
			resolve(_this.response_result);
		})

	}

	,

	// API Name : 코인 환전
	// API Desc : 포인트 코인으로 변경
	changePoint: function () {
		return new Promise((resolve, reject) => {
			var _this = this;
			_this.response_result.result = 'success';
			_this.response_result.result = 'fail';
			_this.response_result.code = '';
			_this.response_result.message = '';
			//_this.response_result.message = 'point_empty';
			resolve(_this.response_result);
		})
	},

	// API Name : 랜드마크_구매
	// API Desc : 랜드마크 구매 함수
	buyLmk: function (lmk_cd) {
		return new Promise((resolve, reject) => {
			var _this = this;
			_this.response_result.result = 'success';
			_this.response_result.code = '';
			_this.response_result.message = '';
			resolve(_this.response_result);
		})
	},

	close_fn: function () { }, //닫을 때 실행시켜줄 function 

	next: function () {

		if (this.innb == -1) {
			return;
		}

		var idx = $(this.popPlayerWin.document).find('.selConts').index($(this.popPlayerWin.document).find('.selConts.on'));
		if (idx + 1 < $(this.popPlayerWin.document).find('.selConts').length) {
			var a = $(this.popPlayerWin.document).find('.selConts').eq(idx + 1);
			a.get(0).click();

		} else {
			if (typeof this.eval_yn == 'undefined' || this.eval_yn == 'N') {
				var $w = $(this.popPlayerWin.document).find('.write_info_list');
				$w.empty();
				if (this.wrtInfo.wrtstaf != undefined) {
					$w.show();
					$w.append($('<li/>').html("<span><b>집필진</b></span><span>" + this.wrtInfo.wrtstaf.replace(/\n/g, "<br/>") + "</span>"));
					if (this.wrtInfo.trnsltr != undefined) {
						$w.append($('<li/>').html("<span><b>번역자</b></span><span>" + this.wrtInfo.trnsltr.replace(/\n/g, "<br/>") + "</span>"));
					}
					if (this.wrtInfo.sprvisr != undefined) {
						$w.append($('<li/>').html("<span><b>감수자</b></span><span>" + this.wrtInfo.sprvisr.replace(/\n/g, "<br/>") + "</span>"));
					}
					if (this.wrtInfo.cn_sprvisr != undefined) {
						$w.append($('<li/>').html("<span><b>내용 감수자</b></span><span>" + this.wrtInfo.cn_sprvisr.replace(/\n/g, "<br/>") + "</span>"));
					}

				} else {

					$w.hide();
				}
				$(this.popPlayerWin.document).find('#wrapDiv').empty().hide();
				$(this.popPlayerWin.document).find('#writeInfoDiv').show();
				$(this.popPlayerWin.document).find('.playlist .active').removeClass('active');
				$(this.popPlayerWin.document).find('.selConts.on').removeClass('.on');

			}
		}

	},

	// API Name : 단어장_단어추가
	// API Desc : 단어장 단어추가 함수
	addWordBook: function (input_text, wrd_clsf_cd) {
		return new Promise((resolve, reject) => {
			var _this = this;
			_this.response_result.result = 'success';
			_this.response_result.code = '';
			_this.response_result.message = '';
			resolve(_this.response_result);
		})
	},

	// API Name : 모듈 학습데이터
	// API Desc : 웹 콘텐츠(모듈) 진행시 학습데이터 저장
	contsState: function (
		conts_qstn_sj_nm,
		conts_answer,
		conts_type,
		conts_actn,
		conts_score,
		try_co,
		conts_ai_score
	) {
		var _this = this;
		return new Promise((resolve, reject) => {
			_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCESS;
			_this.response_result.code = '';
			_this.response_result.message = '';

			const get_quiz_data = {};
			get_quiz_data["지문"] = conts_qstn_sj_nm;
			get_quiz_data["정답"] = conts_answer;
			get_quiz_data["유형"] = conts_type;
			get_quiz_data["입력답"] = conts_actn;
			get_quiz_data["점수"] = conts_score;
			get_quiz_data["도전횟수"] = try_co;
			get_quiz_data["인공지능점수?"] = conts_ai_score;
			console.log("contsState-data :", get_quiz_data)


			resolve(_this.response_result);
		})
	},

	loading: function (onOff) {
		if ($.blockUI == undefined) {
			$('head:eq(0)').append($('<script/>', { src: '/js/lms/jquery.blockUI.min.js' }))
		}
		if ($.trim(onOff) == "") {
			onOff = 'on'
		}

		if (onOff == 'on') {
			if ($('#playerBackGroundTextCss').length == 0) {
				$('head:eq(0)').append($('<link id="playerBackGroundTextCss" rel="stylesheet" href="/css/lms/playerBackGroundText.css">'));
			}
			$.blockUI({
				message: '<div class="teacher_view_loading_wrap"><img src="/images/teacher/viewer_loading_img.png" alt="학습창 로딩이미지" ><div class="teacher_view_loading_text">학습창이 실행중입니다.<br/>화면을 이동하시거나 창을 닫으시면 학습창이<br/>비정상적으로 종료되니 주의하시기 바랍니다.</div></div>'
				, overlayCSS: { 'opacity': '0.3' }
				, css: { border: '0px none', 'background-color': 'transparent' }
			});
			console.log($.blockUI.defaults.css);
		} else {
			$.unblockUI();
			$('.subNav').css('display', 'none');
		}
	},

	getTransLang: function () {
		var _this = this;
		return _this.trans_lang;
	},
	getWrtInfo: function (clasLessonInnb, playerGbn) {
		var _this = this;
		$.ajax({
			url: "/lms/content/getWrtStafInfo.do",
			data: {
				"clas_lesson_innb": clasLessonInnb,
				"player_gbn": playerGbn
			},
			type: 'POST',
			dataType: 'json',
			success: function (data) {
				_this.wrtInfo = data.info;
			}, error: function () {

			}
		});
	},
	getLrnDataPassYnList: function () {
		var _this = this;
		var result = "";
		$.ajax({
			url: "/lms/content/getLrnDataPassYnList.do",
			data: {
				"clas_lesson_innb": _this.curInfo.lesson_innb,
				"player_gbn": _this.curInfo.playerGbn,
				"clas_conts_innb": _this.curInfo.content_innb
			},
			type: 'POST',
			dataType: 'json',
			async: false,
			success: function (data) {
				result = data;
			}, error: function () {
				result = { result: 'fail', "message": "오류가 발생하였습니다." }
			}
		});
		return result;
	},
	setDevtoolsDetector: function () {
		var _this = this;
		try {
			$('head:eq(0)').append($('<script/>', { src: '/js/lms/devtools-detector.js' }))
			devtoolsDetector.addListener(function (isOpen) {
				if (isOpen) {
					if (_this.popPlayerWin != "" && _this.popPlayerWin.closed == false) {
						_this.popPlayerWin.close();
						fAlert("비정상적인 시도로 학습창이 강제 종료되었습니다.", "red");
					}
				}
			});
			devtoolsDetector.launch();
		} catch (e) {
			console.log("setDevtoolsDetector 오류발생")
		}
	},
	questionSubmit: function (
		conts_answer_number
		, conts_answer_text
		, conts_my_answer_number
		, conts_my_answer_text
		, conts_question_number
		, conts_question_text
		, conts_answer_corret_yn
		, conts_points
		, conts_subjective_yn
	) {
		return new Promise((resolve, reject) => {

			var _this = this;
			if (_this.can_question_submit == 'Y') {
				$.ajax({
					url: "/lms/conts/questionSubmit.do",
					contentType: 'application/json',
					data: JSON.stringify({
						"user_info": _this.user_info,
						"contsAnswerNumber": conts_answer_number,
						"contsAnswerText": conts_answer_text,
						"contsMyAnswerNumber": conts_my_answer_number,
						"contsMyAnswerText": conts_my_answer_text,
						"contsQuestionNumber": conts_question_number,
						"contsQuestionText": conts_question_text,
						"contsAnswerCorrectYn": conts_answer_corret_yn,
						"contsPoints": conts_points,
						"contsSubjectiveYn": conts_subjective_yn,
						"contsInnb": _this.curInfo.content_innb,
						"contsLessonInnb": _this.curInfo.lesson_innb,
						"contsType": _this.curInfo.playerGbn,
						"contsEle": _this.conts_ele
					}),
					type: 'POST',
					dataType: 'json',
					async: false,
					success: function (data) {
						if (data.result == "success") {
							_this.can_question_submit = 'N'
							if (data.contsResult != null) {
								_this.conts_objective_answer_list = data.contsResult.contsObjectiveAnswerList;
								_this.conts_subjective_answer_list = data.contsResult.contsSubjectiveAnswerList;
								_this.conts_objective_answer_flags = data.contsResult.contsObjectiveAnswerFlags;
								_this.conts_subjective_answer_flags = data.contsResult.contsSubjectiveAnswerFlags;
							}

							_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCESS;
							_this.response_result.code = '';
							_this.response_result.message = '';
							resolve(_this.response_result);
						} else if (data.result == "fail") {
							_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.FAIL;
							_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E001.name;
							_this.response_result.message = _this.CODE.RESPONSE_CODE_TYPE.E001.desc;
							resolve(_this.response_result);
						}
					}, error: function (error) {
						_this.response_result.result = 'fail';
						_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
						_this.response_result.message = error.responseText;
						resolve(_this.response_result);
					}
				});
			}
		})
	},
	getQuestionResult: function (contsLessonInnb, contsType) {
		var _this = this;
		$.ajax({
			url: "/lms/conts/getQuestionResult.do",
			contentType: 'application/json',
			data: JSON.stringify({
				"contsLessonInnb": contsLessonInnb,
				"contsType": contsType,
			}),
			type: 'POST',
			dataType: 'json',
			async: false,
			success: function (data) {
				if (data.contsResult != null) {
					_this.conts_objective_answer_list = data.contsResult.contsObjectiveAnswerList;
					_this.conts_subjective_answer_list = data.contsResult.contsSubjectiveAnswerList;
					_this.conts_objective_answer_flags = data.contsResult.contsObjectiveAnswerFlags;
					_this.conts_subjective_answer_flags = data.contsResult.contsSubjectiveAnswerFlags;
				} else if (data.result == "fail") {
					console.log("error");
				}
			}, error: function () {
				console.log("error");
			}
		});
	},
	getQuestionRslt: function() {
		let _this = this;
		return new Promise((resolve, reject) => {
			var _this = this;
			_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCESS;
			_this.response_result.code = '';
			_this.response_result.message = '';

			resolve(_this.response_result);

		})

	},
	getGameRankInfo: function (
		gameId
		, gameLevel
	) {
		return new Promise((resolve, reject) => {
			var _this = this;
			$.ajax({
				url: "/lms/conts/getGameRankInfo.do",
				contentType: 'application/json',
				data: JSON.stringify({
					"user_info": _this.user_info,
					"game_id": gameId,
					"game_level": gameLevel
				}),
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function (data) {
					if (data.result == "success") {
						if (data.contsResult != null) {
							_this.conts_game_rank_info = data.contsResult;
						}

						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCESS;
						_this.response_result.code = '';
						_this.response_result.message = '';
						resolve(_this.response_result);
					} else if (data.result == "fail") {
						// 실패 리턴
						_this.response_result.result = 'fail';
						_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E100.name;
						_this.response_result.message = _this.CODE.RESPONSE_CODE_TYPE.E001.desc;
						resolve(_this.response_result);
					}
				}, error: function (error) {
					// 실패 리턴
					_this.response_result.result = 'fail';
					_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
					_this.response_result.message = error.responseText;
					resolve(_this.response_result)
				}
			});
		})
	},
	insGameRankInfo: function (
		gameId
		, gameLevel
		, gameScore
		, startDt
	) {
		return new Promise((resolve, reject) => {
			var _this = this;
			$.ajax({
				url: "/lms/conts/insGameRankInfo.do",
				contentType: 'application/json',
				data: JSON.stringify({
					"user_info": _this.user_info,
					"game_id": gameId,
					"game_level": gameLevel,
					"game_score": gameScore,
					"start_dt": startDt
				}),
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function (data) {
					if (data.result == "success") {
						console.log('게임결과저장완료');
						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCESS;
						_this.response_result.code = '';
						_this.response_result.message = '';
						resolve(_this.response_result);
					} else if (data.result == "fail") {
						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.FAIL;
						_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E001.name;
						_this.response_result.message = _this.CODE.RESPONSE_CODE_TYPE.E001.desc;
						resolve(_this.response_result);
					}
				}, error: function (error) {
					_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.FAIL;
					_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
					_this.response_result.message = error.responseText
					resolve(_this.response_result);
				}
			});
		})
	},
	// 랜드마크 구매여부
	LMK001: false, LMK002: false, LMK003: false, LMK004: false, LMK005: false,
	LMK006: false, LMK007: false, LMK008: false, LMK009: false, LMK010: false,
	LMK011: false, LMK012: false, LMK013: false, LMK014: false, LMK015: false,
	LMK016: false, LMK017: false, LMK018: false, LMK019: false, LMK020: false,
	LMK021: false, LMK022: false, LMK023: false, LMK024: false, LMK025: false,
	LMK026: false, LMK027: false, LMK028: false, LMK029: false, LMK030: false,
	LMK031: false, LMK032: false, LMK033: false, LMK034: false, LMK035: false,
	LMK036: false, LMK037: false, LMK038: false, LMK039: false, LMK040: false,
	LMK041: false, LMK042: false
};

//# sourceURL=foo.coffee

const add_data_list = {
	LMK001: {
		info_title: `상하이 (중국)`,
		info_text:
			`동방명주는 468m로 1991년 7월 30일에
		착공하여, 1994년 10월 1일에 완공된
		방송수신탑이다.동방명주를 상징하는
		분홍빛의 거대한 3개의 구체를 포함하여
		11개의 크고 작은 진주 형태로 건축되었다.
		동방명주는 크게 3개의 전망대를
		가지고 있다. 지면으로부터 90m
		지점에 샤치우티(下球体) 전망대 
		259m 지점에 샹치우티(上球体) 전망대,
		351m 지점에 타이콩창(太空舱) 전망대가
		있다. 타이콩창 전망대에 오르면
		황푸 강이 한눈에 들어온다.`
	},
	LMK002: {
		info_title: `자카르타(인도네시아)`,
		info_text:
			`자카르타의 랜드마크인 모나스 타워는 1945년 8월 17일 인도네시아의 독립 선언을 기념하며 세운 탑이다. 높이 137m의 오벨리스크 탑으로 시내 관광의 지표로 삼는 곳이며, 자카르타 방문 시 관광객들이 제일 먼저 찾는 명소이기도 하다. 탑 꼭대기에는 도금한 불꽃 조형물이 장식되어 있다. 기념탑 아래층에 있는 박물관에서는 인도네시아의 역사를 간략히 보여주는 미니어처 세트가 꾸며져 있다.`
	},
	LMK003: {
		info_title: `바나우에(필리핀)`,
		info_text:
			`라이스 테라스는 필리핀 루손 섬에 있는 도시 바나우에에 위치하고 있다. 필리핀 지폐에도 새겨져 있는 이 계단식 논은 2,000년 전 만들어졌다고 알려져 있다. 필리핀 북부에 위치한 바나우에는 험준한 산악지대로 농사를 지을 논이 없어 산비탈에 계단 형태의 논을 만들어 벼농사를 짖고 있다. 이곳 바나우에의 계단식 논은 세계 최대 규모로서 자연을 이용하는 인간의 노력상을 보여주는 명소로서 그 풍광이 뛰어나 1995년 유네스코세계문화유산으로 지정되었다.`
	},
	LMK004: {
		info_title: `브하라<br>(우즈베키스탄)`,
		info_text:
			`칼란 미나레트는 중앙아시아에서 가장 큰 첨탑으로 통한다. 높이가 46m다. 숱한 외침과 붕괴 속에서도 명맥을 유지할 수 있었던 것은 종교적 의미 외에 이 탑의 또 다른 기능 덕분이다. 꼭대기에 불을 지피면 탑은 사막의 등대 역할을 했다. 실크로드의 행상들은 불빛만을 보고도
			오아시스인 부하라를 찾을 수 있었다.`
	},
	LMK005: {
		info_title: `델리(인도)`,
		info_text:
			`1986년 거대한 흰색 대리석 연꽃잎 모양으로 만들어진 사원으로, 9면의 기단이 물 위에 세워져 있어, 마치 사원이 물 위에 떠 있는 것 같은 느낌을 준다. 꽃잎 부분의 다양한 곡선 때문에, 대리석 조각이 먼저 각각의 방향과 모양에 따라 입혀진 뒤, 각 위치에 조립되었다. 34m 높이의 사원은 상부 구조물이 전체적으로 빛이 잘 들어올 수 있도록 만들어졌다. 세계에서 가장 아름다운 건축물 중 하나로 알려진 바하이  사원은 현대 신앙의 구조물에 고대 모티브의 변형을 잘 표현한 성공적인 아이콘으로 평가받고 있다.`
	},
	LMK006: {
		info_title: `서울(대한민국)`,
		info_text:
			`경복궁은 조선 왕조를 대표하는 제일의 법궁이다. 1395년 창건되어 1592년 임진왜란으로 전소되었고, 1868년 흥선대원군의 주도로 중건되었다. 궁궐 안에는 왕과 관리들의 정무 시설, 왕족들의 생활 및 휴식 공간이 조성되어 있다. 또한 왕비의 중궁, 세자의 동궁 등 궁궐 안에 다시 여러 작은 궁들이 복잡하게 모인 곳이기도 하다. 그러나 일제강점기에 거의 대부분의 건물들을 철거하여 근정전 등 극히 일부 중심 건물만 남았고, 조선총독부 청사를 지어 궁궐 자체를 가려버렸다. 다행히 1990년부터 본격적인 복원 사업이 추진되어 총독부 건물을 철거하고 홍례문 일원을 복원하였다.`
	},
	LMK007: {
		info_title: `시즈오카현 북동부,<br>야마나시현 남부(일본)`,
		info_text:
			`높이 3,776m 원추형의 후지산은 18세기 초 분화가 있은 이후 현재까지 분화하지 않고 있다. 후지산은 일본을 대표하는 미의 상징으로 오랜 세월 동안 화가와 시인들에게 영감을 주었다. 후지산에 대한 일본 미술의 표현은
			11세기로 거슬러 올라가지만, 후지산이 일본의 국제적 아이콘으로 인식하게 한 미술작품은 19세기의 목판화였다. 이 목판화는 서양 미술의 발전에도 깊은 영향을 미쳤다.`
	},
	LMK008: {
		info_title: `양곤(미얀마)`,
		info_text:
			`몬족(族)이 미얀마에 세운 페구왕조 때인 1453년에 건설되었다. 둘레는 426m, 높이는 100m이다. 기단부는 정사각형이고, 기단 윗부분은 원뿔 꼴이며, 위로 올라갈수록 폭이 급격히 좁아지는 형태를 취한다. 탑 외벽은 약 6톤의 황금으로 뒤덮여 있어 화려하며, 내부에는 부처의 유품이 들어 있다. 원래는 금판(金板)이 붙지 않았으나, 1990년대부터 관리위원회에서 일반인들에게 금판 기증을 권유하면서 붙이기 시작하였다. 또 미얀마 역대의 왕과 불교도들이 기증한 금판으로 외벽을 장식하면서 화려해져, 지금은 각종 보석과 황금으로 뒤덮인 세계적인 불교유적으로 자리잡았다.`
	},
	LMK009: {
		info_title: `씨엠리아프(캄보디아)`,
		info_text:
			`앙코르 유적은 동남아시아에서 가장 중요한 고고학 유적 가운데 하나로, 1861년 밀림 소에서 발견되었다.  9세기부터 15세기까지 크메르 제국의 수도로서, 12세기에 앙코르 왕조의 수리야바르만 2세 때 조성된 힌두 사원이며 현재는 불교 사원이 되었다. 앙코르에서 발달한 크메르 예술은 동남아시아의 많은 지역에 큰 영향을 미쳤을 뿐만 아니라 독특한 발달 과정에서 근본적인 역할을 했다. 대체로 인도대륙의 양식에서 발달한 크메르 건축 양식은 고유의 특징을 가지고 발달함으로써 다른 건축 양식과 확실히 구분되었다. 어떤 점에서는 독립적으로 발달했지만, 이웃한 전통 문화로부터 습득한 특징도 있었다. 그 결과 동양 예술과 건축학에서 새로운 예술적 지평을 열었다.`
	},
	LMK010: {
		info_title: `광닌(베트남)`,
		info_text:
			`통킹(Tonkin) 만에 있는 하롱베이(Ha Long Bay)에는 약 1,600개의 크고 작은 섬들이 있다. 작은 섬들은 석회암이 빗물과 해수에 의해 녹고 그리고 바람에 의해 침식을 받아 깎여나가고 단단한 부분들 만이 남아 바다에 잠겨 만들어진 것이다. 이러한 지형을 탑카르스트 지형이라고 말하는데, 푸른 바다와 어울려 산수화를 보는 것처럼 풍광이 아름답다. 험준한 자연 조건 때문에 대부분의 섬에 사람이 살지 않아, 인간의 영향을 받지 않았다. 경관이 빼어나게 아름다울 뿐만 아니라 생물학적으로도 많은 관심을 받고 있다.`
	},
	LMK011: {
		info_title: `바로셀로나(스페인)`,
		info_text:
			`바르셀로나 교외 언덕에 있는 구엘 공원은 원래는 이상적인 전원 도시를 만들 목적으로 설계된 곳이다. 가우디의 경제적 후원자 구엘 백작이 평소 동경하던 영국의 전원 도시를 모델로 했다. 곡선 위주의 건물들, 화려하고 독특한 모자이크 장식과 타일 문양 등은 가우디의 건축의 진수를 잘 보여준다. 구엘공원은 스페인이 낳은 천재 건축가 가우디의 가장 훌륭한 작품 중에 하나로 기억되고 있으며, 현재는 많은 시민들의 쉼터로 사랑받고 있다.`
	},
	LMK012: {
		info_title: `로마(이탈리아)`,
		info_text:
			`고대 로마인들의 뛰어난 건축공학 기술을 엿볼 수 있는 대표적인 건축물로, 정식 명칭은 '플라비우스 원형경기장(Amphitheatrum Flavium)'이라고 한다. 플라비우스 왕조 때 세워진 것으로 베스파시아누스 황제가 착공하여 80년 그의 아들 티투스 황제 때에 완성하였다. 글라디아토르의 시합과 맹수 연기 등이 시행되었으며, 그리스도교 박해시대에는 신도들을 학살하는 장소로도 이용되었다. 로마 정치가들에게 원형경기장은 시민들에게 볼거리를 제공하여 자신들의 정치적 입지를 굳히고 화합을 도모하며 때로는 로마나 귀족의 권위에 불복했을 때 일어날 수 있는 보복을 암시하는 공간이었다. 직경의 긴 쪽은 188m, 짧은 쪽은 156m, 둘레는 527m의 타원형이고, 외벽(外壁)은 높이 48m로 4층이며, 하단으로부터 도리스 양식·이오니아 양식·코린트 양식의 원주(圓柱)가 아치를 끼고 늘어서 있다. 내부는 약 5만 명을 수용하는 계단식 관람석이 방사상(放射狀)으로 설치되어 있다.`
	},
	LMK013: {
		info_title: `파리(프랑스)`,
		info_text:
			`1889년 프랑스 혁명 100주년을 기념해 개최된 파리 만국박람회 때 구스타브 에펠의 설계로 세워진 탑이다. 에펠탑 건축 당시에는 우아한 파리의 거리와 어울리지 않는 흉물스러운 '철골덩어리'라며 지식인들의 비난을 받았다. 소설가 모파상은 에펠탑의 모습을 보기 싫어 파리 시내에서 유일하게 에펠탑이 보이지 않는 에펠탑 내의 레스토랑에서 밥을 먹었다는 일화가 전해지기도 한다. 그러나 완공된 후에는 새로운 예술을 추구하는 사람들에게 많은 지지를 받았고, 오늘날에는 파리의 랜드마크로 자리 잡았다.`
	},
	LMK014: {
		info_title: `런던(영국)`,
		info_text:
			`영국 런던 웨스트민스터 궁전 북쪽 끝에 있는 시계탑의 별칭으로, 공식 명칭은 '엘리자베스 타워(Elizabeth Tower)'다. 96ｍ 높이에 설치된 빅벤은 1859년 5월 31일 처음 가동을 시작했고, 시계 밑에는 라틴어로 '주여 빅토리아 여왕을 구원하소서'라는 글귀가 새겨져 있다. 빅벤이라는 명칭은 처음에는 시계탑의 종을 뜻하는 말이었으나 이후 시계탑과 시계를 통칭하는 말로 바뀌었다. 그러다 2016년 6월 영국의회는 엘리자베스 2세 여왕의 즉위 60주년(다이아몬드 주빌리)에 맞춰 빅벤의 공식 명칭을 '엘리자베스 타워'로 정하였다.`
	},
	LMK015: {
		info_title: `모스크바(러시아)`,
		info_text:
			`붉은 광장은 러시아 연방의 수도 모스크바에 있는 광장으로 모스크바의 랜드마크로서 세계적인 명소이다.
			크렘린(궁)을 도시와 분리시키는 경계 역할을 하며, 모스크바의 주요 도로와 거리들이 대부분 이 광장에서 뻗어나가기 때문에 모스크바의 중심부로 여겨진다. 붉은 광장은 모스크바의 주요 시장터였으며, 주로 법령의 공포, 공공 행사 등이 이 곳에서 주로 집행되었고, 특히 왕의 즉위식이 바로 이 곳에서 진행되었다. 붉은 광장에 있는 상트 바실리 대성당은 러시아정교회의 가장 아름다운 기념물 중에 하나로 꼽힌다.`
	},
	LMK016: {
		info_title: `아티카(그리스)`,
		info_text:
			`도리스 양식의 건축으로 가장 유명한 대표적 유례는 파르테논 신전이다. 이것은 아테네의 아크로폴리스(Acropolis) 구릉 위에 돋보이게 서 있다. 그 규모의 장엄함과 미적 가치의 뛰어남 등 기타 모든 점에서 그리스 신전 건축에서 으뜸을 차지하고 있을 뿐만 아니라, 전 세계를 통하여 가장 아름다운 건축이라고 할 수 있다. 파르테논 신전은 아테네 부근의 산에서 채석된 대리석을 사용했으며, 아크로폴리스 산정 위에 우뚝 서 있어 먼 곳과 바다에서도 두드러지게 잘 보여 아테네의 부와 힘을 명백하게 상징하는 것이었다. 파르테논 신전은 그리스 건축양식의 최고도의 세련된 형식과 기술을 잘 나타내고 있다. 파르테논은 그 구조나 장식과 디자인 및 기술 등에 있어서 그리스 고전건축의 대표적인 것이지만 오늘날은 파괴되어 그 일부분만 남아 있다. 유네스코의 세계유산제도의 심벌을 파르테논 신전으로 하고 있는데, 이는 그리스문명이 오늘날 유럽문명의 뿌리라는데서 기인한다.`
	},
	LMK017: {
		info_title: `이스탄불(튀르키예)`,
		info_text:
			`톱카프 궁전은 오스만 제국의 궁전으로 투르키예의 이스탄불에 위치해 있으며, 1465년부터 1853년까지 거의 모든 술탄이 살던 곳으로 통치의 중심이었다. 톱카프 궁전은 크게 세 개의 중정으로 나뉘며, 각각의 중정을 연결하는 세 개의 거대한 문이 있다. 궁전은 세 개의 문과 네 개의 중정(中庭)이 있다. 제1중정에는 비잔티움제국 유스티니아누스 1세 때 지은 하기아 이레네 성당이 있다. 이곳은 오스만 제국이 비잔티움제국을 정복한 후에도 원래 형태로 남겨 두었다. 제3중정에는 남자들의 출입이 금지된 하렘이 있는데, 내부의 장식이 매우 화려하다.`,
		sub_title: "톱카프 궁전(파디샤의 문)"
	},
	LMK018: {
		info_title: `부다페스트(헝가리)`,
		info_text:
			`도나우강의 진주로 알려진 부다페스트에 가장 먼저 만들어진 다리로 부다페스트를 대표하는 상징물 중 하나다. 세체니 이슈트반 백작의 아이디어로 시작하여 스코틀랜드인 클라크 아담에 의해 건설되었다. 당시, 이 다리는 경제와 사회 발전의 상징이었다. 이후 1945년에 독일군에 의해 다리가 폭파되었으나 다리를 만든 지 100년이 되던 1949년에 다시 개통되었다. 세체니라는 이름은 이 다리에 공헌한 세체니 백작을 일컫기도 하지만 밤을 밝히는 전구의 모습이 마치 사슬처럼 보인다 하여 붙여졌다. 그리고 다리 난간에는 혀가 없다고 전해지는 사자상이 있다. 지금은 부다페스트의 야경에서 빼놓을 수 없는 아름다운 다리로 자리하고 있다.`
	},
	LMK019: {
		info_title: `베를린(독일)`,
		info_text:
			`동 · 서 베를린 경계선 약 45.1km에 걸친 콘크리트 벽으로, 1961년에 동독 정부가 서베를린으로 탈출하는 사람들과 동독 마르크 화폐의 유출을 방지하기 위하여 축조하였다. 오랜 기간 동 · 서 냉전의 상징물로 인식되어 온 베를린 장벽은 동유럽의 민주화로 1989년 11월 9일에 철거되었다. 오늘날 포츠담 광장에 남은 장벽은 살아 있는 기념물이 되어 수많은 관광객을 맞이하고 있다.`
	},
	LMK020: {
		info_title: `리스본(포르투칼)`,
		info_text:
			`'테주강의 귀부인'이라는 별칭이 붙은 벨렝탑은 1515년에서 1521년에 걸쳐 이뤄진 바스코 다 가마의 위대한 발견을 기념하기 위해 테주 강변에 세워진 건축물이다. 과거 벨렝탑은 강어귀를 드나드는 이들을 감시하는 요새이기도 했고, 모든 탐험대의 전진기지이기도 했다. 탐험가들은 오랜 항해를 떠나기 전 마지막으로 벨렝탑을 바라보았고, 돌아와 지친 눈으로 벨렝탑을 바라보며 무사 귀환에 안도했다. 성 중앙에는 뱃사람들의 무사 귀환을 빌기 위한 성모 마리아상이 있고 탑 상층부에는 총독의 방과 화려한 테라스가 있는 왕의 방, 예배당 등이 있다.`
	},
	LMK021: {
		info_title: `아바나(쿠바)`,
		info_text:
			`아바나 비에하의 독특한 정취에 흠뻑 젖기 좋은 비에하 광장(Plaza Vieja)은 산 프란시스코 광장 남쪽 끝의 브라질 거리를 따라 조금만 가면 이어지는 광장이다. 아바나의 여러 광장 중 사람들이 가장 많이 모이는 곳으로, 단아하고 우아한 색상을 가진 2층 건물이 광장을 둘러싸고 있다. 쿠바의 상징과 같이 느껴지는 올드카는 비에하 광장에 아름다움을 더해주고 있다.`
	},
	LMK022: {
		info_title: `뉴욕(미국)`,
		info_text:
			`자유의 여신상(Statue of Liberty)은 프랑스의 조각가 프레데리크오귀스트 바르톨디(Frédéric-Auguste Bartholdi)와 공학자·토목 기술자인 구스타브 에펠(Gustave Eiffel, 강철 프레임을 책임짐)이 협업하여 만들었다. 자유를 기념하는 이 높다란 조각상은 1886년 미국 독립 100주년을 기념하여 프랑스가 선물로 준 것으로, 왼손에는 독립 선언서, 오른손에는 횃불을 들고 있고 머리에 씌워진 왕관이 씌어져 있다. 조각상은 뉴욕항(New York Harbour) 입구에 세워진 이후 지금까지 수백만 명의 이민자들을 환영해 왔다. 원래 청동과 구리로 만든 조각상으로 처음 세웠을 때는 누런 구리색을 띠었으나 산화되어 지금의 연한 청록색을 띠고 있다.`
	},
	LMK023: {
		info_title: `남아메리카 7개국`,
		info_text:
			`안데스 산맥은 남아메리카 서쪽 태평양 연안을 따라 북의 파나마 지협(地峽)에서 남의 드레이크 해협까지 남북으로 뻗은, 지구상에서 가장 긴 산맥을 말한다. 평균 너비는 300km이나 가장 넓은 곳은 700km(볼리비아)에 달하며, 베네수엘라 · 콜롬비아 · 에콰도르 · 페루 · 볼리비아 · 칠레 · 아르헨티나 등 7개 나라를 지나간다. 지세에 따라 북안데스와 중앙안데스, 남안데스의 3대 부분으로 나눈다. 그 가운데서 중앙안데스가 가장 넓고 높은 봉우리가 많으며, 바로 여기서 안데스 문명이 탄생하였다.`
	},
	LMK024: {
		info_title: `캐나다와 미국 국경`,
		info_text:
			`나이아가라 폭포는 미국령인 고트섬과 캐나다의 온타리오주와의 사이에 위치하고 있으며 높이 약 53m, 너비 약 790m에 이르는 것으로, 중앙을 국경선이 통과하고 있다. 브라질 이구아수 폭포, 잠비아 빅토리아 폭포와 함께 세계 3대 폭포 중 하나로, 예로부터 인디언들에게는 잘 알려져 있었으나 백인에게 발견된 것은 1678년 프랑스의 선교사 헤네핑에 의해서였다. 신대륙의 대자연을 상징하는 대표적인 것으로 선전되어 전세계에 알려지게 되었다. 폭포의 주변은 경치가 아름다워 공원화되어 있으며, 교통과 관광시설이 정비되어 있어 세계 각국으로부터 관광객이 많이 찾아온다.`
	},
	LMK025: {
		info_title: `쿠스코주(페루)`,
		info_text:
			`페루 남부 쿠스코시의 북서쪽 우루밤바 계곡 해발 2,430m에 자리한 마추픽추(Machu Picchu)는 열대의 고산지대 산악림(tropical mountain forest)에 세워진 아름다운 절경을 자랑하는 고대도시 유적이다. 잉카(Inca)제국의 절정기에 건설되었으며 가장 놀라운 도시 창조물로 평가될 만한 이 유적의 거대한 벽, 테라스, 경사로는 마치 자연적으로 깎여서 형성된 절벽처럼 보인다. 안데스(Andes) 산맥의 동쪽 경사면에 있는 이곳의 자연환경은 다양한 동식물이 서식하고 있는 아마존(Amazon) 강 상류의 분지를 에워싸고 있다.`
	},
	LMK026: {
		info_title: `리우 데 자네이루(브라질)`,
		info_text:
			`브라질 리우데자네이루(Rio de Janeiro) 코르코바도산(corcovado Mt.704m) 정상에 있는 그리스도상으로, 포르투갈로부터 독립한 지 100주년 되는 해를 기념하여 세웠다. 규모는 높이 38m, 양팔의 길이 28m, 무게 1,145t으로, 1926년부터 1931년에 걸쳐 공사가 이루어졌다. 그리스도가 두 팔을 한일(一)자 모양으로 넓게 벌리고 서 있는 모습으로, 신체 부분을 각각 따로 조각하여 결합하는 방식으로 제작되었다. 외관은 하얀 빛깔의 납석을 발라 마감하였으며, 기단 내부에는 150명을 수용할 수 있는 예배당이 있다. 2000년 새롭게 보수하였으며 주변에서는 코파카바나 해안, 이파네마(Ipanema) 해변, 슈가로프산(Sugarloaf Mt.) 등의 아름다운 경관을 조망할 수 있다.`
	},
	LMK027: {
		info_title: `포토시(볼리비아)`,
		info_text:
			`중부 안데스 산지의 고원지대인 알티플라노(Altiplano) 남부에 형성된 소금 호수로, ‘우유니 소금사막’ 혹은 ‘우유니 염지’ 등으로도 불린다. 호수의 서쪽 가장자리는 안데스산맥의 일부인 옥시덴탈 산계(Cordillera Occidental)에 의해 칠레와 국경을 이루며, 호수를 포함해 그 동편은 볼리비아의 영토이다. 볼리비아의 실질적 수도인 라파스(La Paz)로부터 남쪽으로 200㎞ 떨어져 있으며, 행정 구역상 포토시(Potosí) 주에 속하고, 우유니 시 서쪽 끝에 자리하고 있다. 해발 고도는 3,680m에 이르며, 면적은 12,000㎢ 정도이다. 우기에는 물이 고여 얕은 호수를 이루어 지구상에 가장 거대한 거울이 만들어진다. 반면 건기에는 물이 말라 소금이 드러나는 드넓은 평지로 바뀐다.`
	},
	LMK028: {
		info_title: `유카탄 반도(멕시코)`,
		info_text:
			`치첸이트사(Chichen-Itza)는 유카탄(Yucatan) 반도 북서부에 있는 마야(Maya) 문명의 가장 대표적인 도시 유적지에 속한다.  7세기경부터 이트사족에 의해 건축되기 시작하여 13세기 아즈텍-톨텍족이 점령한 이후 번영을 누리다가 15세기 무렵 가뭄에 의한 자연환경 변화로 폐허가 되었다.
			세계관과 우주관에 대한 마야-톨텍(Maya-Toltec)인의 통찰력이 석조 건축물과 예술 작품에 드러나 있다. 마야 건축 기술과 중부 멕시코에서 유입된 새로운 기법들이 서로 융합된 치첸이트사의 유적들은 유카탄의 마야-톨텍 문명의 가장 중요한 사례 중 하나가 된 것이다. 이곳에는 전사의 신전, 엘 카스티요(El Castillo) 피라미드, 엘 카라콜(El Caracol)로 알려진 나선형 관측소 등 여러 건축물들이 남아 있다.`
	},
	LMK029: {
		info_title: `남아메리카 북부`,
		info_text:
			`남아메리카 북부의 큰 강으로 페루의 안데스 산맥에서 발원해 페루와 브라질 등 5개 나라에서 흘러드는 지류가 모여 적도를 따라 동쪽으로 흘러 대서양에 들어간다. 유역은 705만km2로 세계 최대이며 열대우림 지역을 흐른다. 
			어귀인 브라질의 벨렝에서 1,500km 상류인 마나우스까지 외항선이 다닐 수 있다. 10~1월과 3~7월이면 물이 불어나 농사에 큰 도움을 준다. 길이로는 미시시피 강, 나일 강과 함께 세계 3대 강의 하나이며 많은 지류를 거느리고 있다.`
	},
	LMK030: {
		info_title: `산페드로데아타카마(칠레)`,
		info_text:
			`달의 계곡은 지질학적으로 진흙으로 이루어진 산으로 오랜 세월에 걸쳐 침식되면서 만들어진 곳이다.
			그 풍경이 황량하면서도 아름다움을 선사하기도 하며, 또 태양이 비치는 각도에 따라 계곡의 색깔이 오렌지색, 빨간색, 베이지색 등 여러 가지 색으로 바뀌며 신기한 모습을 보여주기도 한다. 그 모습이 마치 지구가 아닌 외계행성을 닮아 우주영화의 촬영지로 이용되기도 한다.`
	},
	LMK031: {
		info_title: `마라케시 페즈(모로코)`,
		info_text:
			`아랍어로 ‘빛나는 것‘을 의미하는 바이하 궁전은 알함브라 궁전의 축소판이라 할 만큼 가장 잘 보존된 궁전 유적지 중 하나다. 1866년과 1867년 사이에 지어진 바이하 궁전은 마라케시 메디나 중앙에 위치하고 있으며 150개의 방으로 구성되어 있다. 현재는 대중에게 공개된 역사박물관 역할을 하고 있으며 마라케시의 주요 행사를 개최하는 장소이기도 하다. 바이하 궁전은 아름다운 타일과 화려한 스테인드글라스 창문은 다채로운 패턴을 만들어내며, 아름다운 색으로 칠해진 나무조각이 건축 예술의 진수를 보여준다.`
	},
	LMK032: {
		info_title: `시드니(오스트레일리아)`,
		info_text:
			`1973년에 준공된 시드니 오페라하우스(Sydney Opera House)는 건축 형태와 구조적 설계의 모든 면에서 뛰어난 창의력과 혁신적인 방법을 결합시킨 근대 건축물이다. 시드니항구 쪽으로 돌출된 반도의 끝의 뛰어난 해안경관을 배경으로 세워진 커다란 도시적 조형물인 이 건물은 이후의 건축에 지속적으로 영향을 미쳤다. 시드니 오페라하우스는 2개의 주 공연장과 하나의 레스토랑이 있는데, 이들 장소를 덮는 서로 맞물리는 3개의 ‘조가비’ 모양의 둥근 천장이 독특하다. 이 조가비 구조는 광대한 플랫폼 위에 세워져 있고, 보행로 기능을 하는 테라스가 주변을 둘러싸고 있다. 시드니 오페라하우스의 프로젝트는 1957년 국제공모전에 당선된 덴마크의 건축가 이외른 우촌(Jørn Utzon)에게 맡겨졌다. 당시 우촌의 설계안은 건축에 있어서 근본적으로 새롭게 접근하는 방식이어서 상당한 주목을 끌었다.`
	},
	LMK033: {
		info_title: `기자(이집트)`,
		info_text:
			`피라미드는 고대 이집트 왕족의 무덤으로 이집트 문명의 상징적인 건축물로 통한다. 4각형의 토대에 측면은 3각형을 이루며, 각 측면이 한 정점에서 만나 방추형을 이루도록, 돌이나 벽돌 등을 쌓아 만들었다. 경우에 따라 측면이 사다리꼴을 이루어 꼭대기가 평평한 것도 있으며, 측면이 계단 형식으로 이루어진 것도 있다. 여러 지역에서 여러 시대에 걸쳐 건조되었는데, 주로 이집트, 수단, 에티오피아, 메소포타미아, 동아시아, 멕시코, 남아메리카, 지중해 연안 지역 등 고대 문명권에서 발굴되었으며, 현재 발굴 중이거나 구조물의 흔적으로 추정되는 유적지만 발굴된 곳도 있다. 이 중 이집트, 멕시코, 남아메리카의 피라미드가 가장 잘 알려져 있다.`
	},
	LMK034: {
		info_title: `나이로비(케냐)`,
		info_text:
			`나이로비 국립공원은 케냐의 수도 나이로비 시내 남쪽에서 8km 떨어진 곳에 자리하고 있으며, 1946년 국립공원으로 지정되었다. 아프리카 자연공원 중에는 규모가 작은 편이지만, 편리한 교통 때문에 여행자들이 많이 찾는다. 수도 내 위치한 국립공원으로는 최대 규모로 꼽힌다. 면적은 약 117km2다. 고도는 1,500 ~ 1,800m이며 선선한 기후를 자랑한다. 건기와 우기가 반복되는 사바나초원 위로 사자, 치타, 하마, 기린, 영양, 원숭이, 그리고 멸종위기 동물인 검은 코뿔소 등 100여 종의 포유류와 대머리독수리, 서기관조, 타조, 망치새, 아프리카 두루미, 안장부리황새 등 수많은 500종이 넘는 조류가 서식하는 것으로 알려졌다. 나이로비 국립공원에는 울창한 숲을 비롯하여 계곡, 초원, 암벽으로 이루어졌다. 자연과 함께 원시의 삶을 고집하는 마사이 원주민 마을도 함께 자리해 있다.`
	},
	LMK035: {
		info_title: `웨스턴케이프<br>남아프리카공화국`,
		info_text:
			`200킬로미터 밖에서 알아볼 수 있는 테이블마운틴은 예로부터 아프리카의 남단을 항해하는 선원들에게 길잡이 역할을 했다. 오늘날 이 산은 남아프리카공화국에서 가장 유명한 지형이 되었다. 지질학적으로 보자면 테이블마운틴은 약 5억~4억 년 전에 얕은 바다에 형성된 거대한 사암 덩어리다. 거대한 지각운동으로 지표로 융기한 이후 오랜 기간 침식과 풍화를 받아 깎여 나갔는데, 단단한 부분만이 남은 것이 지금의 테이블 마운틴이다. 테이블마운틴은 다양한 식물이 번성하는 곳으로 고스트프로그처럼 그 어디에서도 볼 수 없는 식물이 자생한다. 케이블카가 있어서 정상까지 편하게 올라갈 수 있다.`
	},
	LMK036: {
		info_title: `모론다바(마다가스카르)`,
		info_text:
			`모론다바는 아프리카 동남쪽 마다가스카르의 서해안 모론다바강 삼각주 자락에 위치한 해변도시다. 마다가스카르에서도 바오밥나무 군락지로 유명하여, 바오밥나무를 사랑하는 사람들의 발걸음이 많은 곳이다. 마다가스카르의 상징인 여우원숭이와 더불어, 독특하게 생긴 바오바브나무는 마치 마다가스카르의 상징으로 통한다. 수령이 5,000년에 달한다고 알려진 바오밥나무는 마다가스카르주민들은 신성하게 여긴다. 그 이유는 바오밥나무가 생태계를 유지하는 데 큰 역할을 할 뿐만 아니라 인간 생활에도 다양하게 활용되기 때문이다. 바오밥나무의 꽃잎과 열매 그리고 줄기에 함유된 수분은 조류와 박쥐, 원숭이, 코끼리 등이 생명을 유지하는 데 큰 도움을 준다. 그리고 바오바브나무의 껍질은 마다가스카르 사람들이 지붕, 로프, 바구니 등과 같은 생활 도구를 만드는 재료가 된다. 또한 열매와 잎을 이용하여 식용, 약재, 화장품 등을 만들고, 나무 줄기로는 창고나 방과 같은 생활공간을 만든다.`
	},
	LMK037: {
		info_title: `아프리카 대륙 북부`,
		info_text:
			`사하라사막은 면적은 약 860만㎢로 지구상에서 가장 넓은 사막이다. 나일강에서 대서양 연안에 이르는 동서길이 약 5,600km, 지중해와 아틀라스산맥에서 나이저강(江)·차드호(湖)에 이르는 남북길이 약 1,700km이다. 이 사막 남부의 경계는 명확하게 구분되어 있지 않고, 사막과 사바나 지대 사이에 넓고 건조한 스텝지대가 동서로 펼쳐져 있다. 이 사막지역은 홍해에 접하는 나일강 동쪽의 누비아 사막과 나일강 서쪽의 아하가르산맥 부근까지의 리비아 사막을 합친 동(東)사하라와 아하가르산맥 서쪽의 서(西)사하라로 크게 구별하여 부르기도 한다.`
	},
	LMK038: {
		info_title: `뉴질랜드`,
		info_text:
			`닭 정도의 중간 크기에 날지 못하는 새로 평흉류에 속하는 새 중 가장 크기가 작다. 날지 못하는 이유는 처음엔 날개가 있어 잘 날아다녔으나 천적이 없고 먹이가 풍부해지면서 날기를 포기하면서 자연스럽게 날개가 퇴화되었기 때문이다. 뉴질랜드의 고유종으로 뉴질랜드의 남쪽과 북쪽 섬에 분포해 있다. 뉴질랜드를 상징하는 국조이자 상징으로 동전, 우표, 그 밖에도 중요 생산물의 상표 등에 그려진다. 아열대성의 온화한 기후의 삼림지대, 바다 근처의 황야, 풀숲에 서식한다. 키위새는 갈색키위새, 큰알락키위새, 쇠알락키위새 등의 6종이 있는데, 이들 중 갈색키위새는 가장 일반적이며 널리 분포한다. 1.2~3.9kg 정도의 체중에 체장은 35~55cm 정도이고, 체형이 통통하다. 부리는 유연하며 길게 휘어 있는데 예민하고 촉각이 있다. 부리 끝부분의 양옆으로 콧구멍이 뚫려있다. 야행성 조류인 키위새는 겁이 많아서 낮 동안에는 굴이나 나무사이 틈새 등 보호받을 수 있는 은신처에 단독으로 숨어 산다.`
	},
	LMK039: {
		info_title: `아프리카 남부`,
		info_text:
			`아프리카 남부 잠비아와 짐바브웨의 국경을 가르며 인도양으로 흘러가는 잠베지 강 중류에는 폭 1,676m, 최대 낙차 108m로 세계에서 가장 긴 빅토리아 폭포가 있다. 멀리서는 치솟는 물보라만 보이고 굉음 밖에 들리지 않기 때문에 원주민인 콜로로족은 빅토리아 폭포를 ‘천둥 치는 연기’라는 뜻의 
			‘모시-오아-툰야’라고 불렀다. 
			이 폭포를 발견한 영국의 탐험가 데이비드 리빙스턴(David Livingstone, 1813~1873)은 빅토리아 여왕의 이름을 따 빅토리아 폭포라고 불렀다. 우기에는 많은 양의 폭포수가 있지만 건기에는 폭포수의 양이 적다.`
	},
	LMK040: {
		info_title: `마스빙고(짐바브웨)`,
		info_text:
			`그레이트 짐바브웨 유적(Great Zimbabwe National Monument)은 옛 전설에 따르면 시바의 여왕(Queen of Sheba)의 수도로서, 11~15세기 아프리카의 쇼나족(Shona)이 만든 건축물이다. 왕실의 복합거주지로 추정되는 약 80㏊에 달하는 이 도시유적은 중세기 이래로 중요한 무역중심지로서 명성이 높았다. 그레이트 짐바브웨의 주요 세 지역은 11~15세기 사람들이 거주한 흔적이 많이 남아 있는 언덕 유적(Hill Ruins)와 언덕 아래 남쪽 지역의 거주지인 대구역(Great Enclosure), 계곡 전역에 흩어져 있는 거주 유적인 계곡 유적(Valley Ruins)이다.`
	},
	LMK041: {
		info_title: `몽골`,
		info_text:
			`수천 년 동안 몽골의 유목민은 계절에 따라 풀을 찾아 초원지역을 이동했다. 초원 유목민의 이동식 가옥 형태인 게르(Ger)’는 자유롭게 이동하고 초지에서 목축업을 하는 생활방식 때문에 발명되었다. 게르는 쉽게 분해할 수 있는 벽과 기둥, 캔버스 천과 펠트로 덮은 둥근 지붕을 밧줄로 묶어서 만들었으며, 둥근 구조이다. 게르는 유목민들이 운반하기에 가볍고, 접고 포장하고 조립하기 쉽다. 또 여러 차례 분해하고 조립할 수 있을 정도로 튼튼하며, 내부에서 온도를 쉽게 조절할 수 있도록 설계되었다.`
	},
	LMK042: {
		info_title: `방콕(태국)`,
		info_text:
			`왕궁 동쪽에 있는 인공 언덕(높이 78m) 위에 세워진 사원으로 방콕을 대표하는 관광 명소 가운데 하나이다.  태국 양식을 대표하는 건축물로 황금 빛으로 빛나는 체디 푸 카오 통(Chedi Phu Khao Thong)이 있으며, 라마 3세가 석가모니의 유품을 봉납하기 위해 세웠다고 한다. 그 후 쌓았던 흙이 무너지자 라마 5세가 다양한 공법을 이용해 다시 세워 지금과 같은 모습이 되었다. 원형의 계단을 따라 언덕 정상에 오르면 방콕 시가지를 한눈에 내려다볼 수 있다. 해마다 11월이 되면 춤과 촛불이 어우러진 축제가 열린다.`
	},
};