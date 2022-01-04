// 手写new
function _new() {
	const Con = [].shift.call(arguments)
	let obj = Object.create(Con.prototype)
	let res = Con.call(obj, ...arguments)
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
Function.prototype.myBind = function () {
	// 拿到原函数
	var _this = this,
		context = arguments[0],
		args = Array.prototype.slice.call(arguments, 1)
	return function F() {
		// 这里的arguments是返回的函数的入参，例如：test.myBind({name:'zs'},1,22,333)(4,55) 4,55就是arguments
		console.log(_this, context, args, arguments)
		if (this instanceof F) {
			return new _this(...args, ...arguments)
		}
		return _this.apply(
			context,
			args.concat(Array.prototype.slice.call(arguments))
		)
	}
}
function test(a, b, c) {
	console.log(a, b, c)
	return '哈默'
}
function logs() {
	console.log(this.name, this.age)
}
var b = { name: 123, age: 20 }
// logs.myBind(b)()
const boundTest = test.myBind({ name: '哈默' }, 7, 77, 777)
const boundResult = boundTest(8, 88)
const result = test(1, 10, 100)
console.log('result', result)
console.log('boundResult', boundResult)
