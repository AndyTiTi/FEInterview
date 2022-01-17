---
title: 第一章
---
## [分享10道 Vue 高频面试题](https://juejin.cn/post/6854573220046372872#heading-2)
## vue 响应式原理阐述一下

首先了解 vue 中的三个核心类：

1. Observer：给对象的属性添加 getter 和 setter，用于**依赖收集**和**派发更新**
2. Dep：用于收集当前响应式对象的依赖关系，每个响应式对象都有一个 dep 实例，dep.subs = watcher[]，当数据发生变更的时候，会通过 dep.notify()通知各个 watcher
3. Watcher：观察者对象，render watcher，computed watcher，user watcher

**依赖收集**

1. initState，对 computed 属性初始化时，会触发 computed watcher 依赖收集
1. initState，对监听属性初始化时，会触发 user watcher 依赖收集
1. render，触发 render watcher 依赖收集

**派发更新**

Object.defineProperty

1. 组件中对响应的数据进行了修改，会触发 setter，
2. dep.notify()
3. 遍历所有 subs，调用每一个 watcher 的 update 方法

**总结原理**

当创建 vue 实例时，vue 会遍历 data 里的属性，Object.defineProperty 为属性添加 getter 和 setter 对数据进行劫持，

getter：依赖收集
setter：派发更新

每个组件的实例都会有对应的 watcher 实例

## 计算属性实现原理

computed watcher，计算属性监听器
computed watcher，持有一个 dep 实例，通过 dirty 属性标记计算属性是否需要重新求值

当 computed 的依赖值改变之后，就会通知订阅的 watcher 进行更新，对于 computed watcher 会将 dirty 属性设置为 true，并且进行计算属性方法的调用。

1. computed 所谓的缓存是指什么？
   计算属性是基于它的响应式依赖进行缓存的，只有以来发生改变的时候才会重新求值

## vue.$nextTick 实现原理？

```javascript
const callbacks = []
let pending = false

function flushCallbacks() {
	pending = false
	const copies = callbacks.slice(0)
	callbacks.length = 0
	for (let i = 0; i < copies.length; i++) {
		copies[i]()
	}
}
let timerFunc
if (typeof Promise !== 'undefined' && isNative(Promise)) {
	const p = Promise.resolve()
	timerFunc = () => {
		p.then(flushCallbacks)
		if (isIOS) setTimeout(noop)
	}
	isUsingMicroTask = true
} else if (
	!isIE &&
	typeof MutationObserver !== 'undefined' &&
	(isNative(MutationObserver) ||
		MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
	let counter = 1
	const observer = new MutationObserver(flushCallbacks)
	const textNode = document.createTextNode(String(counter))
	observer.observe(textNode, {
		characterData: true,
	})
	timerFunc = () => {
		counter = (counter + 1) % 2
		textNode.data = String(counter)
	}
	isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
	timerFunc = () => {
		setImmediate(flushCallbacks)
	}
} else {
	timerFunc = () => {
		setTimeout(flushCallbacks, 0)
	}
}

export function nextTick(cb?: Function, ctx?: Object) {
	let _resolve
	callbacks.push(() => {
		if (cb) {
			try {
				cb.call(ctx)
			} catch (e) {
				handleError(e, ctx, 'nextTick')
			}
		} else if (_resolve) {
			_resolve(ctx)
		}
	})
	if (!pending) {
		pending = true
		timerFunc()
	}
	if (!cb && typeof Promise !== 'undefined') {
		return new Promise((resolve) => {
			_resolve = resolve
		})
	}
}
```

先判断是否支持 promise

如果支持 promise。就通过 Promise.resolve 的方法，异步执行方法

如果不支持 promise，就判断是否支持 MutationObserver。

如果支持，就通过 MutationObserver（微异步）来异步执行方法，

如果 MutationObserver 还不支持，就通过 setTimeout 来异步执行方法。

