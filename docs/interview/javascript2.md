---
title: 第二章
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

3. 组合继承[缺点：继承了父类 2 次模板，继承了 1 次父类的原型对象]

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
	// 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
	Child.prototype = Object.create(Parent.prototype)
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

## 获取数组最大值最小值

```js
let arr = [13, 6, 5, 10, 16]
const max = Math.max.apply(Math, arr)
const min = Math.min.apply(Math, arr)
console.log(max)
console.log(min)
```

## 实现 instanceOf ?

```javascript
function myInstanceof(left, right) {
	if (typeof left !== 'object' || left === null) return false
	let proto = Object.getPrototypeOf(left)
	while (true) {
		if (proto === null) return false
		if (proto === right.prototype) return true
		proto = Object.getPrototypeOf(proto)
	}
}
function Toy() {
	this.name = '123'
}
var a = new Toy()
console.log(myInstanceof(a, Toy))
```

## 实现 new

```javascript
function _new(constructor, ...args) {
	if (typeof constructor !== 'function') {
		throw 'constructor must be a function'
	}
	// 1、创建一个空的对象并链接到原型，obj 可以访问构造函数原型中的属性
	let obj = Object.create(constructor.prototype)
	// 2、绑定 this 实现继承，obj 可以访问到构造函数中的属性
	let ret = constructor.call(obj, ...args)
	// 3、优先返回构造函数返回的对象
	return ret instanceof Object ? ret : obj
}
function Person(name, age) {
	this.name = name
	this.age = age
}
var p = _new(Person, 'zs', 13)
console.log(p)
```

## 实现 call

```js
Function.prototype.newCall = function (context, ...args) {
	if (typeof this !== 'function') {
		throw new TypeError('Error')
	}
	var context = context || window
	context.fn = this
	const result = eval('context.fn(...args)')
	delete context.fn
	return result
}

function person(a, b) {
	console.log(this.name, this.age, a, b)
}

var b = { name: 'zs', age: 30 }
person.newCall(b, 'to', 'from')
```

## 实现 apply

```js
Function.prototype.newApply = function (context, args) {
	if (typeof this !== 'function') {
		throw new TypeError('Error')
	}
	var context = context || window
	context.fn = this
	const result = eval('context.fn(...args)')
	delete context.fn
	return result
}

function person(a, b) {
	console.log(this.name, this.age, a, b)
}

var b = { name: 'zs', age: 30 }
person.newApply(b, ['to', 'from'])
```

## 实现 bind

```js
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
```

## 实现深拷贝

> 丐版

```js
function deepClone(target) {
	if (typeof target !== 'object' || target === null) {
		throw new Error('type is invalidate')
	}
	var tar = Array.isArray(target) ? [] : {}
	for (var k in target) {
		if (target.hasOwnProperty(k)) {
			if (typeof target[k] === 'object' && target[k] !== null) {
				tar[k] = deepClone(target[k])
			} else {
				tar[k] = target[k]
			}
		}
	}
	return tar
}
```

> 改进版（改进后递归实现）

通过四点相关的理论告诉你分别应该怎么做?

1. 针对能够遍历对象的不可枚举属性以及 Symbol 类型，我们可以使用 Reflect.ownKeys 方法；

2. 当参数为 Date、RegExp 类型，则直接生成一个新的实例返回；

3. 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性，以及对应的特性，顺便结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链；

4. 利用 WeakMap 类型作为 Hash 表，因为 WeakMap 是弱引用类型，可以有效防止内存泄漏（你可以关注一下 Map 和 weakMap 的关键区别，这里要用 weakMap），作为检测循环引用很有帮助，如果存在循环，则引用直接返回 WeakMap 存储的值。

```js
const isComplexDataType = (obj) =>
	(typeof obj === 'object' || typeof obj === 'function') && obj !== null
const deepClone = function (obj, hash = new WeakMap()) {
	//日期对象直接返回一个新的日期对象
	if (obj.constructor === Date) return new Date(obj)
	//正则对象直接返回一个新的正则对象
	if (obj.constructor === RegExp) return new RegExp(obj)
	//如果循环引用了就用 weakMap 来解决
	if (hash.has(obj)) return hash.get(obj)
	let allDesc = Object.getOwnPropertyDescriptors(obj)
	//遍历传入参数所有键的特性
	let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
	//继承原型链
	hash.set(obj, cloneObj)
	for (let key of Reflect.ownKeys(obj)) {
		cloneObj[key] =
			isComplexDataType(obj[key]) && typeof obj[key] !== 'function'
				? deepClone(obj[key], hash)
				: obj[key]
	}
	return cloneObj
}

// 下面是验证代码
let obj = {
	num: 0,
	str: '',
	boolean: true,
	unf: undefined,
	nul: null,
	obj: { name: '我是一个对象', id: 1 },
	arr: [0, 1, 2],
	func: function () {
		console.log('我是一个函数')
	},
	date: new Date(0),
	reg: new RegExp('/我是一个正则/ig'),
	[Symbol('1')]: 1,
}
Object.defineProperty(obj, 'innumerable', {
	enumerable: false,
	value: '不可枚举属性',
})
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj // 设置loop成循环引用的属性
let cloneObj = deepClone(obj)
cloneObj.arr.push(4)
console.log('obj', obj)
console.log('cloneObj', cloneObj)
```

