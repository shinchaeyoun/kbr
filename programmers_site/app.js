// https://school.programmers.co.kr/learn/courses/30/lessons/181873
// 특정 문자 대문자로 바꾸기
function solution(my_string, alp) {
  let answer = [];

  for (let i = 0; i < my_string.length; i++) {
    my_string[i] == alp ? answer.push(my_string[i].toUpperCase()) : answer.push(my_string[i])
  };

  answer = answer.join('');
  console.log('answer ==', answer);

  return answer;
}

solution('programmers', 'p');
solution('lowercase', 'x');

// https://school.programmers.co.kr/learn/courses/30/lessons/181874
// a 강조하기
function solution_a(str) {
  let answer = [];

  for (let i = 0; i < str.length; i++) {
    str[i] == 'a' ? answer.push(str[i].toUpperCase()) : answer.push(str[i].toLowerCase());
  };

  answer = answer.join('');
  console.log('answer ==', answer);
  return answer;
};

solution_a('abstract algebra');
solution_a('PrOgRaMmErS');

//https://school.programmers.co.kr/learn/courses/30/lessons/181875
// 배열에서 문자열 대소문자 변환하기
function solution_uppercase(arr) {
  let answer = [];
  for (let i = 0; i < arr.length; i++) {
    i % 2 == 1 ? answer.push(arr[i].toUpperCase()) : answer.push(arr[i].toLowerCase());
  }

  console.log(answer);
  return answer;
};

solution_uppercase(["AAA", "BBB", "CCC", "DDD"]);
solution_uppercase(["aBc", "AbC"]);

// 소문자로 바꾸기
function lowerCase(str) {
  let answer = [];
  for (let i = 0; i < str.length; i++) {
    answer.push(str[i].toLowerCase());
  }

  answer = answer.join('');
  console.log(answer);
  return answer;
};

lowerCase('aBcDeFg');
lowerCase('aaa');

// 대문자로 바꾸기
function upperCase(str) {
  let answer = [];
  for (let i = 0; i < str.length; i++) {
    answer.push(str[i].toUpperCase());
  }

  answer = answer.join('');
  console.log(answer);
  return answer;
};

upperCase('aBcDeFg')
upperCase('aaa')

// https://school.programmers.co.kr/learn/courses/30/lessons/181879
// 길이에 따른 연산
function numLength(num) {
  let answer = Number();

  for (let i = 0; i < num.length; i++) {
    if (num.length > 10) {
      answer = answer + num[i];
    } else {
      answer = num[i] * num[i + 1];
      console.log('answer', answer);
    }
  };

  console.log(answer);
};

numLength([3, 4, 5, 2, 5, 4, 6, 7, 3, 7, 2, 2, 1]);
numLength([2, 3, 4, 5]);

// https://school.programmers.co.kr/learn/courses/30/lessons/181882
// 조건에 맞게 수열 변환하기 1
function solution_2(arr) {
  let answer = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= 50) {
      arr[i] % 2 == 0 ? answer.push(arr[i] / 2) : answer.push(arr[i]);
    } else {
      arr[i] % 2 == 1 ? answer.push(arr[i] * 2) : answer.push(arr[i]);
    };
  };

  console.log(answer, 'answer');
  return answer;
};

solution_2([1, 2, 3, 100, 99, 98]);

// https://school.programmers.co.kr/learn/courses/30/lessons/181884
// n보다 커질 때까지 더하기
function solution_3(num, n) {
  let answer = 0;
  for (let i = 0; i < num.length; i++) {
    answer = answer + num[i];

    if (answer > n) {
      console.log('answer', answer);
      return answer;
    };
  };
};
solution_3([34, 5, 71, 29, 100, 34], 123);
solution_3([58, 44, 27, 10, 100], 139);

// https://school.programmers.co.kr/learn/courses/30/lessons/181885
// 할 일 목록
function todoList(list, status) {
  let answer = [];
  for (let i = 0; i < status.length; i++) {
    if (status[i] == false) {
      answer.push(list[i]);
    }
  };

  console.log(answer);
  return answer;
};

let todo_list = ["problemsolving", "practiceguitar", "swim", "studygraph"];
let finished = [true, false, true, false];
todoList(todo_list, finished);

