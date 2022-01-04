---
title: 第一章
---

## JavaScript 数据类型

值类型(基本类型)：字符串（String）、数字(Number)、布尔(Boolean)、对空（Null）、未定义（Undefined）、Symbol。

引用数据类型：对象(Object)、数组(Array)、函数(Function)。

> 注：Symbol 是 ES6 引入了一种新的原始数据类型，表示独一无二的值。

## var、let、const 区别？

-   函数提升优于变量提升，函数提升会将整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
-   var 存在提升，我们能在声明之前使用。let、const 因为存在暂时性死区的原因，不能在声明前使用
-   var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会
-   let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

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
[详解 JavaScript 中的 Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)

## 为什么要引入微任务的概念？只有宏任务不可以吗？

宏任务（先进先出的执行原则），遇到紧急任务并不能优先执行，所以需要有微任务的概念。

## Node 中的事件循环和浏览器中的事件循环有什么区别？

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

```javascript
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

## 一个历史贡面.上面有若干按钮的点击逻辑.每个按钮都有自己的 click 事件.

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
