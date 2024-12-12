function hasVerticalScrollBar(el) {
	return document.querySelector(el).scrollHeight > $(el).innerHeight();
}

function isScroll(){
	hasVerticalScrollBar('#ct') ? $('#ct').addClass('is-scroll') : $('#ct').removeClass('is-scroll');
}

function qLine(o){
	"use strict";
	/* 설계 의도
		1. .q-line의 data-answer에 정답을 1-3,2-2,.. 식으로 1(좌측의 index)-3(우측의 index),으로 배열형태로 만들어 사용한다.
		2. 사용자의 값은 1.과 마찬가지의 형태로 input.q-userline 에 value값으로 저장한다.
		3. 정답과 내답은 1.과 2.의 데이터로 재현한다.
	*/
	var o = $('#'+o), // .q-line의 id
		answer = $('.q-line').data('answer').split(','); // 정답을 배열 형태로


	var group = {};
	o.find('[data-group]').each(function(){
		group[this.dataset.group] = !group[this.dataset.group] ? 1 : ++group[this.dataset.group];
	});
	var max = Math.min.apply(null, Object.keys(group).map(function (key) {
		return key;
	}));

	o.data({
		'line': '',
		'max' : max
	}); // 현재 선긋기 정보 - 다만 유저데이터와 중복이므로 정리 필요

	var isMulti = o.hasClass('q-line-multi'); // 다중 선긋기의 경우

	// 캔버스 만들고 개별 선긋기 버튼에 번호 부여
	o.addClass('make-end').prepend('<canvas id="canvas'+o.index()+'" class="canvas" width="'+o.width()+'" height="'+o.height()+'" style="max-width: 100%"></canvas>')
	.find('.q-line-btn').each(function(i){
		if(!$(this).attr('data-no')){
			$(this).attr('data-no',i+1);
		}
		$(this).attr('data-toggle','q-line').append('<button type="button" class="text-hide drawBtn">선택</button>');
	});
	var canvas = document.getElementById(o.find('canvas').attr('id'));
	var ctx = canvas.getContext("2d");
	var btn = o.find('[data-toggle=q-line]'); // 선긋기 버튼
	var sx, sy;
	var ex, ey;
	var drawing;
	var backup;
	var backupClear;
	var startGroup,startLine,endLine;
	var zoom = 1, zoomReverse = 1;

	// 유저 데이터
	var userAnswers = {};
	var userValIs = o.children('input.q-userline').val();
	var userVal = userValIs ? userValIs.split(',') : [];
	let touchpageX, touchpageY, startBtn, endBtn, isDown;

	ctx.globalCompositeOperation='destination-over';

	// 라인을 그리는 함수
	function drawLinePath(sx,sy,ex,ey,color){
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.lineWidth = '4';
		ctx.strokeStyle = color ? color : '#1A60C9';
		ctx.stroke();
		ctx.closePath();
	}
	// 선그리기
	o.on('mousedown touchstart', function(e) {
		e.preventDefault();
		if (!e.target.className.includes('drawBtn') || !o.hasClass('make-end')) return;
		isDown = true;
		drawing = true;
		o.addClass('drawing');
		let t;
		var drawBtn = $(e.target);
		startBtn = drawBtn;
		if (drawBtn.closest('.q-line-btn').length) {
			t = drawBtn.closest('.q-line-btn');
		} else return;

		if(t.hasClass('line-done') && !isMulti){
			removeClickLine(t.data('no'));
		}
		t.addClass('line-start');
		startGroup = t.data('group');
		startLine = t.data('no');
		// 버튼의 정중앙을 시작 좌표로 설정
		sx = (drawBtn.offset().left-o.offset().left + drawBtn.outerWidth() / 2);
		backup = ctx.getImageData(0, 0, canvas.width, canvas.height);
		sy = (drawBtn.offset().top-o.offset().top + drawBtn.outerHeight() / 2);
		backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);

		zoom = $('html').css('zoom');
		zoomReverse = 1 / zoom;
	})
	.on('mousemove touchmove', function(e) {
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
		if (e.target.className.includes('drawBtn')) {
			var drawBtn = $(e.target);
			var t = drawBtn.closest('.q-line-btn');
			if (e.touches) e = e.touches[0];
			// 다른 그룹에 있는 버튼일때만 그 버튼의 정중앙으로 위치시킴

			if (startGroup !== t.data('group')) {
				ex = drawBtn.offset().left-o.offset().left + drawBtn.outerWidth() / 2;
				ey = drawBtn.offset().top-o.offset().top + drawBtn.outerHeight() / 2;
			} else {
				if (e.touches) event = e.touches[0];
				ex = event.pageX*zoomReverse-o.offset().left;
				ey = event.pageY*zoomReverse-o.offset().top;
			}
		} else {
			if (e.touches) event = e.touches[0];
			ex = event.pageX*zoomReverse-o.offset().left;
			ey = event.pageY*zoomReverse-o.offset().top;
		}
		if(sx && sy && ex && ey) {
			drawLinePath(sx, sy, ex, ey, '#1A60C9');
			drawing = false;
			return false;
		}
	})
	.on('mouseup touchend',function(e){
		e.stopPropagation();
		e.preventDefault();
		if(e.touches){
			e.target = document.elementFromPoint(touchpageX, touchpageY);
		}
		isDown = false;
		endBtn = $(e.target);
		let t = $(e.target).closest('.q-line-btn'),
			$start = o.find('.q-line-btn.line-start');
		endLine = t.data('no');
		function init(){
			$('.line-start').removeClass('line-start');
			o.removeClass('drawing no-touch');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			redrawLines();
		}
		if(drawing || !e.target.className.includes('drawBtn') || startGroup === t.data('group') || !t.is('[data-toggle=q-line]') || (t.hasClass('line-done') && !isMulti) || !o.find('.q-line-btn.line-start').length || (t.attr('data-accept') && t.attr('data-accept') != startGroup)) {
			init();
			return;
		}
		let newAD = startLine + '-' + endLine;
		if(Number(startGroup) > Number(t.data('group'))){
			newAD =endLine+'-'+startLine;
		}
		if(o.data('line').indexOf(newAD)>-1 || (startGroup && startGroup===t.attr('data-group'))){
			// 선긋기 실패
			$('.line-start').removeClass('line-start');
		} else {
			showBtn();
			// 선긋기 성공
			if(o.data('line')==='') {
				o.data('line',newAD);
			} else {
				o.data('line',o.data('line')+','+newAD);
			}

			// 개별 정답 여부 표시
			if(answer.indexOf(newAD)>-1){
				t.addClass('line-passed');
				$start.addClass('line-passed');
			} else {
				t.addClass('line-failed');
				$start.addClass('line-failed');
			}

			$('.line-start').removeClass('line-start').addClass('line-done');

			t.addClass('line-done');

			backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);
			userVal.push(newAD);
			o.children('input.q-userline').val(userVal);
			userAnswers[newAD] = [sx, sy, ex, ey];

      events.trigger('idigrow:useranswers', {returnType: 'line', inputs: userAnswers, isEmpty: false});
		}
		drawing = false;
		o.removeClass('drawing no-touch');
	});

	// 다시하기
	$('#btn-re').on('click',function(){
		$('.q-line').each(function(){
			$('.line-done').removeClass('line-done');
			$('.q-line-btn').removeClass('line-passed line-failed');
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.lineWidth = '2'
			ctx.strokeStyle = '#1A60C9';
			backup='';
			backupClear='';
			o.find('input.q-userline').val('');
			userVal = [];
			userAnswers = {};
			o.data('line','');
		});
	});
	// 모두 보기
	$('#btn-line-all').click(function(){
		$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(var key in userAnswers){
			drawLinePath(...userAnswers[key],'#1A60C9');
		}
		drawAnswerPath('N');
	});
	// 정답만 보기
	$('#btn-line-answer').click(function(){
		$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		drawAnswerPath();
	});
	// 내답만 보기
	$('#btn-line-my').click(function(){
		$(this).addClass('btn-primary').siblings().removeClass('btn-primary');
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(var key in userAnswers){
			drawLinePath(...userAnswers[key],'#1A60C9');
		}
	});
	// 정답그리기
	function drawAnswerPath(clear){
		if(clear!='N'){
			ctx.clearRect(0,0,canvas.width, canvas.height)
		};
		for(var i=0;i<answer.length;i++){
			var aD = answer[i];
			var aO = o.find('[data-no='+aD.split('-')[0]+']').children('button');
			var aO2 = o.find('[data-no='+aD.split('-')[1]+']').children('button');
			var aX = aO.offset().left-o.offset().left+8;
			var aY = aO.offset().top-o.offset().top+8;
			var aX2 = aO2.offset().left-o.offset().left+aO2.outerWidth()-8;
			var aY2 = aO2.offset().top-o.offset().top+8;
			ctx.beginPath();
			ctx.moveTo(aX,aY);
			ctx.lineTo(aX2,aY2);
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
		ctx.clearRect(0,0,canvas.width,canvas.height);
		var i = 0;
		for (var i = 0; i < userAnswers.length; i++) {
			if (userAnswers[i].isVisible) {
				drawLinePath(userAnswers[i]);
			}
		}
		for (var variable in userAnswers) {
			if(variable.split('-')[0] === answer || variable.split('-')[1] === answer){
				var vbtn = variable.split('-');
				vbtn.forEach(function(item, i){
					o.find('[data-no="'+item+'"]').removeClass('line-done line-passed line-failed');
				});
				delete userAnswers[variable];
				userVal.splice(i,1);
			}else{
				var arr = userAnswers[variable];
				drawLinePath(arr[0],arr[1],arr[2],arr[3]);
			}
			i++;
		}
		o.data('line', userVal.join(','));
		o.children('input.q-userline').val(userVal.join(','));
	}
	// 사용자 라인 그리기
	function redrawLines(){
		for (var key in userAnswers) {
			drawLinePath(...userAnswers[key]);
		}
	}
}

