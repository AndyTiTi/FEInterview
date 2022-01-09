---
title: 第一章
---

## JavaScript 数据类型

值类型(基本类型)：String、Number、Boolean、Null、Undefined、Symbol、BigInt

引用数据类型：Object [ Array、Function、RegExp、Date、Math ]

> 注：Symbol 是 ES6 引入了一种新的原始数据类型，表示独一无二的值。

## Symbol 有用过吗？

## WeakMap 和 Map 的区别？

原生 weakmap 持有对关键对象的“弱”引用。由于这样的原生 weakmap 不阻止垃圾收集，从而最终删除对键对象的引用。“弱”引用还避免了对映射中的值进行垃圾收集。当将键映射到只有在键未被垃圾收集时才有价值的键的信息时，weakmap 是特别有用的构造。

## var、let、const 区别？

-   函数提升优于变量提升，函数提升会将整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
-   var 存在提升，我们能在声明之前使用。let、const 因为存在暂时性死区的原因，不能在声明前使用
-   var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会
-   let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

## arguments 是什么？

arguments 是函数调用时，创建的一个类似的数组但又不是数组的对象，并且它存储的是**实际传递给函数的参数**，并不局限于函数声明的参数列表

```js
function obj() {
	console.log('arguments instanceof Array? ' + (arguments instanceof Array))
	console.log('arguments instanceof Object? ' + (arguments instanceof Object))
	console.log(arguments)
}
//向obj传递参数
obj('monkey', 'love', 24)
// 输出：
{
  "0": "monkey",
  "1": "love",
  "2": 24
}
```

## callee 是什么？

callee 是 arguments 对象的一个成员，它的值为"正被执行的 Function 对象"。

```js
function obj() {
	//利用callee
	console.log(arguments.callee)
}
obj()

// 输出：
function obj() {
	//利用callee
	console.log(arguments.callee)
}
```

## caller 是什么？

caller 是函数对象的一个属性，该属性保存着调用当前函数的函数。如果没有父函数，则为 null。

```js
//child是parent内的函数，并在parent内执行child
function parent() {
	function child() {
		//这里child的父函数就是parent
		console.log(child.caller)
	}
	child()
}
//parent1没有被别人调用
function parent1() {
	//这里parent1没有父函数
	console.log(parent1.caller)
}
//parent2调用了child2
function parent2() {
	child2()
}
function child2() {
	console.log(child2.caller)
}
/*执行
  parent里嵌套了child函数
  parent1没有嵌套函数
  parent2调用了child2，child2不是嵌套在parent2里的函数
*/
parent()
parent1()
parent2()
```

![image](/caller.png)

## 数组遍历的方式有哪些？性能比较？

> 经过工具与手动测试发现，结果基本一致，数组遍历各个方法的速度：传统的 for 循环最快，for-in 最慢

for-len > for > for-of > forEach > map > for-in

> javascript 原生遍历方法的建议用法：
> 用 for 循环遍历数组

用 for...in 遍历对象

用 for...of 遍历类数组对象（ES6）

用 Object.keys()获取对象属性名的集合

> 为何 for… in 会慢？
> 因为 for … in 语法是第一个能够迭代对象键的 JavaScript 语句，循环对象键（{}）与在数组（[]）上进行循环不同，引擎会执行一些额外的工作来跟踪已经迭代的属性。因此不建议使用 for...in 来遍历数组

## a == 1 && a == 2 && a ==3

```js
var a = {
	value: 0,
	valueOf: function () {
		this.value++
		return this.value
	},
}
console.log(a == 1 && a == 2 && a == 3)
```

## 数据类型检测

![typof](/typeof.png)

```js
function getType(obj) {
	let type = typeof obj
	if (type !== 'object') {
		return type
	}
	return Object.prototype.toString
		.call(obj)
		.replace(/^\[object (\S+)\]$/, '$1')
}
```

## 数据处理

某公司 1 到 12 月份的销售额存在一个对象里面 如下：{1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]

```js
let obj = { 1: 222, 2: 123, 5: 888 }
const result = Array.from({ length: 12 }).map(
	(_, index) => obj[index + 1] || null
)
console.log(result)
```

