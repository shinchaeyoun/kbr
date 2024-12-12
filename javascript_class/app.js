// Q1
// function Student (name, age){
//   this.name = name;
//   this.age = age;
//   this.sayHi = function (){
//     console.log('Hi my name is '+ this.name);
//   }
// }

// let student1 = new Student('kim', 20);
// let student2 = new Student('lee',21);
// let student3 = new Student('park', 22);

// student1.sayHi();

// Q2
// function Parent(){
//   this.name = 'kim';
// }
// let a = new Parent();

// a.__proto__.name = 'Park';

// console.log(a.name);

// Q3
// function Student(name, age){
//   this.name = name;
//   this.age = age;
// }

// Student.prototype.sayHi = () => {
//   console.log(this); // ==> window가 출력됨.

//   console.log('hello my name is '+ this.name);
// }
// let student1 = new Student('Kim', 20);

// student1.sayHi();

// console.log(Student.prototype);

/*
함수 안에서 this 키워드의 뜻은 매번 재정의 된다.
object안에 들어있는 함수 안에 있는 this는 함수를 부른 object가 된다. (object를 부르는 것이 아님)
arrow function의 경우 함수 안에서 this 뜻이 재정의되지 않고 바깥에 있던 this를 사용한다.
*/

// var object = {
//   sayHi : () => {console.log(this);}
// }
// object.sayHi();
/* 해당 코드의 this는 오브젝트를 부르는 것이 아니라 window를 부르는 것. */


// Q4. 모든 array에 적용할 수 있는 함수를 새로 만들기 / 3이라는 값 제거하는 함수
// for문 방식
// Array.prototype.remove3 = function(){
//   for (var i = 0; i < this.length; i++) {
//     if ( this[i] === 3 ) {
//       this.splice(i,1);
//     }
//   }
// };

// var arr = [1,2,3,4];
// arr.remove3();

// console.log(arr); //[1,2,4]

// filter / 안된다
// Array.prototype.remove3 = function(){
//   this.filter((element) => element !== 3);
// };

// var arr = [1,2,3,4];
// arr.remove3();
// console.log(arr);



// ES5방식의 상속기능
// var parent = {
//   name: 'Kim',
//   age: 50
// };
// var child = Object.create(parent);

// console.log(child.name, child.age);
// child.age = 23;
// console.log(child.age);

// grandChild = Object.create(child);
// console.log(grandChild.age,grandChild.name);

// ES6방식의 상속기능
// class Parent {
//   constructor(name){ // 자식이 직접 함수를 가짐
//     this.name = name;
//     this.age = 20;
//   }

//   sayHi(){ // 부모의 프로토타입에 추가되는 함수
//     console.log('hello');
//   }
// };

// var child = new Parent ('kim');
// console.log(child.sayHi);

// Object.getPrototypeOf(child); // 부모의 프로토타입을 출력해줌

// Parent.prototype.sayHello = function(){};

// 객체지향5. class를 복사하는 extends / super
// class Grandparend {
//   constructor(name, name2){
//     this.firstName = name;
//     this.lastName = 'Kim';
//     this.middleName = name2;
//   }
//   sayHi(){
//     console.log('Hi Grandparend');
//   };
// }

// var Grandparend1 = new Grandparend('j');
// console.log(Grandparend1);

// class Father extends Grandparend {
//   constructor(name) {
//     super(name);
//     this.age = 50;
//   }
//   sayHi(){
//     console.log('Hi fater');
//     super.sayHi();
//   };
// }

// let fater1 = new Father('w');
// console.log(fater1);

// fater1.sayHi();


/* getter, setter */
// var person = {
//   name : 'park',
//   age: 30,
//   get nextAge(){ // 데이터 꺼내쓰는 함수에
//     return this.age + 1;
//   },
//   set setAge(age){ // 데이터 변경하는 함수에
//     this.age = parseInt(age);
//   }
// };

// console.log(person.age);
class Person {
  constructor() {
    this.name = 'Park';
    this.age = 20;
  }
  get nextAge() {
    return this.age + 1
  }
  set setAge(age) {
    this.age = age
  }
}

var person1 = new Person();
person1.setAge = 21
console.log(person1.nextAge);
console.log(person1);


// Q1. class 구조 만들기

class Puppy {
  constructor(type, color) {
    this.type = type;
    this.color = color;
  }
}

let puppy1 = new Puppy('말티즈', 'white');
let puppy2 = new Puppy('진돗개', 'brown');

console.log(puppy1);
console.log(puppy2);

class Cat extends Puppy {
  constructor(type, color, age){
    super(type, color)
    this.age = age;
  }
}

let cat1 = new Cat('코숏', 'white', 5);
let cat2 = new Cat('러시안블루', 'brown', 2);

console.log(cat1);
console.log(cat2);

Puppy.prototype.addAge = function(){
  console.log('error');
};

// Puppy.addAge();