// https://school.programmers.co.kr/learn/courses/30/lessons/181886
// 5명씩
function chunk(names, size) {
  let arr = [];
  let answer = [];

  for (let i = 0; i < names.length; i += size) {
    arr.push(names.slice(i, i + size));
  };
  for (let i = 0; i < arr.length; i++) {
    answer.push(arr[i][0])
  }

  console.log(answer);
  return answer;
};

let names = ["nami", "ahri", "jayce", "garen", "ivern", "vex", "jinx"];
chunk(names, 5);
chunk(names, 3);

// 홀수 vs 짝수
function solution_4(list) {
  let answer,
    odd = 0,
    even = 0;

  for (let i = 1; i < list.length + 1; i++) {
    let num = list[i - 1]

    i % 2 == 1 ? odd = odd + num : even = even + num;
  };

  odd == even || odd > even ? answer = odd : answer = even;

  console.log('answer', answer);
  return answer;
};
solution_4([4, 2, 6, 1, 7, 6]);
solution_4([-1, 2, 5, 6, 3]);

// n개 간격의 요소들
function solution_5(list, n) {
  let arr = [];
  let answer = [];

  for (let i = 0; i < list.length; i += n) {
    arr.push(list.slice(i, i + n));
  };
  for (let i = 0; i < arr.length; i++) {
    answer.push(arr[i][0])
  };

  console.log(answer);
  return answer;
};

solution_5([4, 2, 6, 1, 7, 6], 2);
chunk([4, 2, 6, 1, 7, 6], 2);
chunk([4, 2, 6, 1, 7, 6], 4);

// 순서 바꾸기
function arrSort(arr, n) {
  let answer = [];

  answer = arr.slice(n, arr.length);
  answer.push(...arr.slice(0, n));
  console.log('answer', answer);
  return answer;
};
arrSort([2, 1, 6], 1);
arrSort([5, 2, 1, 7, 5], 3);

// n번째 원소부터
function arrSort2(arr, n) {
  let answer = [];
  answer = arr.slice(n - 1, arr.length);

  console.log(answer);
  return answer;
};
arrSort2([2, 1, 6], 3);
arrSort2([5, 2, 1, 7, 5], 2);

// 첫 번째로 나오는 음수
function solution_6(arr, n) {
  let result = -1;
  if (arr.length < 5 || arr.length > 100) return false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > -10 && arr[i] > 100) return false;

    if (arr[i] < 0) result = i
  };

  console.log('solution_6', result);
  return result;
};

solution_6([12, 4, 15, 46, 38, -2, 15], 1);
solution_6([13, 22, 53, 24, 15, 6], 2);

// 카운트 다운
function countdown(start, end) {
  let limit = 0 <= end <= start <= 50;
  if (!limit) return false;

  let result = [];
  for (let i = start; i >= end; i--) {
    result.push(i);
  };

  console.log('countdown', result);
  return result;
};
countdown(10, 3);

// 문자열 앞의 n글자
function stringN(str, n) {
  if (!isNaN(str)) return false;

  let result = '';
  result = str.slice(0, n);

  console.log('stringN', result);
  return result;
};
stringN('ProgrammerS123', 11);
stringN('He110W0r1d', 5);

// 문자열의 뒤의 n글자
function endN(str, n) {
  let result = '';
  result = str.slice(str.length - n, str.length);
  console.log('endN', result);
  return result;
};
endN('ProgrammerS123', 11);
endN('He110W0r1d', 5);

//글자 이어 붙여 문자열 만들기
function stringArr(my_string, index) {
  let result = [];
  let idx;

  for (let i = 0; i < index.length; i++) {
    idx = index[i]
    result.push(my_string[index[i]]);
  }

  result = result.join('');

  console.log('stringArr', result);
  return result;
};
stringArr('cvsgiorszzzmrpaqpe', [16, 6, 5, 3, 12, 14, 11, 11, 17, 12, 7]);
stringArr("zpiaz", [1, 2, 0, 0, 3]);

// 카운트 업
function countUp(start, end) {
  let result = [];

  for (let i = start; i < end + 1; i++) {
    result.push(i);
  };

  console.log('countUp', result);
  return result;
};

countUp(3, 10);

// 수 조작하기 1
function numControl1(n, str) {
  let num = 0;
  let testArr = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] == 'w') num += 1;
    if (str[i] == 's') num -= 1;
    if (str[i] == 'd') num += 10;
    if (str[i] == 'a') num -= 10;
    console.log('num', num);
    testArr.push(num)
  };

  console.log('numControl1', testArr, num);
  return num;
};
numControl1(0, 'wsdawsdassw');