![image](/b4f_b.webp)

## 为什么浏览器要有事件循环机制？

因为 JS 本事是单线程异步非阻塞的，当遇到一些执行耗时长的任务时，会导致主程序阻塞，所以会将一些异步任务放入 eventLoop 进行存放，等待处理结果返回后再根据一定规则去执行相应的回调。
[一次弄懂 Event Loop（彻底解决此类面试问题）](https://juejin.cn/post/6844903764202094606?utm_source=gold_browser_extension)
[详解 JavaScript 中的 Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)

## 为什么要引入微任务的概念？

只有宏任务不可以吗？
宏任务（先进先出的执行原则），遇到紧急任务并不能优先执行，所以需要有微任务的概念。

## Node 和浏览器的事件循环区别？

宏任务的执行顺序：

1. timers 定时器：执行已经安排的 setTimeout 和 setinterval 的回调函数
2. pending callback 待定回调：执行延迟到下一个循环迭代的 I/O 回调
3. idle, prepare：仅系统内部使用。
4. poll：检索新的 I/O 雨件，执行与 I/O 相关的回调
5. check：执行 setlmmediate()回调函数
6. close callbacks： socket.on('close1, () => {})
   微任务和宏任务在 node 的执行顺序：
   Node 及以前：
7. 执行完一个阶段中的所有任务
8. 执行 nextTick 队列里的内容
9. 执行完微任务队列的内容
   Node V10 后：
   和浏览器的行为统一了。

## [] == ![]?

①、根据运算符优先级 ，！ 的优先级是大于 == 的，所以先会执行 ![]
！可将变量转换成 boolean 类型，null、undefined、NaN 以及空字符串('')取反都为 true，其余都为 false。
所以 ! [] 运算后的结果就是 false
也就是 [] == ! [] 相当于 [] == false

②、根据上面提到的规则（如果有一个操作数是布尔值，则在比较相等性之前先将其转换为数值——false 转换为 0，而 true 转换为 1），则需要把 false 转成 0
也就是 [] == ! [] 相当于 [] == false 相当于 [] == 0

③、根据上面提到的规则（如果一个操作数是对象，另一个操作数不是，则调用对象的 valueOf()方法，用得到的基本类型值按照前面的规则进行比较，如果对象没有 valueOf()方法，则调用 toString()）
而对于空数组，[].toString() -> '' (返回的是空字符串)
也就是 [] == 0 相当于 '' == 0

④、根据上面提到的规则（如果一个操作数是字符串，另一个操作数是数值，在比较相等性之前先将字符串转换为数值）
Number('') -> 返回的是 0
相当于 0 == 0 自然就返回 true 了

总结一下：[] == ! [] -> [] == false -> [] == 0 -> '' == 0 -> 0 == 0 -> true

## 冒泡和捕获

```js
;<ul id="ul">
	<li>1</li>
	<li>2</li>
	<li>3</li>
	<li>4</li>
	<li>5</li>
	<li>6</li>
</ul>

const ul = document.querySelector('ul')
ul.addEventListener('click', function (e) {
	const target = e.target
	if (target.tagName.toLowerCase() === 'li') {
		const liList = this.querySelectorAll('li') // 伪数组
		console.log(
			liList,
			typeof liList, // object
			Object.prototype.toString.call(Array.from(liList)) // [object Array]
		)
		const index = Array.prototype.indexOf.call(liList, target)
		alert(`内容为${target.innerHTML},索引为${index}`)
	}
})
```

## 事件监听

一个历史页面，上面有若干按钮的点击逻辑.每个按钮都有自己的 click 事件.

新需求来了：给每一个访问的用户添加了一个属性 banned = true, 此用户点击页面上的任何按钮或者元素，都不可响应原来的函数，而是直接 alert 提示"你被封禁了"

```javascript
window.addEventlistener(
	'click',
	function () {
		if (banned) {
			e.stopPropagation()
			alert('你被封禁了')
		}
	},
	true
)
```

## 节流防抖应用场景？

节流：resize scroll

```javascript

```

防抖：input
