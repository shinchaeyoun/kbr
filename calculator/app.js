$(function(){
  calculator();
});

function calculator() {
  let active = false;
  let item = $('.calculator .grid-container div');
  let display = $('.display p');
  let history = $('.display span');
  let resultText = [];
  let text = '';

  let checkPreNum = false;
  let finish = false;

  item.off().on('click', function () {
    let type = $(this).data('item');
    let num = $(this).text();
    // if (!active) return false;
    type == 'number' ? cal.numberFn(num) : cal.operatorFn($(this).text());
  });

  $('.on').off().on("click", function () {
    active = true;
    display.text(0)
  });
  $('.off').off().on("click", function () {
    active = false;
    cal.reset();
  });
  $('.c').off().on("click", function () {
    cal.delete();
  });
  $('.ac').off().on("click", function () {
    cal.reset();
  });

  let cal = {
    result: 0,
    preNum: 0,
    nextNum: [],
    preSum:0,
    op: null,
    preOp: null,
    setNum: function () {
      text = resultText.join('');
      display.text(text);
    },
    reset: function () {
      resultText = [];
      text = '';
      cal.setNum();
      history.text('');
      finish = false;
    },
    delete: function () {
      resultText.pop();
      cal.setNum();
      history.text('');
    },
    numberFn: function (val) {
      if (finish) cal.reset();
      let num = Number(val);
      resultText.push(num);
      cal.setNum();
    },
    operatorFn: function (op) {
      let lastEle = resultText[resultText.length - 1];
      let prev, next
      cal.op = op;

      if (!checkPreNum) {
        prev = resultText.join('');
        cal.preNum = Number(prev);
        checkPreNum = true
      } else {
        let nextIdx;
        resultText.forEach((item, idx) => {
          if (typeof (item) == 'string') nextIdx = idx;
        });
        next = resultText.slice(nextIdx + 1, resultText.length);
        cal.nextNum = Number(next.join(''));
      };

      if (typeof (lastEle) == 'string') {
        resultText.pop();
      }
      resultText.push(op);

      if (op == '=') {
        checkPreNum = false;
        cal.resultFn();
      }
      cal.setNum();

      cal.preOp = cal.op;
    },
    resultFn: function () {
      switch (cal.preOp) {
        case '+':
          cal.result = cal.preNum + cal.nextNum
          break;
        case '-':
          cal.result = cal.preNum - cal.nextNum
          break;
        case '×':
          cal.result = cal.preNum * cal.nextNum
          break;
        case '÷':
          cal.result = cal.preNum / cal.nextNum
          break;
      };

      let historyText = resultText.filter(i => i !== '=')
      preSum = historyText.join('');
      
      cal.reset();
      history.text(preSum);
      resultText = [cal.result];
      cal.setNum();
      finish = true;
    }
  };
};

