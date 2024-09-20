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