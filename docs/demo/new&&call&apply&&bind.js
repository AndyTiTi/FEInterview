// 手写new
function _new(context, ...args) {
	let obj = Object.create(context.prototype)
	let res = context.call(obj, ...args)
	return res instanceof Object ? res : obj
}
function Person(name, age) {
	this.name = name
	this.age = age
}
var p = _new(Person, 'zs', 13)
console.log(p)
// 手写call
Function.prototype.myCall = function (context) {
	if (typeof this !== 'function') {
		throw new TypeError('Error')
	}
	context = context || window
	context.fn = this
	let args = Array.prototype.slice.call(arguments, 1)
	let result = context.fn(...args)
	delete context.fn
	return result
}
// 手写apply
Function.prototype.myApply = function (context) {
	if (typeof this !== 'function') {
		throw new TypeError('Error')
	}
	context = context || window
	context.fn = this
	let result
	// 处理参数和 call 有区别
	if (arguments[1]) {
		result = context.fn(...arguments[1])
	} else {
		result = context.fn()
	}
	delete context.fn
	return result
}
// 手写bind es5不要出现es6的语法
// 1. 改变this指向
// 2. 第一个参数是this的值，后面的参数是函数接收的参数
// 3. 返回值不变
Function.prototype.myBind = function (context, ...args) {
	// 拿到原函数
	var _this = this
	return function () {
		return _this.apply(
			context,
			args.concat(Array.prototype.slice.call(arguments))
		)
	}
}
function person(a, b) {
	console.log(this.name, this.age, a, b)
}

var b = { name: 'zs', age: 30 }
var boundResult = person.myBind(b, 'to', 'from')
console.log('boundResult', boundResult())
