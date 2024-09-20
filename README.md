bind 함수 예시는 
Recode_manager class에 있음

- script 태그의 디퍼와 어사인의 차이점, 장단점
- 즉시 실행 함수 사용법, 이유
- bind, applym call 바인딩의 개념
- es5,es6에서의 this의 차이점



<br/>

# 비동기 속성 defer와 async

큰 차이점은 완료 후 즉시 실행 여부
async은 로드 완료 시점에서 HTML 파싱 완료를 기다리지 않고 자바스크립트가 실행된다. 실행되는 js의 크기가 크다면 파싱 작업이 남아있는 부분은 한참동안 화면에서 볼 수 없을 수 도 있다.

그렇기 때문에 async보다 defer 사용이 권장되기도 한다.

## defer
- js 로드가 완료 되어도 html 파싱 완료 (DOM 생성 완료) 후, 자바스크립트가 실행된다.
- script 태그가 여러개 있다면 선언한 순서대로 실행

## async
- js 로드 완료 후, HTML 파싱이 일시 중지되고 javascript 즉시 실행
- script 태그가 여러개 있다면 먼저 로드한 순서대로 실행


<br/>

# 즉시 실행 함수 사용법, 이유

즉시 실행 함수의 기본 형태
```  java
(function (){
    // statements
}) ()
```

함수 표현은 함수를 정의하고 변수에 함수를 저장하고 실행하는 과정을 거친다. 즉시 실행 함수는 함수를 정의하고 바로 실행하여 이러한 과정을 거치지 않는 특징이 있다.
함수를 정의하자마자 바로 호출하는 것을 즉시 실행 함수라고 이해할 수 있다.

## 1. 즉시 실행 함수 사용법

### 기명 즉시 실행 함수
``` java
(function square(x){
    console.log(x*x);
})(2);

(function square(x){
    console.log(x*x);
}(2));
```
괄호의 위치가 다를 뿐 같은 기능의 즉시 실행 함수

### 익명 즉시 실행 함수
``` java
(function (x){
    console.log(x*x);
})(2);

(function(x){
    consol.log(x*x);
}(2));
```

### 변수에 즉시 실행 함수 저장
즉시 실행 함수도 함수이기에 **변수에 즉시 실행 함수 저장이 가능**하다.
``` java
(mySquare = function(x){
    console.log(x*x);
})(2);
mySquare(3);
```
변수에 즉시 실행 함수 저장

함수를 mySquare에 저장하고 이 함수를 바로 실행하게 된다. mySquare는 즉시 실행 함수를 저장하고 잇기 때문에 재호출 가능.

**변수에 즉시 실행 함수의 리턴 값 저장도 가능**하다.
``` java
var mySquare = (function(x){
    return x*x;
})(2);
console.log(mySquare)
```
변수에 즉시실행함수 리턴값 저장

위의 두가지는 형태가 유사하지만 다른 기능이다. 괄호의 위치에 주의가 필요하다.

## 2. 즉시 실행 함수를 사용하는 이유
### 초기화
즈