## 实现 JSON.stringify()

```js
function jsonStringify(data) {
	let type = typeof data

	if (type !== 'object') {
		let result = data
		//data 可能是基础数据类型的情况在这里处理
		if (Number.isNaN(data) || data === Infinity) {
			//NaN 和 Infinity 序列化返回 "null"
			result = 'null'
		} else if (
			type === 'function' ||
			type === 'undefined' ||
			type === 'symbol'
		) {
			// 由于 function 序列化返回 undefined，因此和 undefined、symbol 一起处理
			return undefined
		} else if (type === 'string') {
			result = '"' + data + '"'
		}
		return String(result)
	} else if (type === 'object') {
		if (data === null) {
			return 'null' // 第01讲有讲过 typeof null 为'object'的特殊情况
		} else if (data.toJSON && typeof data.toJSON === 'function') {
			return jsonStringify(data.toJSON())
		} else if (data instanceof Array) {
			let result = []
			//如果是数组，那么数组里面的每一项类型又有可能是多样的
			data.forEach((item, index) => {
				if (
					typeof item === 'undefined' ||
					typeof item === 'function' ||
					typeof item === 'symbol'
				) {
					result[index] = 'null'
				} else {
					result[index] = jsonStringify(item)
				}
			})
			result = '[' + result + ']'
			return result.replace(/'/g, '"')
		} else {
			// 处理普通对象
			let result = []
			Object.keys(data).forEach((item, index) => {
				if (typeof item !== 'symbol') {
					//key 如果是 symbol 对象，忽略
					if (
						data[item] !== undefined &&
						typeof data[item] !== 'function' &&
						typeof data[item] !== 'symbol'
					) {
						//键值如果是 undefined、function、symbol 为属性值，忽略
						result.push(
							'"' + item + '"' + ':' + jsonStringify(data[item])
						)
					}
				}
			})
			return ('{' + result + '}').replace(/'/g, '"')
		}
	}
}
```

手工实现一个 JSON.stringify 方法的基本代码如上面所示，有几个问题需要注意一下：

1. 由于 function 返回 'null'， 并且 typeof function 能直接返回精确的判断，故在整体逻辑处理基础数据类型的时候，会随着 undefined，symbol 直接处理了；

2. 由于 01 讲说过 typeof null 的时候返回'object'，故 null 的判断逻辑整体在处理引用数据类型的逻辑里面；

3. 关于引用数据类型中的数组，由于数组的每一项的数据类型又有很多的可能性，故在处理数组过程中又将 undefined，symbol，function 作为数组其中一项的情况做了特殊处理；

4. 同样在最后处理普通对象的时候，key （键值）也存在和数组一样的问题，故又需要再针对上面这几种情况（undefined，symbol，function）做特殊处理；

5. 最后在处理普通对象过程中，对于循环引用的问题暂未做检测，如果是有循环引用的情况，需要抛出 Error；

6. 根据官方给出的 JSON.stringify 的第二个以及第三个参数的实现，本段模拟实现的代码并未实现，如果有兴趣你可以自己尝试一下。

整体来说这段代码还是比较复杂的，如果在面试过程中让你当场手写，其实整体还是需要考虑很多东西的。当然上面的代码根据每个人的思路不同，你也可以写出自己认为更优的代码，比如你也可以尝试直接使用 switch 语句，来分别针对特殊情况进行处理，整体写出来可能看起来会比上面的写法更清晰一些，这些可以根据自己情况而定。

## 实现 promise 重试函数

> 可以设置时间间隔和次数 function retry(fn, times, delay) {}

