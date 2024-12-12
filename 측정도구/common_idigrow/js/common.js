const USER_VALUE = {
	inputs: {
		text: [],
		choice: [],
		fraction: [],
	},
	answer: '',
	userAnswer: '',
	isCorrect: false,
	message: ''
};
let pageCheckFn;
function hasVerticalScrollBar(el) {
	console.log($('h1').height())
	return document.querySelector(el).scrollHeight > $(el).innerHeight();
}

function isScroll() {
	hasVerticalScrollBar('#ct') ? $('#ct').addClass('is-scroll') : $('#ct').removeClass('is-scroll');
}

function qLine(o) {
	"use strict";
	/* 설계 의도
		1. .q-line의 data-answer에 정답을 1-3,2-2,.. 식으로 1(좌측의 index)-3(우측의 index),으로 배열형태로 만들어 사용한다.
		2. 사용자의 값은 1.과 마찬가지의 형태로 input.q-userline 에 value값으로 저장한다.
		3. 정답과 내답은 1.과 2.의 데이터로 재현한다.
	*/
	var o = $('#' + o), // .q-line의 id
		answer = o.data('answer').split(','); // 정답을 배열 형태로

	$('#a-body').children().append(`<span class="sr-only">${o.attr('data-answer')}</span>`)

	var group = {};
	o.find('[data-group]').each(function () {
		group[this.dataset.group] = !group[this.dataset.group] ? 1 : ++group[this.dataset.group];
	});

	var max = Object.keys(group).reduce((key, v) => group[v] < group[key] ? v : key);

	o.data({
		'line': '',
		'max': max
	}); // 현재 선긋기 정보 - 다만 유저데이터와 중복이므로 정리 필요

	var isMulti = o.hasClass('q-line-multi'); // 다중 선긋기의 경우

	// 캔버스 만들고 개별 선긋기 버튼에 번호 부여
	o.addClass('make-end').prepend('<canvas id="canvas' + o.index() + '" class="canvas" width="' + o.width() + '" height="' + o.height() + '"></canvas>')
		.find('.q-line-btn').each(function (i) {
			if (!$(this).attr('data-no')) {
				$(this).attr('data-no', i + 1);
			}
			$(this).attr('data-toggle', 'q-line').append('<button type="button" class="text-hide drawBtn">선택</button>');
		});



	var canvas = document.getElementById(o.find('canvas').attr('id'));
	var ctx = canvas.getContext("2d");
	var btn = o.find('[data-toggle=q-line]'); // 선긋기 버튼
	var sx, sy;
	var ex, ey;
	var drawing;
	var backup;
	var backupClear;
	var startGroup, startLine, endLine;

	// 유저 데이터
	var userAnswers = {};
	var userValIs = o.children('input.q-userline').val();
	var userVal = userValIs ? userValIs.split(',') : [];
	let touchpageX, touchpageY, startBtn, endBtn, isDown, isDblclick;

	ctx.globalCompositeOperation = 'destination-over';

	// 라인을 그리는 함수
	function drawLinePath(sx, sy, ex, ey) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.lineWidth = '4';
		ctx.strokeStyle = '#1A60C9';
		ctx.stroke();
		ctx.closePath();
	}
	// 선그리기
	o.on('mousedown touchstart', function (e) {
		e.preventDefault();
		if (!e.target.className.includes('drawBtn') || !o.hasClass('make-end')) return;
		isDown = true;
		drawing = true;
		o.addClass('drawing');
		var drawBtn = $(e.target);
		startBtn = drawBtn;

		if (drawBtn.closest('.q-line-btn').length) {
			var t = drawBtn.closest('.q-line-btn');
		} else return;

		$('.mark-show-x').removeClass('mark-show-x');

		isDblclick = false;

		if (t.hasClass('line-done') && !isMulti) {
			removeClickLine(t.data('no'));
		}

		t.addClass('line-start');
		startGroup = t.data('group');
		startLine = t.data('no');
		// 버튼의 정중앙을 시작 좌표로 설정
		sx = drawBtn.offset().left - o.offset().left + drawBtn.outerWidth() / 2;
		backup = ctx.getImageData(0, 0, canvas.width, canvas.height);
		sy = drawBtn.offset().top - o.offset().top + drawBtn.outerHeight() / 2;
		backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);
	})
	.on('mousemove touchmove', function (e) {
		e.preventDefault();

		if (isDblclick) {
			return false;
		}

		if (e.touches) {
			e.target = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY);
			touchpageX = e.touches[0].pageX;
			touchpageY = e.touches[0].pageY;
		}

		if (!isDown) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			//console.log(userAnswers);
			redrawLines();
			if (e.touches) o.trigger('touchend');
			else o.trigger('mouseup');

			return false;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		redrawLines();
		let event = e;
		// 마우스를 버튼 부분으로 이동했을 때
		if (e.target.className.includes('drawBtn')) {
			var drawBtn = $(e.target);
			var t = drawBtn.closest('.q-line-btn');
			if (e.touches) e = e.touches[0];
			// 다른 그룹에 있는 버튼일때만 그 버튼의 정중앙으로 위치시킴

			if (startGroup !== t.data('group')) {
				ex = drawBtn.offset().left - o.offset().left + drawBtn.outerWidth() / 2;
				ey = drawBtn.offset().top - o.offset().top + drawBtn.outerHeight() / 2;
			} else {
				if (e.touches) event = e.touches[0];
				ex = event.pageX - o.offset().left;
				ey = event.pageY - o.offset().top;
			}
		} else {
			if (e.touches) event = e.touches[0];
			ex = event.pageX - o.offset().left;
			ey = event.pageY - o.offset().top;
		}
		drawLinePath(sx, sy, ex, ey);
		drawing = false;
		return false;
	})
	.on('mouseup touchend', function (e) {
		e.stopPropagation();
		e.preventDefault();

		if (isDblclick) {
			return false;
		}

		if (e.touches) {
			e.target = document.elementFromPoint(touchpageX, touchpageY);
		}
		isDown = false;
		endBtn = $(e.target);
		let t = $(e.target).closest('.q-line-btn'),
			$start = o.find('.q-line-btn.line-start');
		endLine = t.data('no');
		function init() {
			$('.line-start').removeClass('line-start');
			o.removeClass('drawing no-touch');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			redrawLines();
		}
		if (drawing || !e.target.className.includes('drawBtn') || startGroup === t.data('group') || !t.is('[data-toggle=q-line]') || (t.hasClass('line-done') && !isMulti) || !o.find('.q-line-btn.line-start').length || (t.attr('data-accept') && t.attr('data-accept') != startGroup)) {
			init();
			return;
		}
		let newAD = startLine + '-' + endLine;
		if (Number(startGroup) > Number(t.data('group'))) {
			newAD = endLine + '-' + startLine;
		}
		if (o.data('line').indexOf(newAD) > -1 || (startGroup && startGroup === t.attr('data-group'))) {
			// 선긋기 실패
			$('.line-start').removeClass('line-start');
		} else {
			showBtn();
			// 선긋기 성공
			if (o.data('line') === '') {
				o.data('line', newAD);
			} else {
				o.data('line', o.data('line') + ',' + newAD);
			}

			// 개별 정답 여부 표시
			if (answer.indexOf(newAD) > -1) {
				t.addClass('line-passed');
				$start.addClass('line-passed');
			} else {
				t.addClass('line-failed');
				$start.addClass('line-failed');
			}

			$('.line-start').removeClass('line-start').addClass('line-done on');

			t.addClass('line-done on');

			$('.line-done.on').on('animationend', function (e) {
				$(this).removeClass('on');
			});

			backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);
			userVal.push(newAD);
			o.children('input.q-userline').val(userVal);
			userAnswers[newAD] = [sx, sy, ex, ey];

			USER_VALUE.inputs = userAnswers;
			USER_VALUE.userAnswer = userVal.join(',');
		}
		drawing = false;
		o.removeClass('drawing no-touch');
	})
	.on('dblclick', function (e) {
		e.preventDefault();
		var drawBtn = $(e.target);
		isDblclick = true;

		if (drawBtn.closest('.q-line-btn').length) {
			var t = drawBtn.closest('.q-line-btn');
		} else return;

		removeClickLine(t.data('no'));
	});

	// 선긋기 다시하기
	$('#btn-re').on('click', function () {
		$('.q-line').each(function () {
			$('.line-done').removeClass('line-done');
			$('.q-line-btn').removeClass('line-passed line-failed');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.lineWidth = '2'
			ctx.strokeStyle = '#1A60C9';
			backup = '';
			backupClear = '';
			o.find('input.q-userline').val('');
			userVal = [];
			userAnswers = {};
			o.data('line', '');
		});
	});
	// 모두 보기
	$('#btn-line-all').click(function () {
		$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		redrawLines();
		drawAnswerPath('N');
	});
	// 정답만 보기
	$('#btn-line-answer').click(function () {
		$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		drawAnswerPath();
	});
	// 내답만 보기
	$('#btn-line-my').click(function () {
		$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		redrawLines();
	});
	// 정답그리기
	function drawAnswerPath(clear) {
		if (clear != 'N') {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
		};
		for (var i = 0; i < answer.length; i++) {
			var aD = answer[i];
			var aO = o.find('[data-no=' + aD.split('-')[0] + ']').children('button');
			var aO2 = o.find('[data-no=' + aD.split('-')[1] + ']').children('button');
			var aX = aO.offset().left - o.offset().left + 8;
			var aY = aO.offset().top - o.offset().top + 8;
			var aX2 = aO2.offset().left - o.offset().left + aO2.outerWidth() - 8;
			var aY2 = aO2.offset().top - o.offset().top + 8;
			ctx.beginPath();
			ctx.moveTo(aX, aY);
			ctx.lineTo(aX2, aY2);
			ctx.lineWidth = '24'
			ctx.strokeStyle = '#FFDDDB';
			ctx.lineCap = "round";
			ctx.stroke();
			ctx.closePath();
		}
	}
	// 클릭한 곳의 라인을 지움
	function removeClickLine(answer) {
		answer += '';
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		var i = 0;
		for (var i = 0; i < userAnswers.length; i++) {
			if (userAnswers[i].isVisible) {
				drawLinePath(userAnswers[i]);
			}
		}
		for (var variable in userAnswers) {
			if (variable.split('-')[0] === answer || variable.split('-')[1] === answer) {
				var vbtn = variable.split('-');
				vbtn.forEach(function (item, i) {
					o.find('[data-no="' + item + '"]').removeClass('line-done line-passed line-failed');
				});
				delete userAnswers[variable];
				userVal.splice(i, 1);
			} else {
				var arr = userAnswers[variable];
				drawLinePath(arr[0], arr[1], arr[2], arr[3]);
			}
			i++;
		}

		o.data('line', userVal.join(','));
		o.children('input.q-userline').val(userVal.join(','));
	}
	// 사용자 라인 그리기
	function redrawLines() {
		for (var key in userAnswers) {
			drawLinePath(...userAnswers[key]);
		}
	}
}

