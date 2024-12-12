jQuery(function($){
	'use strict';

    $('.fraction-auto').each(function(){
        var ftext = $(this).text();
        var f_arr = ftext.split('/');
        var write_text = "<span>"+f_arr[0]+"</span><br/><span>"+f_arr[1]+"</span>"
        $(this).html(write_text);
    });
	//----- 레이아웃 -----//
	// 좌상단 버튼 영역
	function layoutCtr(a,b,c,d,e,f){
		// 연습장 버튼
		if(a){
			$('#ctr').append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr"></i>연습장</button>');
		}
		// 단문 열기 버튼
		if(b){
			$('#ctr').append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr2"></i>단문필기</button>');
		}
		// 장문필기
		if(f){
			$('#ctr').append('<button type="button" class="btn-ctr"><i class="icon icon-btn-ctr5"></i>장문필기</button>');
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
	layoutCtr(true,true,true,true,true,true);
	// 푸터 버튼 영역
	function layoutFt(){
		$('#ft').append(`
			<div id="ft-l">
				<button type="button" class="icon icon-mn index-toggle">목차보기</button>
			</div>
			<div id="ft-c">
				<button type="button" id="btn-re" class="btn btn-outline">다시 풀기</button>
				<button type="button" id="btn-solve" class="btn btn-primary"><i class="icon icon-chk"></i> 채점 하기</button>
				<button type="button" id="btn-next" class="btn btn-primary">다음 문제 <i class="icon icon-arrow"></i></button>
				<button type="button" id="btn-analyze" class="btn btn-primary"><i class="icon icon-srch"></i> 분석하러 가기</button>
				<button type="button" id="btn-skip" class="btn btn-primary">건너 띈 문제</button>
				<button type="button" id="btn-idontkonw" class="btn btn-primary">모르겠어요!</button>
				<button type="button" id="btn-tip" class="btn btn-primary">꿀팁, 얼마나 모았니?</button>
				<button type="button" id="btn-note" class="btn btn-primary">AI 오답노트 문제 풀기</button>
			</div>
			<div id="ft-r">
				<button type="button" id="btn-later" class="btn btn-outline-secondary"><i class="icon icon-pencil"></i> 나중에 풀기</button>
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
			$(this).find('[data-answer]').each(function(){
				randomAnswer.push(this.dataset.answer+''.replace(/\s|　/gi, ''));
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
				currentAnswer = $('.line-done').length;
			}

			console.log(checkAnswer, currentAnswer)

			if(checkAnswer!=currentAnswer){
				alert('모든 선을 이어주세요');
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
				alert('모두 작성해주세요.');
				return false;
			}

			if(randomCheck.length){
				randomCheck.find('[data-answer]').each(function(){
					if(randomAnswer.indexOf(this.value.replace(/\s|　/gi, '')) < 0){
						$(this).addClass('incorrect');
						isCorrect = false;
					}else{
						$(this).addClass('correct');
					}
				});
			}else{ // 단답형
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
					}else if(val!=$(this).data('answer')+''.replace(/\s|　/gi, '')){
						$(this).addClass('incorrect');
						wrongAnswer++;
					} else {
						$(this).addClass('correct');
					}

					isCorrect = !wrongAnswer;
				});
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
				alert('답을 골라주세요.');
				return false;
			}
		}



		if(isCorrect){ // 정답
			$('#ct').addClass('mark-show');
			solveCount=1;
		}else{ // 오답
			$('#ct').addClass('mark-show-x');
			switch (solveCount) {
				case 2:
					$('#ct').attr('data-x', 'again');
					break;
				case 3:
					$('#ct').attr('data-x', 'wrong');
					break;
				default:
			}
			solveCount++;
		}
	});

	// reset
	$('#btn-re').click(function(){
		$('.qlabel').removeClass('off');
		$('#q-body input').prop('checked',false).val('').removeClass('correct incorrect');
		if($('#ct').attr('data-x') == 'wrong'){
			solveCount = 1;
		}
		$('#ct').removeClass('mark-show mark-show-x').removeAttr('data-x');
		$('.drag-obj').length && $('.drag-obj').draggable('option', 'disabled', false);
	});

	$('.qlabel input').on('change', function(){
		$(`input[name=${this.name}]`).closest('.qlabel').removeClass('off');

		if(this.checked){
			$(`input[name=${this.name}]`).closest('.qlabel').not($(this).closest('.qlabel')).addClass('off');
		}
	});

	// 드래그
	var $dragObj = $('.drag-obj');
	var $dropObj = $('.drop-obj');
	function dragReset(){
		$dragObj.removeClass('dropped dragging');
		$dropObj.empty();
		$('.drag-obj-wrap').removeClass('dropped');
	}
	$dragObj.on('touchmove',function(event){
		event.preventDefault();
		event.stopPropagation();
	});
	$dragObj.draggable({
		helper: 'clone',
		scope: 'box',
		start: function(){
			$(this).addClass('dragging');
		},
		stop: function(){
			$(this).removeClass('dragging');
		}
	});
	$dropObj.droppable({
		accept: '.drag-obj',
		scope: 'box',
		drop: function(e, ui){
			if($dropObj.find('.drag-obj').length){
				dragReset();
			}
			var v = $(ui.draggable[0]).data('value'),
				$e = $(e.target), // 지금 drop 오브젝트
				$other = $e.closest('#q-body').find('.drop-obj').not($e), // 다른 drop 오브젝트
				eV = e.target.value, // 지금 drop 오브젝트 값
				otherV;

			if(!ui.draggable[0].classList.contains('drag-multi')){
				ui.draggable.draggable('option', 'disabled', true);
				if($e.val()){
					$dragObj.each(function(){
						if(this.dataset.value === $e.val()){
							$(this).draggable('option', 'disabled', false);
							return false;
						}
					});
				}
			}

			var insertVal = $e.hasClass('drop-multi') ? eV+v : v;

			$e.val(insertVal).addClass('dropped');

			$(ui.draggable).parent().addClass('dropped');
		}
    });

	// 선긋기 함수 실행
	$('.q-line').each(function(){
		qLine($(this).attr('id'));
	});

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
	o.addClass('make-end').prepend('<canvas id="canvas'+o.index()+'" class="canvas" width="'+o.width()+'" height="'+o.height()+'"></canvas>')
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
		sx = drawBtn.offset().left-o.offset().left + drawBtn.outerWidth() / 2;
		backup = ctx.getImageData(0, 0, canvas.width, canvas.height);
		sy = drawBtn.offset().top-o.offset().top + drawBtn.outerHeight() / 2;
		backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
				ex = event.pageX-o.offset().left;
				ey = event.pageY-o.offset().top;
			}
		} else {
			if (e.touches) event = e.touches[0];
			ex = event.pageX-o.offset().left;
			ey = event.pageY-o.offset().top;
		}
		drawLinePath(sx, sy, ex, ey,'#1A60C9');
		drawing = false;
		return false;
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
			$start = o.find('[class*=line-start]');
		endLine = t.data('no');
		function init(){
			$start.removeClass('line-start');
			o.removeClass('drawing no-touch');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			redrawLines();
		}
		if(drawing || !e.target.className.includes('drawBtn') || startGroup === t.data('group') || !t.is('[data-toggle=q-line]') || (t.hasClass('line-done') && !isMulti) || !o.find('[class*=line-start]').length || (t.attr('data-accept') && t.attr('data-accept') != startGroup)) {
			init();
			return;
		}
		let newAD = startLine + '-' + endLine;
		if(Number(startGroup) > Number(t.data('group'))){
			newAD =endLine+'-'+startLine;
		}
		if(o.data('line').indexOf(newAD)>-1 || (startGroup && startGroup===t.attr('data-group'))){
			// 선긋기 실패
			$start.removeClass('line-start');
		} else {
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
			$start.addClass('line-done').removeClass('line-start');
			t.addClass('line-done');
			backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);
			userVal.push(newAD);
			o.children('input.q-userline').val(userVal);
			userAnswers[newAD] = [sx, sy, ex, ey];
		}
		drawing = false;
		o.removeClass('drawing no-touch');
	});

	// 다시하기
	$('#btn-re').on('click',function(){
		$('.q-line').each(function(){
			$(this).find('.q-line-btn').removeClass('line-done line-passed line-failed');
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
			ctx.clearRect(0,0,canvas.width,canvas.height)
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

});