// 마지막 두 원소
function lastElement(arr) {
  let last1 = arr[arr.length - 1];
  let last2 = arr[arr.length - 2];
  let result;

  if (last1 > last2) {
    result = last1 - last2
  } else {
    result = last1 * 2;
  };

  arr.push(result);
  console.log('lastElement', arr);
  return arr;
};
lastElement([2, 1, 6]);
lastElement([5, 2, 1, 7, 5]);

// 원소들의 곱과 합
function eleMath(list) {
  let sum1 = 1, sum2 = 0;
  for (let i of list) {
    sum1 *= i;
    sum2 += i;
  };

  console.log('eleMath', sum1 > sum2 ** 2 ? 0 : 1);
  return sum1 > sum2 ** 2 ? 0 : 1;
};
eleMath([3, 4, 5, 2, 1]);
eleMath([5, 7, 8, 3]);

// 문자 리스트를 문자열로 변환하기
function textConversion(arr) {
  console.log('textConversion', arr.join(''));
  return arr.join('');
};
textConversion(['a', 'b', 'c']);

// 꼬리 문자열
function stringArr(str, ex) {
  let result = [];
  result.push(...str);
  return result.filter(a => !a.includes(ex)).join('');
};
stringArr(["abc", "def", "ghi"], 'ef');
stringArr(["abc", "bbc", "cbc"], 'c');

function stringArr2(str, ex) {
  str.reduce((acc, cur) => acc + (cur.includes(ex) ? '' : cur), '');
  console.log('stringArr2', str);

};
stringArr2(["abc", "def", "ghi"], 'ef');
stringArr2(["abc", "bbc", "cbc"], 'c');

/* reduce */

// 누적계산
function reduce1() {
  const numbers = [2, 4, 3, 1];
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  console.log('reduce1', sum);
};
reduce1();

// 최소값, 최대값 계산
function reduce2() {
  const numbers = [2, 4, 3, 1];
  const min = numbers.reduce((min, num) => (min < num ? min : num), Number.MAX_VALUE);
  const max = numbers.reduce((max, num) => (max > num ? max : num), Number.MIN_VALUE);
  console.log('reduce2 min', min, max);
};
reduce2();

// 개수 세기
function reduce3() {
  const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
  const fruitsCounts = fruits.reduce((counter, fruit) => {
    if (fruit in counter) {
      counter[fruit]++;
    } else {
      counter[fruit] = 1;
    }

    return counter;
  }, {});

  console.log('fruitsCounts', fruitsCounts);
};
reduce3();

// 배열 평탄화
function reduce4(){
  const nested = [[1,2], [3,4], [5,6]];
  const flattened = nested.reduce((nums, num) => [...nums, ...num], []);
  console.log(flattened);
};
reduce4();

// 속성 추출
function reduce5 (){
  const users = [
    { name : 'John', age : 20, country: 'US'},
    { name : 'Jane', age : 30, country: 'KR'},
    { name : 'Robin', age : 22, country: 'CA'},
    { name : 'Doe', age : 22, country: 'US'},
    { name : 'Smith', age : 20, country: 'KR'},
  ];

  const distinctCountries = users.reduce((countries, user) => {
    countries.add(user.country);
    return countries;
  }, new Set());

  const minAge = users.reduce((min, user) => {
    const age = user.age;
    return age < min ? age : min;
  }, Number.MAX_VALUE);

  const maxAge = users.reduce((max, user) => {
    const age = user.age;
    return age > max ? age : max;
  }, Number.MIN_VALUE);

  // 원소 분류
  const usersByCountry = users.reduce((users, user) => {
    const country = user.country;
    if (!(country in users)) {
      users[country] = [];
    }
    users[country].push(user);
    return users;
  }, {});

  const usersByAge = users.reduce((users, user) => {
    const age = user.age;
    if(!(age in users)) {
      users[age] = [];
    };
    users[age].push(user);
    return users;
  }, {} /* 타입 명시 */ );

  console.log('distinctCountries ==', distinctCountries);
  console.log('minAge ==', minAge);
  console.log('maxAge ==', maxAge);
  console.log('원소분류 userByCountry', usersByCountry);
  console.log('usersByAge', usersByAge);
};
reduce5();

function reduce6(){

};
reduce6 ();