function showBtn() {
	if (USER_VALUE.CONTENT_TYPE !== 'scan') {
		$('#ft-c').addClass('show');
	}
}

function hideBtn() {
	$('#ft-c').removeClass('show');
}

function checkAllValue() {
	var num = $('#q-body').find('input').length;
	$('#q-body').find('input').each(function () {
		!this.value.replace(/\s|　/gi, '') && num--;
	});

	return num;
}

jQuery(function ($) {
	'use strict';

	const $ct = document.querySelector('#ct');

	$ct.style.setProperty('--scroll', $ct.offsetWidth - $ct.clientWidth - 2 + 'px');
	$ct.style.overflowY = 'auto';

	isScroll();

	$ct.classList.add('init');


	if ($('#wrap').hasClass('level-test')) {
		$('#wrap').attr('data-chance', 1);
	}

	const inputWidth = ['w70', 'w90'];
	$('#q-body input[type=text]:not(.drop-obj):not(.sr-only').each(function () {
		var wordLength = this.dataset.answer.length;
		var wid = isNaN(this.dataset.answer) ? 45 : 35;

		if (this.dataset.answer.includes('@')) {
			wordLength = this.dataset.answer.split('@')[0].length;
			wid = isNaN(this.dataset.answer.split('@')[0] * 1) ? 45 : 35;
		}

		this.maxLength = Math.ceil(wordLength * 1.5);

		wordLength < 3 ? this.classList.add(inputWidth[wordLength - 1]) : (this.style.width = `${wid * wordLength}px`);
	});

	$('input[type=text]').on('keyup change', function () {
		this.classList.remove('incorrect');
		this.value.replace(/\s|　/gi, '') && showBtn();
		!checkAllValue() && hideBtn();
	});


	$('.fraction-auto').each(function () {
		var ftext = $(this).text();
		var f_arr = ftext.split('/');
		var write_text = "<span>" + f_arr[0] + "</span><br/><span>" + f_arr[1] + "</span>"
		$(this).html(write_text);
	});
	//----- 레이아웃 -----//
	// function ctr(txt) {
	// 	var ctr = document.querySelector('#wrap').dataset.ctr || '';
	// 	return ctr.indexOf(txt) > -1;
	// }

	const $ctr = $('#ctr');
	let $ctrZone;
	const makeCtr = {
		init: function(){
			$ctr.append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr"></i>연습장</button>');
			$('#wrap').append('<div id="ctr-zone"><span class="sr-only">선생님의 도움을 받아 문제를 해결해 보세요.</span></div>');

			$ctrZone = $('#ctr-zone');
		},
		b: function(){ // 필기인식
			$ctr.append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr2"></i>필기인식</button>');
		},
		c: function(){ // 삼각자
			$ctr.append('<button type="button" class="btn-ctr" data-tool="3"><i class="icon icon-btn-ctr3"></i>삼각자</button>');

			var html = `<div id="ctr3" class="ctr-drag hidden">
				<div class="moveable">
					<img src="../../common_idigrow/img/triangle_ruler.svg" alt="삼각자">
					<button type="button" class="icon icon-revers" title="삼각자">뒤집기</button>
					<button type="button" class="icon icon-tool-x" title="삼각자">닫기</button>
				</div>
			</div>`

			$ctrZone.append(html);
		},
		d: function(){ // 각도기
			$ctr.append('<button type="button" class="btn-ctr" data-tool="4"><i class="icon icon-btn-ctr4"></i>각도기</button>');

			var html = `<div id="ctr4" class="ctr-drag hidden">
				<div class="moveable">
					<img src="../../common_idigrow/img/protractor.svg" alt="각도기">
					<button type="button" class="icon icon-tool-x" title="각도기">닫기</button>
				</div>
			</div>`

			$ctrZone.append(html);
		},
		e: function(){ // 자
			$ctr.append('<button type="button" class="btn-ctr" data-tool="6"><i class="icon icon-btn-ctr6"></i>자</button>');

			var cm = $('#wrap').attr('data-e') || 15;

			var html = `<div id="ctr6" class="ctr-drag hidden">
				<div class="moveable">
					<div id="ruler" role="img" aria-label="자" data-cm="${cm}"></div>
					<button type="button" class="icon icon-tool-x" title="자">닫기</button>
				</div>
			</div>`

			$ctrZone.append(html);
		},
		f: function(){ // 컴퍼스
			$ctr.append('<button type="button" class="btn-ctr" data-tool="7"><i class="icon icon-btn-ctr7"></i>컴퍼스</button>');

			var html = `<canvas id="ctr7-canvas" width="1656" height="650"></canvas>
			<div id="ctr7" class="ctr-drag hidden">
				<div class="compass" role="img" aria-label="컴퍼스">
					<div class="left-leg"></div>
					<div class="right">
						<div class="right-leg">
							<div class="top"></div>
						</div>
						<div class="pencil"></div>
						<div class="dot"></div>
						<button type="button" class="icon compass-draw">원그리기</button>
					</div>
				</div>
				<button type="button" class="icon icon-tool-x" title="컴퍼스">닫기</button>
			</div>`

			$ctrZone.append(html);
		}
	}

	makeCtr.init();

	if(document.querySelector('#wrap').dataset.ctr){
		const ctrArr = document.querySelector('#wrap').dataset.ctr.split(',');
		ctrArr.forEach(type => {
			makeCtr[type]();
		});
	}

	// 푸터버튼 생성
	function layoutFt() {
		$('#ft').append(`
			<div id="ft-l">
				<button type="button" class="icon icon-mn index-toggle">목차보기</button>
			</div>
			<div id="ft-c">
				<button type="button" id="btn-re" class="btn btn-outline">다시 풀기</button>
				<button type="button" id="btn-solve" class="btn btn-primary"><i class="icon icon-chk"></i> 채점하기</button>
				<button type="button" id="btn-next" class="btn btn-primary">다음 문제 <i class="icon icon-arrow"></i></button>
				<button type="button" id="btn-analyze" class="btn btn-primary"><i class="icon icon-srch"></i> 분석하러 가기</button>
				<button type="button" id="btn-skip" class="btn btn-primary">건너 띈 문제</button>
				<button type="button" id="btn-tip" class="btn btn-primary">꿀팁, 얼마나 모았니?</button>
				<button type="button" id="btn-note" class="btn btn-primary">AI 오답노트 문제 풀기</button>
			</div>
			<div id="ft-r">
				<button type="button" id="btn-later" class="btn btn-outline-secondary"><i class="icon icon-pencil"></i> 나중에 풀기</button>
				<button type="button" id="btn-unknown" class="btn btn-outline-secondary">모르겠어요</button>
				<button type="button" id="btn-close" class="btn btn-outline">닫기</button>
			</div>
		`);
	}
	layoutFt();

	// 다지선다
	var maxselect = 0;
	$('input[data-maxselect]').click(function () {
		var c = $('input[data-maxselect]').data('maxselect'),
			arr = [];
		if ($(this).prop('checked')) {
			$(this).attr('data-order', maxselect++);
			if ($('input[data-maxselect]:checked').length > $(this).data('maxselect')) {
				$('input[data-maxselect]:checked').each(function () {
					arr.push($(this).attr('data-order'));
				});
				$('input[data-maxselect][data-order="' + Math.min.apply(null, arr) + '"]').prop('checked', false);
			}
		}
	});

	// 단답무순
	var randomCheck = $('.random-check');
	if (randomCheck.length) {
		var randomAnswerAll = {};
		var randomAnswer = [];
		randomCheck.each(function (idx) {
			$(this).find('[data-answer]').each(function (e) {
				randomAnswer.push(this.dataset.answer.split('@@'));
			});
			randomAnswerAll[idx] = randomAnswer;
			randomAnswer = [];
		});

		for (const key in randomAnswerAll) {
			for (let index = 0; index < randomAnswerAll[key].length; index++) {
				randomAnswerAll[key][index].forEach((ele, i) => {
					randomAnswerAll[key][index][i] = ele.replace(/\s|　/gi, '');
				});
			}
		}
	}

	// 선긋기 함수 실행
	$('.q-line').each(function () {
		qLine($(this).attr('id'));
	});

	// 드래그
	$('.drop-obj:not(.exception)').each(function () {
		$(this).removeClass('drop-obj');
		$(this).after('<div class="drop-obj"></div>');
		$(this).next().addClass(this.classList.value);
		$(this).addClass('sr-only');
	});

	var $dragObj = $('.drag-obj:not(.exception)');
	var $dropObj = $('.drop-obj:not(.exception)');
	var $dragobjWrap = $('.drag-obj-wrap');

	function dragReset() {
		$('.drag-obj').removeClass('dropped dragging');
		$('.drop-obj').empty().removeClass('dropped').prev().val('');
		//$('.drag-obj-wrap').removeClass('dropped');
	}

	$dragObj.on('touchmove', function (event) {
		event.preventDefault();
		event.stopPropagation();
	});

	$dragObj.draggable({
		helper: 'clone',
		scope: 'box',
		revert: true,
		revertDuration: 0,
		start: function () {
			$(this).addClass('dragging');
		},
		stop: function () {
			$(this).removeClass('dragging');
		}
	});

	$dropObj.droppable({
		accept: '.drag-obj',
		scope: 'box',
		drop: function (e, ui) {
			var v = $(ui.draggable).data('value'),
				$e = $(e.target), // 지금 drop 오브젝트
				eV = e.target.value, // 지금 drop 오브젝트 값
				$drag = $(ui.draggable);

			if ($e.prev().val() === v || $e.prev().hasClass('correct')) {
				return false;
			}

			if ($dropObj.find('.drag-obj').length) {
				$dragObj.each(function () {
					if (this.dataset.value === $e.prev().val()) {
						$(this).draggable('option', 'disabled', false);
						return false;
					}
				});

				$e.empty().removeClass('dropped').prev().val('').removeClass('incorrect');
			}


			if ($drag.hasClass('drag-obj-clone')) {
				$drag.parent().removeClass('dropped').prev().val('').removeClass('incorrect');

				$e.append(ui.draggable);
				$drag.css({ top: 0, left: 0 });
			} else {
				var $newDrag = ui.draggable.clone();

				$e.append($newDrag);
				$newDrag.removeClass('dragging ui-draggable ui-draggable-handle ui-draggable-disabled');

				$newDrag.addClass('drag-obj-clone').draggable({
					scope: 'box',
					revert: true,
					revertDuration: 0
				}).on('touchmove', function (event) {
					event.preventDefault();
					event.stopPropagation();
				});

				!ui.draggable[0].classList.contains('drag-multi') && ui.draggable.draggable('option', 'disabled', true);
			}

			var insertVal = $e.hasClass('drop-multi') ? eV + v : v;
			$e.addClass('dropped').prev().val(insertVal)

			$(ui.draggable).parent().addClass('dropped');
			showBtn();
		}
	});

	$dragobjWrap.droppable({
		accept: '.drag-obj-clone',
		scope: 'box',
		drop: function (e, ui) {
			ui.draggable.draggable('option', 'revert', false);
			$(ui.draggable).parent().removeClass('dropped ').prev().val('').removeClass('incorrect');
			$(ui.draggable).remove();
			$(`.drag-obj-wrap .drag-obj[data-value="${$(ui.draggable).data('value')}"]`).draggable('option', 'disabled', false);
		}
	});

	$('.drop-obj').dblclick(function (e) {
		if (this.childElementCount) {
			$(this).children().each(function () {
				$(`.ui-draggable-disabled[data-value="${this.dataset.value}"]`).draggable('option', 'disabled', false);
			});

			$(this).empty().removeClass('dropped').prev().val('');
			!checkAllValue() && hideBtn();
		}
	});

	// 입력값 있을 시
	$('.qlabel input, .list-choice input').on('change', function () {
		let max = this.dataset.maxselect;

		$(`input[name=${this.name}]`).parent().removeClass('incorrect')

		if (!$('input:checked').length) {
			$(`input[name=${this.name}]`).closest('.qlabel').removeClass('off');
			hideBtn();
		} else if (max && $('input:checked').length <= max * 1) {
			$(`input[name=${this.name}]`).closest('.qlabel').removeClass('off');
		}

		if (this.checked) {
			showBtn();
			(this.type === 'radio' || max && $('.qlabel input:checked').length >= max * 1) && $(`input[name=${this.name}]`).closest('.qlabel').not($(this).closest('.qlabel')).addClass('off');
		}
	});

	if($('.draw-line').length){
		$('.draw-line').each(function(){
			paperLine(this);
		});
	}

	// 채점하기
	var solveCount = 1;
	USER_VALUE.answer = $('#a-body').children('correctResponse').text().trim();

	$('#btn-solve').click(function () {
		var isCorrect = true,
			$qLine = $('.q-line'),
			$fraction = $('.fraction-blank'),
			$drawLine = $('.draw-line');

		if (solveCount == 4) {
			return false;
		}

		if ($('#wrap').attr('data-chance') == 1) {
			solveCount = 3;
		}

		if (!$qLine.length && !$drawLine.length) {
			USER_VALUE.inputs = {
				text: [],
				choice: [],
				fraction: [],
			};
			USER_VALUE.userAnswer = '';
		}

		if (randomCheck.length) {
			var answerLength;
			randomCheck.each(function(idx){
				var clone = randomAnswerAll[idx].slice();
				answerLength = $(this).find('[data-answer]').length;

				$(this).find('[data-answer]').each(function (i) {
					for (let index = 0; index < clone.length; index++) {
						let val = $(this).find('.fraction-blank').length ? this.dataset.userlatex : this.value;

						if (clone[index].indexOf(val.replace(/\s|　/gi, '')) < 0) {
							$(this).addClass('incorrect');
						} else {
							$(this).removeClass('incorrect').addClass('correct');
							clone[index] = [];
							answerLength--;
							break;
						}
					}
				});
			});



			isCorrect = !answerLength;
		}

		if ($fraction.length) {// 분수
			var wrongAnswer = isCorrect ? 0 : 1, noAnswer;

			$fraction.each(function () {

				if ($(this).closest('.random-check').length) {
					return false;
				}

				if (!this.dataset.userlatex) {
					noAnswer = true;
					return false;
				} else if (this.dataset.userlatex != this.dataset.answer) {
					wrongAnswer++;
				}

				USER_VALUE.inputs.fraction.push(this.dataset.userlatex);
			});

			if (noAnswer) {
				// alert('모두 작성해주세요.');
				USER_VALUE.isEmpty = true;
				USER_VALUE.message = '모두 작성해주세요.';
				return false;
			} else {
				USER_VALUE.isEmpty = false;
				USER_VALUE.message = '';
			}

			isCorrect = !wrongAnswer;
		} else if ($qLine.length) {// 선긋기
			// 모두 그렸는지 체크
			var max = $qLine.data('max');

			var checkAnswer = $qLine.find(`[data-group=${max}]`).length,
				currentAnswer = $(`.line-done[data-group=${max}]`).length;

			if ($qLine.hasClass('q-line-both')) {
				checkAnswer = $('.q-line-btn').length,
					currentAnswer = $('.q-line-btn.line-done').length;
			}

			if (checkAnswer != currentAnswer) {
				// alert('모든 선을 이어주세요');
				USER_VALUE.isEmpty = true;
				USER_VALUE.message = '모든 선을 이어주세요.';
				return false;
			} else {
				USER_VALUE.isEmpty = false;
				USER_VALUE.message = '';
			}

			$('.line-passed').addClass('pointer-none');


			if (USER_VALUE.userAnswer.split(',').length !== USER_VALUE.answer.split(',').length || $('.line-failed').length) {
				isCorrect = false
				solveCount === 3 && $('#btn-line-all').click();
			} else {
				$('#btn-line-all').click()
			}
		} else if ($drawLine.length) {// 선그리기
			USER_VALUE.isEmpty = false;
			USER_VALUE.message = '';

			$drawLine.each(function(){
				if($(this).data('answer') !== $(this).data('userVal')){
					isCorrect = false;
					solveCount === 3 && $('#btn-line-all').click();
					return false;
				}
			});

			isCorrect && $('#btn-line-all').click();
		} else if ($('#q-body input[type=text]').length) {
			if ($('input[type=text]:not(:placeholder-shown)').length != $('#q-body input[type=text]').length) {
				// alert('모두 작성해주세요.');
				USER_VALUE.isEmpty = true;
				USER_VALUE.message = '모두 작성해주세요.';
				return false;
			} else {
				USER_VALUE.isEmpty = false;
				USER_VALUE.message = '';
			}

			$('#q-body input[type=text]').each(function (i) {
				USER_VALUE.inputs.text.push(this.value.trim());
			});

			var wrongAnswer = isCorrect ? 0 : 1;

			$('#q-body input[type=text]').each(function (i) {
				var val = $(this).val().replace(/\s|　/gi, '');

				if (!$(this).closest('.random-check').length) {
					if (this.dataset.answer.includes('@')) {
						var arr = this.dataset.answer.split('@');
						if (arr.indexOf(val) < 0) {
							$(this).addClass('incorrect');
							wrongAnswer++;
						} else {
							$(this).addClass('correct');
						}
					} else if (val != ($(this).data('answer') + '').replace(/\s|　/gi, '')) {
						$(this).addClass('incorrect');
						wrongAnswer++;
					} else {
						$(this).addClass('correct');
					}
				}
			});

			isCorrect = !wrongAnswer;
		}

		if ($('#q-body input[type=radio]').length || $('#q-body input[type=checkbox]').length) {// 선택형
			var name = [], noAnswer = false;

			$('#q-body input:not([type=text]').each(function () {
				name.indexOf(this.name) === -1 && name.push(this.name);
			});

			name.forEach(ele => {
				if (!$(`input[name=${ele}]:checked`).length) {
					noAnswer = true;
					return false;
				}
			});

			if (noAnswer) {
				// alert('답을 골라주세요.');
				USER_VALUE.isEmpty = true;
				USER_VALUE.message = '답을 골라주세요.';
				return false;
			} else {
				USER_VALUE.isEmpty = false;
				USER_VALUE.message = '';
			}

			var prop = true;

			$('#q-body [data-answer]:not([type=text]').each(function () {
				if (!this.checked) {
					prop = false;
					return false;
				}
			});

			$('#q-body input:checked').each(function () {
				USER_VALUE.inputs.choice.push(this.value);


				if (this.dataset.answer == undefined) {
					$(this).parent().addClass('incorrect');
				} else {
					$(this).parent().addClass('correct');
					$(this).closest('.label-choice').length && $(this).closest('.label-choice').addClass('correct');
				}

				if (prop && this.dataset.answer == undefined) {
					prop = false;
				}
			});



			isCorrect && (isCorrect = prop);
		}

		if(pageCheckFn !== undefined){
			isCorrect = pageCheckFn();
		}

		if (isCorrect) { // 정답
			$('#ct').removeClass('mark-show-x');
			$('#ct').addClass('mark-show is-graded');
			solveCount = 1;
			USER_VALUE.isRight = true
		} else { // 오답
			$('#ct').addClass('mark-show-x');
			switch (solveCount) {
				case 2:
					$('#ct').attr('data-x', 'again');
					break;
				case 3:
					$('#ct').attr('data-x', 'wrong');
					$('#ct').addClass('is-graded');
					break;
				default:
			}
			solveCount++;
			USER_VALUE.isRight = false;
		}

		USER_VALUE.isCorrect = isCorrect;

		if (!$qLine.length && !$drawLine.length) {
			for (var key in USER_VALUE.inputs) {
				USER_VALUE.userAnswer += USER_VALUE.inputs[key].join(',');
			}
		}

		isScroll();

		// console.log(USER_VALUE.inputs);
		console.log(USER_VALUE);

		$ct.scrollTop = $('#q-hd>h1').outerHeight(true) + $('#q-body').outerHeight() + 104;

		if (solveCount != 2) {
			$('.btn-ctr.on').each(function () {
				this.classList.remove('on');
				$(`#ctr${this.dataset.ctr}`).hide();
			});
		}
	});

	// reset
	$('#btn-re').click(function () {
		$('#user-data').remove();
		$('itemBody').show();
		$('#ft-c').removeClass('show')
		$('.qlabel').removeClass('off');
		$('#q-body input').prop('checked', false).removeClass('correct incorrect');
		$('#q-body input[type=text]').val('');

		if ($('#ct').hasClass('is-graded')) {
			solveCount = 1;
			$ct.scrollTop = 0
		}
		$('#ct').removeClass('mark-show mark-show-x is-graded').removeAttr('data-x');

		$('.correct').removeClass('correct');
		$('.incorrect').removeClass('incorrect');
		$('.pointer-none').removeClass('pointer-none');

		if ($('.drag-obj').length) {
			$('.ui-draggable').draggable('option', 'disabled', false);
			dragReset();
		}

		USER_VALUE.inputs = {
			text: [],
			choice: [],
			fraction: []
		};
		USER_VALUE.userAnswer = '';
		isScroll();
	});

	$('.bigimg-toggle').click(function () {
		$(this).closest('.bigimg').toggleClass('collapsed');
	});

	// 도구 생성

	const moveable = {}

	$('.moveable').each(function(){
		
		
		const id = $(this).parent().attr('id') ;
		var dataRenderDirections = [ "nw", "ne",  "se", "sw"] ;
		if ( id == 'ctr3' ) dataRenderDirections = ["se", "sw"] ; // 삼각자 컨트롤
		if ( id == 'ctr6' ) dataRenderDirections = ["e"] ; // 자 컨트롤

		moveable[id] = new Moveable(document.body, {
			target: this,
			origin: true,
			draggable: true,
			resizable: true,
			renderDirections: dataRenderDirections,
			rotatable: true,
			keepRatio: true,
			throttleDrag: 1,
			throttleRotate: 0.2,
			throttleResize: 1,
			padding: { left: 8, top: 8, right: 8, bottom: 8 },
			originDraggable: true,
		});

		moveable[id].getControlBoxElement().id = id+'-control';
		
		$(moveable[id].getControlBoxElement()).attr('data-visible', false);

		moveable[id].on("drag", ({ target, left, top, }) => {
			var leftpos = left ,
				toppos = top ;
			var maxLeft = $('#ct').outerWidth() - 210 - $('#'+id).find('.moveable').width()  - 8 ;
			var maxTop = $('#ct').outerHeight() - $('#'+id).find('.moveable').height() - 8 ;

			if ( id == 'ctr4' ) {
				// 각도기 transform 포함 계산
				var lpx = $('#'+id).find('.moveable').width() / 2 ;
				var tpx = $('#'+id).find('.moveable').height()  ;
				maxLeft += lpx;
				maxTop += tpx;
				if (left < 8 + lpx) {  leftpos = 8 + lpx;  } else if (left > maxLeft) { leftpos = maxLeft ; }
				if (top < 8 + tpx) {  toppos = 8 + tpx;  } else if (top > maxTop) { toppos = maxTop ; }
			} else {
				if (left < 8) {  leftpos = 8;  } else if (left > maxLeft) { leftpos = maxLeft ; }
				if (top < 8) {  toppos = 8;  } else if (top > maxTop) { toppos = maxTop ; }
			}
			target.style.left = `${leftpos}px`;
			target.style.top = `${toppos}px`;
		});

		moveable[id].on("resize", ({ target, width, height, delta}) => {
			delta[0] && (target.style.width = `${width}px`);
			if ( id != 'ctr6' ) delta[1] && (target.style.height = `${height}px`);
		});

		moveable[id].on("rotate", ({ target, dist, transform}) => {
			target.style.transform = transform;
		});

		moveable[id].on("dragOrigin", e => {
            e.target.style.transformOrigin = e.transformOrigin;
            e.target.style.transform = e.drag.transform;
        });



		console.log('??', moveable[id]);
	});

	$('.ctr-drag').hide().removeClass('hidden');

	if ($('#ctr7').length ) {
		$('#ctr7').draggable({
			scroll: false ,
			drag: function( ev, ui ) {
				var leftpos = ui.position.left ;
				var toppos = ui.position.top ;
				var maxLeft = 1000 ;
				var maxTop = 185 ;
				if (leftpos < -44) {  leftpos = -44 ;  } else if (leftpos > maxLeft) { leftpos = maxLeft ; }
				if (toppos < -74) {  toppos = -74;  } else if (toppos > maxTop) { toppos = maxTop ; }
				ui.position.left = leftpos;
				ui.position.top = toppos;
			}
		});
	}

	if($('#ruler').length){
		var $ruler = $('#ruler');
		var cmInPx = 644 / $ruler.attr('data-cm');
		var offset = 10;

		for (var i = 0; i <= $ruler.attr('data-cm')*10; i++) {
			var $tick = $('<div></div>').addClass('tick');

			if (i % 10 === 0) {
				$tick.addClass('long');
				var $label = $('<div></div>').addClass('label').text(i / 10);
				$label.css('left', (i * cmInPx / 10 + offset) + 'px');
				$ruler.append($label);
			} else {
				$tick.addClass('short');
			}

			$tick.css('left', (i * cmInPx / 10 + offset) + 'px');
			$ruler.append($tick);
		}
	}

	$(document).on('click', '[data-tool]', function () {
		$(`#ctr${this.dataset.tool}`).toggle();
		$(`#ctr${this.dataset.tool}-control`).attr('data-visible', $(`#ctr${this.dataset.tool}`).is(':visible'));

		$(this).toggleClass('on');

		if(this.dataset.tool == 7){
			$('#ctr7-canvas').toggle();
		}
	});

	$(document).on('click', '.icon-revers', function(){
		var $moveable = $(this).closest('.moveable');
		var moveableObj = moveable[$(this).closest('.ctr-drag').attr('id')],
			rect = moveableObj.getRect();

		if($moveable.hasClass('reverse')){
			$moveable.removeClass('reverse');
			moveableObj.request("originDraggable", { origin: [rect.offsetWidth*100/100, rect.offsetHeight*100/100]}, true);
		}else{
			$moveable.addClass('reverse');
			moveableObj.request("originDraggable", { origin: [0, rect.offsetHeight*100/100] }, true);
		}
		
		moveableObj.updateTarget();
		moveableObj.updateSelectors();
        moveableObj.updateRect();
	});

	$(document).on('click', '.icon-tool-x', function(){
		$(this).closest('.ctr-drag').hide();
		var ctr =  $(this).closest('.ctr-drag').attr('id'),
			ctrno = ctr.charAt(ctr.length - 1); 

		$(`#${$(this).closest('.ctr-drag').attr('id')}-control`).attr('data-visible', false);
		$('[data-tool="'+ctrno+'"]').removeClass('on');

		ctrno == 7 && $('#ctr7-canvas').hide();
	});

	$('.dot').draggable({
		axis: 'x',
		drag: function(e, ui){
			let minX = -63;
			let maxX = 300;
			let left = ui.position.left;
			let xMovement;
			let rotateDegree;


			if (left < minX) {
				ui.position.left = minX;
			}

			if (left > maxX) {
				ui.position.left = maxX;
			}

			// 70% 축소하면서 차이나는 간격 +
			ui.position.top = ui.position.top + 125;

			xMovement = ui.position.left - 37;
			rotateDegree = (xMovement * -0.11)-11;

			$('.right').css({
				'transform': `translateX(${rotateDegree*-12}px)`
			});

			$(this).css({
				'marginLeft': -xMovement
			});

			$('.right-leg').css({
				'transform': `rotate(${rotateDegree}deg)`
			});

			$('.left-leg').css({
				'transform': `rotate(${rotateDegree*-.9}deg)`
			});

			$('.top').css({
				'transform': `rotate(${rotateDegree*-1}deg) translate(${rotateDegree/3.5}px, ${rotateDegree/-2.8}px)`
			});
		}
	});

	if($('#ctr7-canvas').length ){
        var canvas = document.getElementById('ctr7-canvas');
        var ctx = canvas.getContext('2d');
        var point = {
            x: 300,
            y: 0,
            radi: 100
        };
        var currentAngle = 0;
    }

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.arc(point.x, point.y, point.radi, 0, currentAngle, false);
		ctx.lineWidth = '2';
		ctx.stroke();


		currentAngle += 2 * Math.PI / 180;

		if (currentAngle < 2 * Math.PI) {
			requestAnimationFrame(animate);
		}
	}

	$('.compass-draw').on('click', function(){
		var wSpace = ($(window).width()-1655) / 2 ;
		var x = $('#ctr7')[0].offsetLeft + (40 *.7) ;
		var x1 = $('#ctr7')[0].offsetLeft + (40 * 1.7) ;
		var y = $('#ctr7').offset().top + ($('#ctr7').height() * 0.7);
		// var radi = ($('.pencil').offset().left-(($(window).width()-1655)/2)+47) - x;
		var radi2 = ($('.pencil').offset().left - wSpace)  - ( $('#ctr7')[0].offsetLeft + 40 ) + 7   ;

		console.log(radi2 , $('#ctr7')[0].offsetLeft, $('.pencil').offset().left);
		currentAngle = 0;
		point = {
			x: x1,
			y: y,
			radi: radi2
		};
		animate();

		$('.compass').addClass('rotate');
	});

	$('.compass').on('animationend', function(){
		$('.compass').removeClass('rotate')
	});
});

