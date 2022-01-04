---
title: 第一章
---

## 查看浏览器的对于 API 的支持

```javascript
// 判断浏览器是否支持某一方法
function isNative(Ctor) {
	return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
console.log(isNative(Proxy)) // true
console.log(isNative(Promise)) // true
console.log(isNative(Map)) // true
console.log(Proxy.toString()) // function Proxy() { [native code] }
console.log(Promise.toString()) // function Promise() { [native code] }
console.log(Map.toString()) // function Map() { [native code] }
```

## Javascript 继承的三种方式

1. 原型继承[即继承了父类的模板，又继承了父类的原型对象属性和方法]

```javascript
function Person(name, age) {
	this.name = name
	this.age = age
}
// 父类的原型对象属性和方法
Person.prototype.id = 10
Person.prototype.getName = function () {
	return this.name
}
function Boy(sex) {
	this.sex = sex
}
// 实现继承，但是参数是在传入了父类构造函数内，应该是将参数传入Boy的构造函数中
Boy.prototype = new Person('z3', 20)

var b = new Boy()
alert(b.name)
alert(b.id)
```

2. 类继承[只继承模板，不继承原型对象上的属性和方法（借用构造函数的方式继承）]

```javascript
function Person(name, age) {
	this.name = name
	this.age = age
}
// 父类的原型对象属性和方法
Person.prototype.id = 10
Person.prototype.getName = function () {
	return this.name
}
function Boy(name, age, sex) {
	// 只是绑定了父类的模板，并未继承父类的原型对象
	Person.call(this, name, age)
	this.sex = sex
}
var b = new Boy()
alert(b.name)
alert(b.id) // undefined
```

3. 混合继承[缺点：继承了父类 2 次模板，继承了 1 次父类的原型对象]

```javascript
function Person(name, age) {
	this.name = name
	this.age = age
}
// 父类的原型对象属性和方法
Person.prototype.id = 10
Person.prototype.getName = function () {
	return this.name
}
function Boy(name, age, sex) {
	// 1 只绑定了父类的模板
	Person.call(this, name, age)
	this.sex = sex
}
// 2 只继承父类的原型对象
Boy.prototype = new Person()
var b = new Boy('k4', 30, 'felman')
alert(b.name)
alert(b.id) // 10
```

4. 最终版 extends[继承 1 次父类模板，继承 1 次父类的原型对象]

**第一种**

```javascript
function extend(Child, Parent) {
	// 创建一个空函数，进行中转父类的原型对象
	var F = new Function()
	F.prototype = Parent.prototype
	Child.prototype = new F()
	Child.prototype.constructor = Child
}
function Person(name, age) {
	this.name = name
	this.age = age
}
// 父类的原型对象属性和方法
Person.prototype.id = 10
Person.prototype.getName = function () {
	return this.name
}
function Boy(name, age, sex) {
	// 只绑定了父类的模板
	Person.call(this, name, age)
	this.sex = sex
}
extend(Boy, Person)
var b = new Boy('k4', 30, 'felman')
alert(b.name)
alert(b.id) // 10


> b.__proto__===Boy.prototype
> true
> b.__proto__.constructor
> ƒ Boy(name, age, sex) {
	// 只绑定了父类的模板
	Person.call(this, name, age)
	this.sex = sex
}
> Boy.prototype.constructor
> ƒ Boy(name, age, sex) {
	// 只绑定了父类的模板
	Person.call(this, name, age)
	this.sex = sex
}
```

**第二种**

```javascript
function Parent(value) {
	this.val = value
}
Parent.prototype.getValue = function () {
	console.log(this.val)
}

function Child(value) {
	Parent.call(this, value)
}
Child.prototype = Object.create(Parent.prototype, {
	constructor: {
		value: Child,
		enumerable: false,
		writable: true,
		configurable: true,
	},
})
```

![image](/imgedu.lagou.jpg)

## 实现 extends ?

```javascript
function Animal() {
	this.type = 'animal'
	this.eat = function () {}
}
function Cat() {
	Animal.call(this)
	this.name = 'cat'
}
function extend(Child, Parent) {
	var F = function () {}
	F.prototype = Parent.prototype
	Child.prototype = new F()
	Child.prototype.constructor = Child
}
// ES6
class Fruit {
	constructor() {}
}
class Apple extends Fruit {
	constructor() {
		super()
	}
}
```

## 实现 new

```javascript
function create() {
	// 1、获得构造函数，同时删除 arguments 中第一个参数
	Con = [].shift.call(arguments)
	// 2、创建一个空的对象并链接到原型，obj 可以访问构造函数原型中的属性
	let obj = Object.create(Con.prototype)
	// 3、绑定 this 实现继承，obj 可以访问到构造函数中的属性
	let ret = Con.apply(obj, arguments)
	// 4、优先返回构造函数返回的对象
	return ret instanceof Object ? ret : obj
}
function Person() {
	this.name = '123'
}
var b = create(Person)
```

## 实现 instanceOf ?

```javascript
function myInstanceof(left, right) {
	let prototype = right.prototype
	left = left.__proto__
	while (true) {
		if (left === null || left === undefined) return false
		if (prototype === left) return true
		left = left.__proto__
	}
}
function Toy() {
	this.name = '123'
}
var a = new Toy()
console.log(myInstanceof(a, Toy))

function Person(name) {
	this.name = name
}
var man = new Person()
man instanceof Person
// true
Person.prototype.isPrototypeOf(man)
// true
```

## 实现 call

```js
Function.prototype.newCall = function (context) {
	console.log(this)
	if (typeof this !== 'function') {
		throw new TypeError('Error')
	}
	context = context || window
	context.fn = this
	const args = [...arguments].slice(1)
	const result = context.fn(...args)
	delete context.fn
	return result
}

function person() {
	console.log(this.name)
}

var b = { name: 'zs' }
person.newCall(b)
```