function showBtn(){
	$('#ft-c').addClass('show');
}

function hideBtn(){
	$('#ft-c').removeClass('show');
}

function checkAllValue(){
	var num = $('#q-body').find('input').length;
	$('#q-body').find('input').each(function(){
		!this.value.replace(/\s|　/gi, '') && num--;
	});

	return num;
}

jQuery(function($){
	'use strict';

	const $ct = document.querySelector('#ct');

	$ct.style.setProperty('--scroll',$ct.offsetWidth-$ct.clientWidth-1+'px');
	$ct.classList.add('init');
	$ct.style.overflowY = 'auto';

	isScroll();

	const inputWidth = ['w70','w80','w110','w120','w140','w160','w180','w200','w220','w240'];
	$('#q-body input[type=text]:not(.drop-obj):not(.sr-only').each(function(){
		var wordLength = this.dataset.answer.length;
		this.maxLength = Math.ceil(wordLength*1.5);

		wordLength > 10 && (wordLength = 10);

		this.classList.add(inputWidth[wordLength-1]);
	});

	$(document).on('keyup change', 'input[type=text]',function(){
		this.value.replace(/\s|　/gi, '') && showBtn();
		!checkAllValue() && hideBtn();
	});

    $('.fraction-auto').each(function(){
        var ftext = $(this).text();
        var f_arr = ftext.split('/');
        var write_text = "<span>"+f_arr[0]+"</span><br/><span>"+f_arr[1]+"</span>"
        $(this).html(write_text);
    });
	//----- 레이아웃 -----//
	function ctr(txt){
		var ctr = document.querySelector('#wrap').dataset.ctr || '';
		return ctr.indexOf(txt) > -1;
	}

	// 좌상단 버튼 영역
	function layoutCtr(a,b,c,d,e){
		// 연습장 버튼
		if(a){
			$('#ctr').append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr"></i>연습장</button>');
		}
		// 필기인식 버튼
		if(b){
			$('#ctr').append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr2"></i>필기인식</button>');
		}
		// 삼각자 버튼
		if(c){
			$('#ctr').append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr3"></i>삼각자</button>');
		}
		// 각도기 버튼
		if(d){
			$('#ctr').append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr4"></i>각도기</button>');
		}
		// 자
		if(e){
			$('#ctr').append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr6"></i>자</button>');
		}
	}

	layoutCtr(true,ctr('b'),ctr('c'),ctr('d'),ctr('e'))	// 푸터 버튼 영역

	function layoutFt(){
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
				<button type="button" id="btn-tip" class="btn btn-primary">꿀방울, 얼마나 모았니?</button>
				<button type="button" id="btn-note" class="btn btn-primary">AI 오답노트 문제 풀기</button>
			</div>
			<div id="ft-r">
				<button type="button" id="btn-later" class="btn btn-outline-secondary"><i class="icon icon-pencil"></i> 나중에 풀기</button>
				<button type="button" id="btn-unknown" class="btn btn-outline-secondary">모르겠어요</button>
			</div>
		`);
	}
	layoutFt();

	// 다지선다
	var maxselect=0;
	$('input[data-maxselect]').click(function(){
		var c = $('input[data-maxselect]').data('maxselect'),
			arr = [];
		if($(this).prop('checked')){
			$(this).attr('data-order',maxselect++);
			if($('input[data-maxselect]:checked').length > $(this).data('maxselect')){
				$('input[data-maxselect]:checked').each(function(){
					arr.push($(this).attr('data-order'));
				});
				$('input[data-maxselect][data-order="'+Math.min.apply(null, arr)+'"]').prop('checked',false);
			}
		}
	});

	// 단답무순
	var randomCheck = $('.random-check');

	if(randomCheck.length){
		var randomAnswer = [];
		randomCheck.each(function(){
			$(this).find('[data-answer]').each(function(e){
				randomAnswer.push(this.dataset.answer.split('@@'));
			});
		})
	}

	// 채점하기
	var solveCount=1;
	$('#btn-solve').click(function(){
		var isCorrect = true,
			$qLine = $('.q-line');

		if(solveCount==4){
			return false;
		}

		if($qLine.length){// 선긋기
			// 모두 그렸는지 체크
			var max = $qLine.data('max');

			var checkAnswer = $qLine.find(`[data-group=${max}]`).length,
				currentAnswer = $(`.line-done[data-group=${max}]`).length;

			if($qLine.hasClass('q-line-both')){
				checkAnswer = $('.q-line-btn').length,
				currentAnswer = $('.q-line-btn.line-done').length;
			}

			if(checkAnswer!=currentAnswer){
				// alert('모든 선을 이어주세요');
        events.trigger('idigrow:useranswers', {isEmpty: true, message: '모든 선을 이어주세요.'});
				return false;
			}

			if($('.line-failed').length){
				isCorrect = false
				solveCount === 3 && $('#btn-line-all').click();
			}else{
				$('#btn-line-all').click()
			}
		} else if($('#q-body input[type=text]').length){
			if($('input[type=text]:not(:placeholder-shown)').length!=$('#q-body input[type=text]').length){
				// alert('모두 작성해주세요.');
        events.trigger('idigrow:useranswers', {isEmpty: true, message: '모두 작성해주세요.'});
				return false;
			}

			if(randomCheck.length){
				var clone = randomAnswer.slice();

				randomCheck.find('[data-answer]').each(function(){
					for (let index = 0; index < clone.length; index++) {
						if(clone[index].indexOf(this.value.replace(/\s|　/gi, '')) < 0){
							$(this).addClass('incorrect');
							isCorrect = false;
						}else{
							$(this).removeClass('incorrect').addClass('correct');
							clone[index] = [];
							isCorrect = true;
							break;
						}
					}

				});
			} else{ // 단답형
				var wrongAnswer = 0;
				$('#q-body input[type=text]').each(function(i){
					var val = $(this).val().replace(/\s|　/gi, '');
					if(this.dataset.answer.includes('@')){
						var arr = this.dataset.answer.split('@');
						if(arr.indexOf(val) < 0){
							$(this).addClass('incorrect');
							wrongAnswer++;
						}else{
							$(this).addClass('correct');
						}
					}else if(val!=($(this).data('answer')+'').replace(/\s|　/gi, '')){
						$(this).addClass('incorrect');
						wrongAnswer++;
					} else {
						$(this).addClass('correct');
					}

					isCorrect = !wrongAnswer;
				});
			}
		} else if($('#q-body div[data-userlatex]').length){
      var $latex = $('#q-body div[data-userlatex]');
      var answer = $latex.attr('data-answer');
      var userValue = $latex.attr('data-userlatex');
      answer = answer.replace(/[$]/gim, '')
      userValue = userValue.replace(/[$]/gim, '')
      if (answer === userValue) {
        isCorrect = true;
      } else {
        isCorrect = false;
      }
    }

		if($('#q-body input[type=radio]').length || $('#q-body input[type=checkbox]').length) {
			// radio, checkbox
			if($('#q-body input:checked').length){
				var prop = true;

				$('#q-body input').each(function(){
					if(this.dataset.answer == undefined && this.checked || this.dataset.answer=='' && !this.checked){
						prop = false;
						return false;
					}
				});

				isCorrect && (isCorrect = prop);
			} else {
				// alert('답을 골라주세요.');
        events.trigger('idigrow:useranswers', {isEmpty: true, message: '답을 골라주세요.'});
				return false;
			}
		}



		if(isCorrect){ // 정답
			$('#ct').addClass('mark-show is-graded');
			solveCount=1;
		}else{ // 오답
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
		}

		isScroll();

		$ct.scrollTop = $('#q-hd>h1').outerHeight(true) + $('#q-body').outerHeight()+104;
	});

	// reset
	$('#btn-re').click(function(){
		$('#ft-c').removeClass('show')
		$('.qlabel').removeClass('off');
		$('#q-body input').prop('checked',false).val('').removeClass('correct incorrect');
		if($('#ct').hasClass('is-graded')){
			solveCount = 1;
			$ct.scrollTop = 0
		}
		$('#ct').removeClass('mark-show mark-show-x is-graded').removeAttr('data-x');

		if($('.drag-obj').length){
			$('.ui-draggable').draggable('option', 'disabled', false);
			dragReset();
		}

		isScroll();
	});

	$('.qlabel input, .list-choice input').on('change', function(){
		let max =  this.dataset.maxselect;

		if(!$('.qlabel input:checked').length){
			$(`input[name=${this.name}]`).closest('.qlabel').removeClass('off');
			hideBtn();
		}else if(max && $('.qlabel input:checked').length <= max*1){
			$(`input[name=${this.name}]`).closest('.qlabel').removeClass('off');
		}

		if(this.checked){
			showBtn();
			(this.type === 'radio' || max && $('.qlabel input:checked').length >= max*1) && $(`input[name=${this.name}]`).closest('.qlabel').not($(this).closest('.qlabel')).addClass('off');
		}
	});

	$('.drop-obj').each(function(){
		$(this).removeClass('drop-obj');
		$(this).after('<div class="drop-obj"></div>');
		$(this).next().addClass(this.classList.value);
		$(this).addClass('sr-only');
	});

	// 드래그
	var $dragObj = $('.drag-obj');
	var $dropObj = $('.drop-obj');
	var zoom = 1, zoomReverse = 1;

	function dragReset(){
		$dragObj.removeClass('dropped dragging');
		$dropObj.empty().removeClass('dropped');
		$dropObj.prev().val('');
		//$('.drag-obj-wrap').removeClass('dropped');
	}
	$dragObj.on('touchmove',function(event){
		event.preventDefault();
		event.stopPropagation();
	});
	$dragObj.draggable({
		helper: 'clone',
		scope: 'box',
		start: function(evt, ui){
			zoom = $('html').css('zoom');
			zoomReverse = 1 / zoom;

			$(this).addClass('dragging');
		},
		drag: function(evt, ui){
			const factor = (1 / zoom) -1;
			ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor);
			ui.position.left += Math.round((ui.position.left- ui.originalPosition.left) * factor);
		},
		stop: function(){
			$(this).removeClass('dragging');
		}
	});
	$dropObj.droppable({
		accept: '.drag-obj',
		scope: 'box',
		drop: function(e, ui){
			var v = $(ui.draggable[0]).data('value'),
				$e = $(e.target), // 지금 drop 오브젝트
				eV = e.target.value, // 지금 drop 오브젝트 값
				cloneType = $('.drop-obj').length > 1 && !$e.hasClass('drop-multi'),
				$drag = $(ui.draggable);

			if($dropObj.find('.drag-obj').length){
				$dragObj.each(function(){
					if(this.dataset.value === $e.prev().val()){
						$(this).draggable('option', 'disabled', false);
						return false;
					}
				});

				$e.empty().removeClass('dropped').prev().val('');
			}


			if($drag.hasClass('drag-obj-clone')){
				$drag.parent().removeClass('dropped').prev().val('');

				$e.append(ui.draggable);
				$drag.css({top: 0, left: 0});
			}else{
				var $newDrag = ui.draggable.clone();

				$e.append($newDrag);
				$newDrag.removeClass('dragging ui-draggable ui-draggable-handle ui-draggable-disabled');

				if(cloneType){
					$newDrag.addClass('drag-obj-clone').draggable({
						scope: 'box',
						revert: true,
						revertDuration: 0
					}).on('touchmove',function(event){
						event.preventDefault();
						event.stopPropagation();
					});
				}

				!ui.draggable[0].classList.contains('drag-multi') && ui.draggable.draggable('option', 'disabled', true);
			}

			var insertVal = $e.hasClass('drop-multi') ? eV+v : v;
			$e.addClass('dropped').prev().val(insertVal)

			$(ui.draggable).parent().addClass('dropped');
			showBtn();
		}
    });

	var intersect = $.ui.intersect = (function () {
		function isOverAxis(x, reference, size) {
			return (x >= reference) && (x < (reference + size));
		}

		return function (draggable, droppable, toleranceMode, event) {
			if (!droppable.offset) {
				return false;
			}

			var x1 = draggable.offset.left + draggable.position.left - draggable.originalPosition.left + draggable.margins.left,//here is the fix for scaled container
				y1 = draggable.offset.top + draggable.position.top - draggable.originalPosition.top + draggable.margins.top,//here is the fix for scaled container
				x2 = x1 + draggable.helperProportions.width,
				y2 = y1 + draggable.helperProportions.height,
				l = droppable.offset.left,
				t = droppable.offset.top,
				r = l + droppable.proportions().width,
				b = t + droppable.proportions().height;

			switch (toleranceMode) {
				case 'fit':
					return (l <= x1 && x2 <= r && t <= y1 && y2 <= b);
				case 'intersect':
					return (l < x1 + (draggable.helperProportions.width / 2) && // Right Half
						x2 - (draggable.helperProportions.width / 2) < r && // Left Half
						t < y1 + (draggable.helperProportions.height / 2) && // Bottom Half
						y2 - (draggable.helperProportions.height / 2) < b); // Top Half
				case 'pointer':
					return isOverAxis(event.pageY, t, droppable.proportions().height) &&
						isOverAxis(event.pageX, l, droppable.proportions().width);
				case 'touch':
					return (
						(y1 >= t && y1 <= b) || // Top edge touching
						(y2 >= t && y2 <= b) || // Bottom edge touching
						(y1 < t && y2 > b) // Surrounded vertically
					) && (
						(x1 >= l && x1 <= r) || // Left edge touching
						(x2 >= l && x2 <= r) || // Right edge touching
						(x1 < l && x2 > r) // Surrounded horizontally
					);
				default:
					return false;
			}
		};
	})();

	$.ui.ddmanager.drag = function (draggable, event) {
		// If you have a highly dynamic page, you might try this option. It renders positions
		// every time you move the mouse.
		if (draggable.options.refreshPositions) {
			$.ui.ddmanager.prepareOffsets(draggable, event);
		}

		// Run through all droppables and check their positions based on specific tolerance options
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function () {

			if (this.options.disabled || this.greedyChild || !this.visible) {
				return;
			}

			var parentInstance, scope, parent,
				intersects = intersect(draggable, this, this.options.tolerance, event),
				c = !intersects && this.isover ?
					'isout' :
					(intersects && !this.isover ? 'isover' : null);
			if (!c) {
				return;
			}

			if (this.options.greedy) {

				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents(':data(ui-droppable)').filter(function () {
					return $(this).droppable('instance').options.scope === scope;
				});

				if (parent.length) {
					parentInstance = $(parent[0]).droppable('instance');
					parentInstance.greedyChild = (c === 'isover');
				}
			}

			// We just moved into a greedy child
			if (parentInstance && c === 'isover') {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = true;
			this[c === 'isout' ? 'isover' : 'isout'] = false;
			this[c === 'isover' ? '_over' : '_out'].call(this, event);

			// We just moved out of a greedy child
			if (parentInstance && c === 'isout') {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call(parentInstance, event);
			}
		});

	}

	$.ui.ddmanager.drop = function (draggable, event) {
		var dropped = false;

		// Create a copy of the droppables in case the list changes during the drop (#9116)
		$.each(($.ui.ddmanager.droppables[draggable.options.scope] || []).slice(), function () {

			if (!this.options) {
				return;
			}
			if (!this.options.disabled && this.visible &&
				intersect(draggable, this, this.options.tolerance, event)) {
				dropped = this._drop.call(this, event) || dropped;
			}

			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],
				(draggable.currentItem || draggable.element))) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call(this, event);
			}

		});
		return dropped;
	}

	$('.drop-obj').dblclick(function(e){
		if(this.childElementCount){
			$(this).children().each(function(){
				$(`.ui-draggable-disabled[data-value="${this.dataset.value}"]`).draggable('option', 'disabled', false);
			});

			$(this).empty().removeClass('dropped').prev().val('');
			!checkAllValue() && hideBtn();
		}
	});



	// 선긋기 함수 실행
	$('.q-line').each(function(){
		qLine($(this).attr('id'));
	});
});