// 시작점 끝점 사이 점 구하기
function findDiagonalPoints(x1, y1, x2, y2) {
	if (x1 > x2) {
		[x1, y1, x2, y2] = [x2, y2, x1, y1];
	}

	const diagonalPoints = [];
	diagonalPoints.push(`${x1}-${y1}`); 

	// 시작점과 끝점이 수직한 경우
	if (x1 === x2) {
		const step = Math.sign(y2 - y1);
		for (let y = y1 + step; y !== y2; y += step) {
			diagonalPoints.push(`${x1}-${y}`);
		}
	} else { // 대각선인 경우
		const slope = (y2 - y1) / (x2 - x1);
		for (let x = x1 + 1; x <= x2; x++) {
			const y = y1 + slope * (x - x1);
			if (Number.isInteger(y)) { 
				diagonalPoints.push(`${x}-${y}`);
			}
		}
	}

	const lastPoint = `${x2}-${y2}`;
	if (diagonalPoints[diagonalPoints.length - 1] !== lastPoint) {
		diagonalPoints.push(lastPoint);
	}

	return diagonalPoints;
}

function paperLine(ele){
	var o = $(ele);

	o.addClass('make-end').prepend('<canvas id="canvas' + o.index() + '" class="canvas" width="' + o.outerWidth() + '" height="' + o.outerHeight() + '"></canvas>');

    const buttonSize = 50; 
    const gridSize = 6;
    const spacing = (o.outerWidth() - (gridSize * buttonSize)) / (gridSize - 1);

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const button = document.createElement('button');
            button.classList.add('button');
            button.style.left = `${col * (buttonSize + spacing)}px`;
            button.style.top = `${row * (buttonSize + spacing)}px`;
			button.dataset.pos = `${col+1},${row+1}`
            o.append(button);
        }
    }

	var correctAnswer = [];
	var pointArr = o.data('point').split(',');

	pointArr.forEach(ele => {
		var arr = `${o.find('.button').eq(ele.split('-')[0]-1).data('pos')},${o.find('.button').eq(ele.split('-')[1]-1).data('pos')}`.split(',');

		findDiagonalPoints(arr[0]*1,arr[1]*1,arr[2]*1,arr[3]*1).forEach(function(ele){
			correctAnswer.indexOf(ele) == -1 && correctAnswer.push(ele);
		});
	});

	o.attr('data-answer', correctAnswer.sort().join(','));
	$('#a-body').children('correctResponse').append(`<div class="sr-only">${correctAnswer.sort().join(',')}</div>`);

	// 정답그리기
	function drawAnswerPath(clear) {
		if (clear != 'N') {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
		};
		for (var i = 0; i < pointArr.length; i++) {
			var aD = pointArr[i];
			var aO = o.find('.button').eq(aD.split('-')[0]-1);
			var aO2 = o.find('.button').eq(aD.split('-')[1]-1);
			var aX = aO.offset().left - o.offset().left + 25;
			var aY = aO.offset().top - o.offset().top + 25;
			var aX2 = aO2.offset().left - o.offset().left + aO2.outerWidth() - 25;
			var aY2 = aO2.offset().top - o.offset().top + 25;
			ctx.beginPath();
			ctx.moveTo(aX, aY);
			ctx.lineTo(aX2, aY2);
			ctx.lineWidth = '6'
			ctx.strokeStyle = '#FF0000';
			ctx.lineCap = "round";
			ctx.stroke();
			ctx.closePath();
		}
	}

	var canvas = document.getElementById(o.find('canvas').attr('id'));
	var ctx = canvas.getContext("2d");
	var sx, sy, ex, ey, drawing, backup, backupClear, touchpageX, touchpageY, startBtn, endBtn, isDown;
	var userAnswers = [];
	var userVal = [];

	function drawLinePath(sx, sy, ex, ey) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.lineWidth = '2';
		ctx.strokeStyle = '#000';
		ctx.stroke();
		ctx.closePath();
	}

	// 사용자 라인 그리기
	function redrawLines() {
		userAnswers.forEach(pos => {
			drawLinePath(...pos);
		});
	}

	o.on('mousedown touchstart', function (e) {
		e.preventDefault();
		if (!e.target.className.includes('button') || !o.hasClass('make-end')) return;
		isDown = true;
		drawing = true;
		o.addClass('drawing');
		var drawBtn = $(e.target);
		startBtn = drawBtn;

		// 버튼의 정중앙을 시작 좌표로 설정
		sx = drawBtn.offset().left - o.offset().left + drawBtn.outerWidth() / 2;
		backup = ctx.getImageData(0, 0, canvas.width, canvas.height);
		sy = drawBtn.offset().top - o.offset().top + drawBtn.outerHeight() / 2;
		backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);
	})
	.on('mousemove touchmove', function (e) {
		e.preventDefault();

		if (e.touches) {
			e.target = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY);
			touchpageX = e.touches[0].pageX;
			touchpageY = e.touches[0].pageY;
		}

		if (!isDown) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			redrawLines();
			if (e.touches) o.trigger('touchend');
			else o.trigger('mouseup');

			return false;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		redrawLines();
		let event = e;

		// 마우스를 버튼 부분으로 이동했을 때
		if (e.target.className.includes('button')) {
			var drawBtn = $(e.target);
			endBtn = drawBtn;
			if (e.touches) e = e.touches[0];

			ex = drawBtn.offset().left - o.offset().left + drawBtn.outerWidth() / 2;
			ey = drawBtn.offset().top - o.offset().top + drawBtn.outerHeight() / 2;

		} else {
			if (e.touches) event = e.touches[0];
			ex = event.pageX - o.offset().left;
			ey = event.pageY - o.offset().top;
		}

		drawLinePath(sx, sy, ex, ey);
		drawing = false;
		return false;
	})
	.on('mouseup touchend', function (e) {
		e.stopPropagation();
		e.preventDefault();

		if (e.touches) {
			e.target = document.elementFromPoint(touchpageX, touchpageY);
		}
		isDown = false;

		function init() {
			o.removeClass('drawing no-touch');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			redrawLines();
		}

		if (drawing || !e.target.className.includes('button') || startBtn.data('pos') ==  endBtn.data('pos')) {
			init();
			return;
		}

		showBtn();
		userAnswers.push([sx, sy, ex, ey]);
		
		var start = startBtn.data('pos').split(',');
		var end = endBtn.data('pos').split(',');

		backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);

		findDiagonalPoints(start[0]*1,start[1]*1,end[0]*1,end[1]*1).forEach(function(ele){
			userVal.indexOf(ele) == -1 && userVal.push(ele);
		});


		USER_VALUE.inputs = userAnswers;
		USER_VALUE.userAnswer = userVal.sort().join(',');

		drawing = false;
		o.removeClass('drawing no-touch');
		o.data('userVal', userVal.sort().join(','));
		console.log(USER_VALUE.userAnswer);
	});

	$('#btn-re').on('click', function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		userAnswers = [];
		userVal = [];
		o.data('userVal', '');
	});


	// 모두 보기
	$('#btn-line-all').click(function () {
		$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		drawAnswerPath('N');
		redrawLines();
	});
	// 정답만 보기
	$('#btn-line-answer').click(function () {
		$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		drawAnswerPath();
	});
	// 내답만 보기
	$('#btn-line-my').click(function () {
		$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		redrawLines();
	});
}