MutaionObserver 通过创建新的节点，调用 timerFunc 方法，改变 MutationObserver 监听的节点变化，从而触发异步方法执行。

## Proxy 实现数据响应式？

## v-for 和 v-if 优先级？

1. 显然 v-for 优先于 v-if 被解析（codegen.js 源码中，genFor 优于 genIf 进行了判断）
2. 如果同时出现，每次渲染都会先执行循环再判断条件，无论如何循环都不可避免性能浪费；
3. 要避免这种情况，则在外层嵌套 template，在这一层进行 v-if 判断，然后在内部进行 v-for 的遍历；

## Vue 组件的 data 为什么必须是个函数，而 Vue 的根实例则没有此限制？

Vue 组件可能存在多个实例，如果使用对象形式定义 data，则会导致他们共用一个 data 对象，那么状态变更将会影响所有组件实例，这是不合理的；采用函数形式定义，在 initData 时会将其作为工厂函数返回全新的 data 对象，有效规避多实例之间状态污染的问题。而在 Vue 根实例创建过程中则不存在该限制，也是因为根实例只有一个，不需要担心这种情况。最终会进行合并策略 mergeOptions

## Vue 中 key 的作用和工作原理？

断点调试技巧【断点右击 EditTarget-> 进行结点的锁死，避免别的流程影响调试思路】

::: tip
使用 key
:::

![Image from alias](/usekey.png)
::: warning
不使用 key
:::

![Image from alias](/key.png)

```javascript
// 首次循环patch A
A B C D E
A B F C D E

// 第2次循环patch B
B C D E
B F C D E

// 第3次循环patch E
C D E
F C D E

// 第4次循环patch D
C D
F C D

// 第5次循环patch C
C
F C

// oldCh全部处理结束，newCh中剩下的F，创建F并插入到C前面
```

正确解答：

1. key 的作用主要是为了高效的更新虚拟 DOM，其原理是 vue 在 patch 过程中通过 key 可以精准判断两个节点是否是同一个，从而避免频繁更新不同元素，使得整个 patch 过程更加高效，减少 DOM 操作量，提高性能。

2. 另外，若不设置 key 还可能在列表更新时引发一些隐蔽的 bug

3. vue 中在使用相同标签名元素的过渡切换时，也会使用到 key 属性，其目的也是为了让 vue 可以区分它们，否则 vue 只会替换其内部属性而不会触发过渡效果。

## Vue 中 diff 算法？

1. diff 算法是虚拟 DOM 技术的产物，vue 里面实际叫做 patch，它的核心实现来自于 snabbdom；通过新旧虚拟 DOM 作对比（即 patch），将变化的地方转换为 DOM 操作

2. 在 vue 1 中是没有 patch 的，因为界面中每个依赖都有专门的 watcher 负责更新，这样项目规模变大就会成为性能瓶颈，vue 2 中为了降低 watcher 粒度，每个组件只有一个 watcher，但是当需要更新的时候，怎样才能精确找到发生变化的地方？这就需要引入 patch 才行。

3. 组件中数据发生变化时，对应的 watcher 会通知更新并执行其更新函数，它会执行渲染函数获取全新虚拟 dom：newVnode，此时就会执行 patch 比对上次渲染结果 oldVnode 和新的渲染结果 newVnode。

4. patch 过程遵循深度优先、同层比较的策略；两个节点之间比较时，如果它们拥有子节点，会先比较子节点；比较两组子节点时，会假设头尾节点可能相同先做尝试，没有找到相同节点后才按照通用方式遍历查找；查找结束再按情况处理剩下的节点；借助 key 通常可以非常精确找到相同节点，因此整个 patch 过程非常高效。

> 修改数据 - 触发数据响应式 setter - 触发 notify - 将 watcher 加入异步更新队列 - 事件循环执行完毕清空队列 - watcher 执行更新函数 - 调用组件的更新渲染函数 - 执行过程中就是 diff patch 的过程
