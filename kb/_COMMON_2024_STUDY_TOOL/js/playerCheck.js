var playerChk = {
	CODE: {
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
	r_point: 0, //읽기 포인트
	l_point: 0, //듣기 포인트
	w_point: 0, //쓰기 포인트
	s_point: 0, //말하기 포인트
	coin: 0, // 코인
	eval_yn: '', //평가차시여부
	lmk_list: [], //랜드마크 구매 목록
	kb_lmk_list_origin: [],
	kb_lmk_list: {}, //kb_랜드마크 전체 목록(get_yn 보유여부)

	passYn_list: {}, // 단원완료여부
	conts_game_rank_info: [], // 게임 결과 순위정보
	prinla_cd: "EN", // 주요 언어
	trans_lang: "EN", // 번역 언어
	conts_se_cd: 0, // 콘텐츠 학교 급 (1:초등, 2:중등)	
	conts_type: 0, // 콘텐츠 타입 (1:한국어 교재, 2:익힘, 3:평가, 4:게임)
	conts_step: 0, // 콘텐츠 단계(1~4)	
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
		$.ajax({
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

		$.ajax({
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
		});

	},
	sessionCheck: function () {

		if (this.saveYn != "Y") {
			return;
		}

		var _this = this;
		$.ajax({
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

		});
	},

	// API Name : 모듈_완료
	// API Desc : 웹 콘텐츠(모듈) 완료시 진도율 100프로 처리를 하기 위한 함수
	wcontsComplete: function (nextYn) {
		return new Promise((resolve, reject) => {

			if (this.innb == -1) {
				this.response_result.result = this.CODE.RESPONSE_RESULT_TYPE.FAIL;
				this.response_result.code = this.CODE.RESPONSE_CODE_TYPE.E002.name;
				this.response_result.message = "콘텐츠 번호 없음.";
				resolve(this.response_result);
			}

			var _this = this;
			if (_this.saveYn != "Y") {
				_this.next();

				_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCCESS;
				_this.response_result.code = '';
				_this.response_result.message = '';
				resolve(_this.response_result);
			}
			if (nextYn == undefined) nextYn = "Y";

			$.ajax({
				url: "/lms/content/wcontsComplete.do",
				type: 'POST',
				data: { playerId: _this.playerId },
				dataType: "json",
				async: false,
				success: function (data) {
					var message = $.trim(data.message);
					var msgTxt = "";
					if (data.result == "success") {
						var o = $(_this.popPlayerWin.document).find('.selConts.on').parent('p');
						o.find('.st').addClass('sta');
						o.removeClass('ncomp').addClass('comp');
						setTimeout(function () { o.find('.st').removeClass('sta'); }, 700);

						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCCESS;
						_this.response_result.code = '';
						_this.response_result.message = '';

						resolve(_this.response_result);

						if (nextYn != 'N') {
							_this.next()
						}

					} else if (data.result == "fail") {
						var logout = false;
						if (message == 'dup') {
							msgTxt = "학습창이 중복으로 호출되어 해당 학습창은 종료됩니다. 학습정보가 정상적으로 저장되지 않을 수 있습니다.";
						} else if (message != "") {
							msgTxt = message;
							if (msgTxt.indexOf("로그아웃") > -1) {
								logout = true;
							}

						} else {
							msgTxt = "오류가 발생하였습니다.";
						}

						_this.popPlayerWin.close();
						fAlert(msgTxt, 'red', function () {
							_this.loading('off');
							_this.close_fn();
							if (logout) {
								location.href = "/lms/cm/mcom/pmco000b00.do?loginPop=true";
							}
						});
						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.FAIL;
						_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E001.name;
						_this.response_result.message = _this.CODE.RESPONSE_CODE_TYPE.E001.desc;
						resolve(_this.response_result);

					} else {
						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.FAIL;
						_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E001.name;
						_this.response_result.message = _this.CODE.RESPONSE_CODE_TYPE.E001.desc;
						resolve(_this.response_result);
					}

				}, error: function (e) {
					_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.FAIL;
					_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
					_this.response_result.message = e.responseText;
					resolve(_this.response_result);

					_this.popPlayerWin.close();

				}
			});
		});
	},

	// API Name : 이전 콘텐츠 이동
	// API Desc : 이전 콘텐츠 이동하기
	preContent: function () {
		if (this.innb == -1) {
			return;
		}
		var idx = $(this.popPlayerWin.document).find('.selConts').index($(this.popPlayerWin.document).find('.selConts.on'));
		console.log("kdw 플레이어체크  : " + $('.selConts').index($('.selConts.on')) + ";;;" + idx);
		if (idx != 0) {
			var a = $(this.popPlayerWin.document).find('.selConts').eq(idx - 1);
			a.get(0).click();
		}
	},

	// API Name : 모듈_기본정보
	// API Desc : 웹 모듈 실행 시 정보 셋팅값을 전달 하기 위한 함수	 
	getDefaultInfo: function () {
		return new Promise((resolve, reject) => {
			if (this.innb == -1) {
				this.response_result.result = this.CODE.RESPONSE_RESULT_TYPE.FAIL;
				this.response_result.code = this.CODE.RESPONSE_CODE_TYPE.E002.name;
				this.response_result.message = "콘텐츠 번호 없음."

				resolve(this.response_result);
			}

			var _this = this;

			//if(_this.saveYn != 'Y') return;

			$.ajax({
				url: "/lms/gfn/getUserInfo.do",
				type: 'POST',
				async: false,
				data: {
					content_player_gbn: _this.curInfo.playerGbn,
					lesson_innb: _this.curInfo.lesson_innb,
					content_innb: _this.curInfo.content_innb
				},
				dataType: "json",
				success: function (data) {
					var message = $.trim(data.message);
					var msgText = "";
					if (data.result == "fail") {
						if (message != "") {
							msgTxt = message;
						} else {
							msgTxt = "오류가 발생하였습니다.";
						}
						_this.popPlayerWin.close();
						fAlert(msgTxt, 'red', function () {
							_this.loading('off');
							_this.close_fn();
						});

						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.FAIL;
						_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E001.name;
						_this.response_result.message = msgTxt

					} else if (data.result == "success") {
						_this.user_info = data.userInfo;
						_this.r_point = data.userCoin.r_point;
						_this.l_point = data.userCoin.l_point;
						_this.w_point = data.userCoin.w_point;
						_this.s_point = data.userCoin.s_point;
						_this.coin = data.userCoin.coin;
						_this.lmk_list = data.lmkList;

						_this.kb_lmk_list_origin = data.lmkListAll;

						for (i = 0; i < data.lmkListAll.length; i++) {
							_this.kb_lmk_list[data.lmkListAll[i].name] = data.lmkListAll[i];
						}


						data.lmkList.forEach(lmk_cd => {
							_this[lmk_cd] = true;
						})
						_this.prinla_cd = data.prinla_cd;
						_this.mainLangs.forEach(lang => {
							if (lang == _this.prinla_cd) {
								_this.trans_lang = lang;
							}
						});

						_this.conts_se_cd = data.conts_se_cd;
						_this.conts_type = data.conts_type;
						_this.conts_step = data.conts_step;
						_this.conts_unit = data.conts_unit;
						_this.conts_ele = data.conts_ele;

						// 리턴 설정
						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCCESS;
						_this.response_result.code = '';
						_this.response_result.message = '';

					}

					resolve(_this.response_result);

				}, error: function () {
					_this.popPlayerWin.close();

					// 리턴 설정
					_this.response_result.result = 'fail';
					_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
					_this.response_result.message = _this.CODE.RESPONSE_CODE_TYPE.E001.desc;

					resolve(_this.response_result);
				}
			});

		});
	},

	// API Name : 코인_획득
	// API Desc : 코인 획득 함수
	setPoint: function (lanEle, point) {
		return new Promise((resolve, reject) => {

			if (this.innb == -1) {
				this.response_result.result = this.CODE.RESPONSE_RESULT_TYPE.FAIL;
				this.response_result.code = this.CODE.RESPONSE_CODE_TYPE.E002.name;
				this.response_result.message = "콘텐츠 번호 없음.";

				resolve(this.response_result);
			}

			lanEle = lanEle.replace(/ /g, '');
			lanEle = lanEle.split(",");

			var _this = this;

			if (_this.saveYn != 'Y') {
				_this.response_result.result = 'success';
				_this.response_result.code = '';
				_this.response_result.message = '';
				resolve(_this.response_result);
			}

			$.ajax({
				url: "/lms/gfn/addPoint.do",
				contentType: 'application/json',
				data: JSON.stringify({
					"user_info": _this.user_info,
					"lanFnc": lanEle,
					"point": point,
					"contsInnb": _this.curInfo.content_innb,
					"contsType": _this.curInfo.playerGbn,
				}),
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function (data) {
					_this.r_point = data.r_point;
					_this.l_point = data.l_point;
					_this.w_point = data.w_point;
					_this.s_point = data.s_point;
					_this.coin = data.coin;

					// 리턴 설정
					_this.response_result.result = 'success';
					_this.response_result.code = '';
					_this.response_result.message = '';
					resolve(_this.response_result);
				}, error: function (error) {
					//console.log(error.responseText);

					// 리턴 설정
					_this.response_result.result = 'fail';
					_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
					_this.response_result.message = error.responseText;
					resolve(_this.response_result);
				}
			});
		})
	},

	// API Name : 코인_획득2
	// API Desc : 코인 획득 함수2
	setPoint2: function (lanEle, point, qstnNum) {
		if (this.innb == -1) {
			return;
		}

		lanEle = lanEle.replace(/ /g, '');
		lanEle = lanEle.split(",");

		var _this = this;

		if (_this.saveYn != 'Y') return;

		$.ajax({
			url: "/lms/gfn/addPointWithNum.do",
			contentType: 'application/json',
			data: JSON.stringify({
				"user_info": _this.user_info,
				"lanFnc": lanEle,
				"point": point,
				"contsQstnNum": qstnNum,
				"contsInnb": _this.curInfo.content_innb,
				"contsType": _this.curInfo.playerGbn,
			}),
			type: 'POST',
			dataType: 'json',
			async: false,
			success: function (data) {
				_this.r_point = data.r_point;
				_this.l_point = data.l_point;
				_this.w_point = data.w_point;
				_this.s_point = data.s_point;
				_this.coin = data.coin;
			}, error: function (error) {
				console.log(error.responseText);
			}
		});

	}

	,

	// API Name : 코인 환전
	// API Desc : 포인트 코인으로 변경
	changePoint: function () {
		return new Promise((resolve, reject) => {
			if (this.innb == -1) {
				this.response_result.result = this.CODE.RESPONSE_RESULT_TYPE.FAIL;
				this.response_result.code = this.CODE.RESPONSE_CODE_TYPE.E002.name;
				this.response_result.message = "콘텐츠 번호 없음.";

				resolve(this.response_result);
			}

			var _this = this;

			if (_this.saveYn != 'Y') {
				_this.response_result.result = 'success';
				_this.response_result.code = '';
				_this.response_result.message = '';
				resolve(_this.response_result);
			}

			$.ajax({
				url: "/lms/gfn/changePoint.do",
				contentType: 'application/json',
				data: JSON.stringify({
					"user_info": _this.user_info,
				}),
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function (data) {
					if (data.result == "success") {
						_this.response_result.result = 'success';
						_this.response_result.code = '';
						_this.response_result.message = '';

						_this.r_point = data.coin.r_point;
						_this.l_point = data.coin.l_point;
						_this.w_point = data.coin.w_point;
						_this.s_point = data.coin.s_point;
						_this.coin = data.coin.coin;
					} else {
						_this.response_result.result = 'fail';
						_this.response_result.code = this.CODE.RESPONSE_CODE_TYPE.E401.name;
						_this.response_result.message = data.message;
					}

					// 리턴 설정
					resolve(_this.response_result);
				}, error: function (error) {
					// 실패 리턴
					_this.response_result.result = 'fail';
					_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
					_this.response_result.message = error.responseText;
					resolve(_this.response_result);
				}
			});
		});
	},

	// API Name : 랜드마크_구매
	// API Desc : 랜드마크 구매 함수
	buyLmk: function (lmk_cd) {
		return new Promise((resolve, reject) => {

			if (this.innb == -1) {
				this.response_result.result = this.CODE.RESPONSE_RESULT_TYPE.FAIL;
				this.response_result.code = this.CODE.RESPONSE_CODE_TYPE.E002.name;
				this.response_result.message = "콘텐츠 번호 없음.";

				resolve(this.response_result);
			}

			var _this = this;

			if (_this.saveYn != 'Y') {
				_this.response_result.result = 'success';
				_this.response_result.code = '';
				_this.response_result.message = '';
				resolve(_this.response_result);
			}

			$.ajax({
				url: "/lms/gfn/buyLmk.do",
				contentType: 'application/json',
				data: JSON.stringify({
					"user_info": _this.user_info,
					"lmk_cd": lmk_cd
				}),
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function (data) {
					if (data.result == "fail") {

						_this.response_result.result = 'fail';
						_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
						_this.response_result.message = data.message;
						resolve(_this.response_result);
					} else {
						//랜드마크 목록 갱신
						_this.kb_lmk_list_origin = data.lmkListAll;
						for (i = 0; i < data.lmkListAll.length; i++) {
							_this.kb_lmk_list[data.lmkListAll[i].name] = data.lmkListAll[i];
						}

						_this.lmk_list = data.lmk_list;
						data.lmk_list.forEach(lmk_cd => {
							_this[lmk_cd] = true;
						})
						_this.coin = data.coin;

						// 리턴 설정
						_this.response_result.result = 'success';
						_this.response_result.code = '';
						_this.response_result.message = '';
						resolve(_this.response_result);
					}
				}, error: function (error) {
					// 리턴 설정
					_this.response_result.result = 'fail';
					_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
					_this.response_result.message = error.responseText;
					resolve(_this.response_result);
				}
			});
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

			if (this.innb == -1) {
				this.response_result.result = this.CODE.RESPONSE_RESULT_TYPE.FAIL;
				this.response_result.code = this.CODE.RESPONSE_CODE_TYPE.E002.name;
				this.response_result.message = "콘텐츠 번호 없음."
				resolve(this.response_result);
			}

			var _this = this;
			if (_this.saveYn != 'Y') {
				_this.response_result.result = 'success';
				_this.response_result.code = '';
				_this.response_result.message = '';
				resolve(_this.response_result);
			}

			const thisGbn = parseInt(_this.curInfo.playerGbn);
			const arrGbn = [1, 2, 4, 5];
			const paramGbn = arrGbn.includes(thisGbn) ? 'CLAS' : 'LRN';

			if (_this.curInfo)
				$.ajax({
					url: "/lms/gfn/addWordBook.do",
					data: {
						"inputText": input_text,
						"wrd_clsf_cd": wrd_clsf_cd,
						"schlCrsCdNo": _this.conts_se_cd,
						"lesson_innb": _this.curInfo.lesson_innb,
						"conts_innb": _this.curInfo.content_innb,
						"playerGbn": paramGbn,
					},
					type: 'POST',
					dataType: 'json',
					async: false,
					success: function (result) {
						// 리턴 설정
						_this.response_result.result = 'success';
						_this.response_result.code = '';
						_this.response_result.message = '';
						resolve(_this.response_result);
					}, error: function (e) {
						// 리턴 설정
						_this.response_result.result = 'fail';
						_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
						_this.response_result.message = e.responseText;
						resolve(_this.response_result);
					}
				});
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
		return new Promise((resolve, reject) => {
			if (this.innb == -1) {
				this.response_result.result = this.CODE.RESPONSE_RESULT_TYPE.FAIL;
				this.response_result.code = this.CODE.RESPONSE_CODE_TYPE.E002.name;
				this.response_result.message = "콘텐츠 번호 없음.";
				resolve(this.response_result);
			}
			var is_array_qstn_sj_nm = Array.isArray(conts_qstn_sj_nm);
			var is_array_conts_answer = Array.isArray(conts_answer);

			if (is_array_qstn_sj_nm) {
				conts_qstn_sj_nm = conts_qstn_sj_nm.join(", ");
			}
			if (is_array_conts_answer) {
				conts_answer = conts_answer.join(", ");
			}
			var _this = this;

			$.ajax({
				url: "/lms/conts/moduleTry.do",
				contentType: 'application/json',
				data: JSON.stringify({
					"user_info": _this.user_info,
					"lesson_innb": _this.curInfo.lesson_innb,
					"contsQstnSjNm": conts_qstn_sj_nm,
					"contsAnswer": conts_answer,
					"contsModuleType": conts_type,
					"contsActn": conts_actn,
					"contsScore": conts_score,
					"tryCo": try_co,
					"contsInnb": _this.curInfo.content_innb,
					"contsType": _this.curInfo.playerGbn,
					"contsAiScore": conts_ai_score
				}),
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function (data) {
					if (data.result == "success") {
						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCCESS;
						_this.response_result.code = '';
						_this.response_result.message = '';
						resolve(_this.response_result);
					} else if (data.result == "fail") {
						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.FAIL;
						_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E001.name;
						_this.response_result.message = _this.CODE.RESPONSE_CODE_TYPE.E001.desc;
						resolve(_this.response_result);
					}
				}, error: function (e) {
					_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.FAIL;
					_this.response_result.code = _this.CODE.RESPONSE_CODE_TYPE.E900.name;
					_this.response_result.message = e.responseText;
					resolve(_this.response_result);
				}
			});
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

							_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCCESS;
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

						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCCESS;
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
						_this.response_result.result = _this.CODE.RESPONSE_RESULT_TYPE.SUCCESS;
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