```js
function fetchData() {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			reject('server unavailable')
		}, 500)
	})
}

function retry(fn, times, delay) {
	var err = null
	return new Promise(function (resolve, reject) {
		var attempt = function () {
			fn()
				.then(resolve)
				.catch(function (err) {
					if (0 == times) {
						reject(err)
					} else {
						console.log(`Attempt #${times} failed`)
						times--
						setTimeout(function () {
							attempt()
						}, delay)
					}
				})
		}
		attempt()
	})
}
retry(fetchData, 3, 100)
```

## 求最大公共前缀

> 如 ['aaafsd', 'aawwewer', 'aaddfff'] => 'aa'

```js
var longestCommonPrefix = function (strs) {
	if (!strs.length) return ''
	let res = strs[0]
	for (ch of strs) {
		for (let i = 0; i < res.length; i++) {
			if (ch[i] !== res[i]) {
				res = res.slice(0, i)
				break
			}
		}
	}
	return res
}
longestCommonPrefix(['aaafsd', 'aawwewer', 'aaddfff'])
```

## 拼接数组 brick1,brick2&brick3

```js
var arrs = [{ name: 'brick1' }, { name: 'brick2' }, { name: 'brick3' }]
arrs.reduce((a, b, index, array) => {
	if (index === 0) {
		return b.name
	} else if (index === arrs.length - 1) {
		return a + '&' + b.name
	} else {
		return a + ',' + b.name
	}
}, '')
```

## 数组扁平化

```js
// 解一
var arr = [1, [2, [3, 4]]]
function flatten(arr) {
	let result = []
	for (var i = 0; i < arr.length; i++) {
		if (Array.isArray(arr[i])) {
			result = result.concat(flatten(arr[i]))
		} else {
			result.push(arr[i])
		}
	}
	return result
}
// 解二
function flatten(arr) {
	return arr.reduce((pre, cur) => {
		return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
	}, [])
}
// 解三
function flatten(arr) {
	return arr.toString().split(',')
}
// 解四
function flatten(arr) {
	return arr.flat(Infinity)
}
// 解五
function flatten(arr) {
	let str = JSON.stringify(arr)
	str = str.replace(/(\[|\])/g, '')
	return JSON.parse('[' + str + ']')
}
```

## 手写 Promise.all

## 用 ES5 实现私有变量

```js
function Person(name) {
	var _name = name
	this.getName = function () {
		console.log(_name)
	}
}

var p = new Person('bibibi')

console.log(p._name) //undefined
console.log(p.getName()) //bibibi
```

## 实现一个 fill 函数，不能用循环

```js
Array.prototype.myFill = function (val, start = 0, end = this.length) {
	if (start < end) {
		this[start] = val
		this.myFill(val, start + 1, end)
	}
}
```

## 手写：并发只能 10 个

```js
const urls = [
	{ info: 'task1', time: 1000 },
	{ info: 'task2', time: 2000 },
	{ info: 'task3', time: 3000 },
	{ info: 'task4', time: 4000 },
	{ info: 'task5', time: 5000 },
	{ info: 'task6', time: 6000 },
	{ info: 'task7', time: 7000 },
	{ info: 'task8', time: 8000 },
]
function loadImg(url) {
	return new Promise((resolve, reject) => {
		console.log('--- ' + url.info + ' start!')
		setTimeout(() => {
			console.log(url.info + ' OK!')
			resolve()
		}, url.time)
	})
}
// 原生写法
function limitLoad(urls, handler, limit) {
	const sequence = [].concat(urls)
	let promises = []

	promises = sequence.splice(0, limit).map((url, index) => {
		return handler(url).then(() => {
			return index
		})
	})
	let p = Promise.race(promises)
	for (let i = 0; i < sequence.length; i++) {
		p = p.then((res) => {
			promises[res] = handler(sequence[i]).then(() => {
				return res
			})
			return Promise.race(promises)
		})
	}
}

limitLoad(urls, loadImg, 3)

// class写法
class PromiseQueue {
	constructor(options = {}) {
		this.concurrency = options.concurrency || 1
		this.currentCount = 0
		this.pendingList = []
	}

	add(task) {
		this.pendingList.push(task)
		this.run()
	}

	run() {
		if (
			this.pendingList.length === 0 ||
			this.currentCount === this.concurrency
		) {
			return
		}
		const fn = this.pendingList.shift()
		this.currentCount++
		const promise = fn()
		promise
			.then(this.complateOne.bind(this))
			.catch(this.complateOne.bind(this))
	}

	complateOne() {
		this.currentCount--
		this.run()
	}
}

var queue = new PromiseQueue({ concurrency: 3 })
urls.forEach((url) => {
	queue.add(() => loadImg(url))
})
```

## 斐波那契数列 - 利用惰性单例缓存对象进行优化

```js
//惰性单例
let fibonacci = (function () {
	let memory = {} //memory设定为对象
	return function (n) {
		if (memory[n] !== undefined) {
			return memory[n]
		}
		return (memory[n] =
			n === 0 || n === 1 ? n : fibonacci(n - 1) + fibonacci(n - 2))
	}
})()
```
