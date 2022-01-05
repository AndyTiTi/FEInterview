---
title: 第二章
---

## css 优先级

important > 内联 > ID 选择器 > 类选择器 > 标签选择器

## 避免 css 全局污染。

我常用的 css modules

## css modules 的原理

生成唯一的类名

## 实现一个 redux？

实现 createStore 的功能，关键点发布订阅的功能，以及取消订阅的功能。

## 用 ts 实现一个 redux？

## require 引入的模块 webpack 能做 Tree Shaking 吗？

不能，Tree Shaking 需要静态分析，只有 ES6 的模块才支持。

## webpack 能动态加载 require 引入的模块吗？

应该是不能的，前面说了，webpack 支持动态导入基本上只能用 import() 和 require.ensure。

## React.lazy 的原理是啥？

## FiberNode 有哪些属性

## react 里有动态加载的 api 吗？

React.lazy

## webpack 如何实现动态加载

讲道理 webpack 动态加载就两种方式：import()和 require.ensure，不过他们实现原理是相同的。

我觉得这道题的重点在于动态的创建 script 标签，以及通过 jsonp 去请求 chunk，推荐的文章是：[webpack 是如何实现动态导入的](https://juejin.im/post/5d26e7d1518825290726f67a)

## 详细的介绍一下 getDerivedStateFromProps

## flex: 0 1 auto; 是什么意思？

## less 的 & 代表什么？

## interface 和 type 的区别

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

## 实现一个 Typescript 里的 Pick

type Pick<T, K extends keyof T> = { [P in K]: T[P] }

## 手写：并发只能 10 个

## 算法题：求最大公共前缀，如 ['aaafsd', 'aawwewer', 'aaddfff'] => 'aa'

## 写一个 promise 重试函数，可以设置时间间隔和次数。function foo(fn, interval, times) {}

[1]一文吃透 React 事件机制原理: https://toutiao.io/posts/28of14w/preview

[2]flex 语法篇: https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

[3]函数式组件与类组件有何不同？: https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/

[4]前端模块化：CommonJS,AMD,CMD,ES6: https://juejin.im/post/5aaa37c8f265da23945f365c

[5]webpack 是如何实现动态导入的: https://juejin.im/post/5d26e7d1518825290726f67a
