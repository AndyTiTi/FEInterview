---
title: 第一章
---

## React 生命周期

![react 15](/react15.jpg)
![react 16](/react16.jpg)

## React 事件机制

[一文吃透 React 事件机制原理](https://toutiao.io/posts/28of14w/preview)

## 说说 react 的渲染过程

![react 16](/react-process.jpg)

**react 的核心可以用 ui=fn(state)来表示，更详细可以用**

```js
const state = reconcile(update)
const UI = commit(state)
```

**上面的 fn 可以分为如下一个部分：**

-   Scheduler（调度器）： 排序优先级，让优先级高的任务先进行 reconcile
-   Reconciler（协调器）： 找出哪些节点发生了改变，并打上不同的 Flags（旧版本 react 叫 Tag）
-   Renderer（渲染器）： 将 Reconciler 中打好标签的节点渲染到视图上

**那这些模块是怎么配合工作的呢：**

-   首先 jsx 经过 babel 的 ast 词法解析之后编程 React.createElement，React.createElement 函数执行之后就是 jsx 对象，也被称为 virtual-dom。
-   不管是在首次渲染还是更新状态的时候，这些渲染的任务都会经过 Scheduler 的调度，Scheduler 会根据任务的优先级来决定将哪些任务优先进入 render 阶段，比如用户触发的更新优先级非常高，如果当前正在进行一个比较耗时的任务，则这个任务就会被用户触发的更新打断，在 Scheduler 中初始化任务的时候会计算一个过期时间，不同类型的任务过期时间不同，优先级越高的任务，过期时间越短，优先级越低的任务，过期时间越长。在最新的 Lane 模型中，则可以更加细粒度的根据二进制 1 的位置，来决定任务的优先级，通过二进制的融合和相交，判断任务的优先级是否足够在此次 render 的渲染。Scheduler 会分配一个时间片给需要渲染的任务，如果是一个非常耗时的任务，如果在一个时间片之内没有执行完成，则会从当前渲染到的 Fiber 节点暂停计算，让出执行权给浏览器，在之后浏览器空闲的时候从之前暂停的那个 Fiber 节点继续后面的计算，这个计算的过程就是计算 Fiber 的差异，并标记副作用。详细可阅读往期课件和视频讲解，往期文章在底部。
-   在 render 阶段：render 阶段的主角是 Reconciler，在 mount 阶段和 update 阶段，它会比较 jsx 和当前 Fiber 节点的差异（diff 算法指的就是这个比较的过程），将带有副作用的 Fiber 节点标记出来，这些副作用有 Placement（插入）、Update（更新）、Deletetion（删除）等，而这些带有副作用 Fiber 节点会加入一条 EffectList 中，在 commit 阶段就会遍历这条 EffectList，处理相应的副作用，并且应用到真实节点上。而 Scheduler 和 Reconciler 都是在内存中工作的，所以他们不影响最后的呈现。
-   在 commit 阶段：会遍历 EffectList，处理相应的生命周期，将这些副作用应用到真实节点，这个过程会对应不同的渲染器，在浏览器的环境中就是 react-dom，在 canvas 或者 svg 中就是 reac-art 等。

**另外我们也可以从首次渲染和更新的时候看在 render 和 commit 这两个子阶段是如果工作的：**

-   mount 时：
    1. 在 render 阶段会根据 jsx 对象构建新的 workInProgressFiber 树，不太了解 Fiber 双缓存的可以查看往期文章 Fiber 架构，然后将相应的 fiber 节点标记为 Placement，表示这个 fiber 节点需要被插入到 dom 树中，然后会这些带有副作用的 fiber 节点加入一条叫做 Effect List 的链表中。
    1. 在 commit 阶段会遍历 render 阶段形成的 Effect List，执行链表上相应 fiber 节点的副作用，比如 Placement 插入，或者执行 Passive（useEffect 的副作用）。将这些副作用应用到真实节点上
-   update 时：
    1. 在 render 阶段会根据最新状态的 jsx 对象对比 current Fiber，再构建新的 workInProgressFiber 树，这个对比的过程就是 diff 算法，diff 算法又分成单节点的对比和多节点的对比，不太清楚的同学参见之前的文章 diff 算法 ，对比的过程中同样会经历收集副作用的过程，也就是将对比出来的差异标记出来，加入 Effect List 中，这些对比出来的副作用例如：Placement（插入）、Update(更新)、Deletion（删除）等。
    1. 在 commit 阶段同样会遍历 Effect List，将这些 fiber 节点上的副作用应用到真实节点上

![react-performance.webp](/react-performance.webp.jpg)

## React 性能优化思路？

:::tip React 性能优化的理念的主要方向就是这两个

1. 减少重新 render 的次数。因为在 React 里最重(花时间最长)的一块就是 reconction(简单的可以理解为 diff)，如果不 render，就不会 reconction。
2. 减少计算的量。主要是减少重复计算，对于函数式组件来说，每次 render 都会重新从头开始执行函数调用。
   :::

-   类组件:
    使用的 React 优化 API 主要是：shouldComponentUpdate 和 PureComponent，这两个 API 所提供的解决思路都是为了减少重新 render 的次数，主要是减少父组件更新而子组件也更新的情况
-   函数式组件：React.memo 这个效果基本跟类组件里面的 PureComponent 效果极其类似

## 快速搞定虚拟 DOM 的两个“大问题”

1. 挂载阶段
   React 将结合 JSX 的描述，构建出虚拟 DOM 树，然后通过 ReactDOM.render 实现虚拟 DOM 到真实 Dom 的映射（触发渲染流水线）
2. 更新阶段
   页面的变化会先作用于虚拟 DOM，虚拟 DOM 将在 JS 层借助算法先对比出具体有哪些真实 DOM 需要被改变，然后再将这些改变作用于真实 DOM

## React.memo 高级用法？

> 默认情况下其只会对 props 的复杂对象做浅层对比(浅层对比就是只会对比前后两次 props 对象引用是否相同，不会对比对象里面的内容是否相同)，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现

```javascript
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
exportdefault React.memo(MyComponent, areEqual);
```

如果你有在类组件里面使用过 `shouldComponentUpdate()`这个方法，你会对 React.memo 的第二个参数非常的熟悉，不过值得注意的是，如果 props 相等，areEqual 会返回 true；如果 props 不相等，则返回 false。这与 shouldComponentUpdate 方法的返回值相反

## useCallback？

```javascript
// 使用
const callback = () => {
	doSomething(a, b)
}

const memoizedCallback = useCallback(callback, [a, b])
```

```javascript
// 父组件 index.js
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Child from './child'

function App() {
	const [title, setTitle] = useState('这是一个 title')
	const [subtitle, setSubtitle] = useState('我是一个副标题')

	const callback = () => {
		setTitle('标题改变了')
	}
	return (
		<div className="App">
			<h1>{title}</h1>
			<h2>{subtitle}</h2>
			<button onClick={() => setSubtitle('副标题改变了')}>
				改副标题
			</button>
			<Child onClick={callback} name="桃桃" />
		</div>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

// 子组件 child.js
import React from 'react'

function Child(props) {
	console.log(props)
	return (
		<>
			<button onClick={props.onClick}>改标题</button>
			<h1>{props.name}</h1>
		</>
	)
}

export default React.memo(Child)
```

```javascript
// index.js
import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import Child from './child'

function App() {
	const [title, setTitle] = useState('这是一个 title')
	const [subtitle, setSubtitle] = useState('我是一个副标题')

	const callback = () => {
		setTitle('标题改变了')
	}

	// 通过 useCallback 进行记忆 callback，并将记忆的 callback 传递给 Child
	const memoizedCallback = useCallback(callback, [])

	return (
		<div className="App">
			<h1>{title}</h1>
			<h2>{subtitle}</h2>
			<button onClick={() => setSubtitle('副标题改变了')}>
				改副标题
			</button>
			<Child onClick={memoizedCallback} name="桃桃" />
		</div>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

> 问题：当父组件重新渲染的时候，传递给子组件的 props 发生了改变，再看传递给 Child 组件的就两个属性，一个是 name，一个是 onClick ，name 是传递的常量，不会变，变的就是 onClick 了，为什么传递给 onClick 的 callback 函数会发生改变呢？在文章的开头就已经说过了，在函数式组件里每次重新渲染，函数组件都会重头开始重新执行，那么这两次创建的 callback 函数肯定发生了改变，所以导致了子组件重新渲染。

> 解决：在函数没有改变的时候，重新渲染的时候保持两个函数的引用一致，这个时候就要用到 useCallback 这个 API 了

## useMemo

在文章的开头就已经介绍了，React 的性能优化方向主要是两个：一个是减少重新 render 的次数(或者说减少不必要的渲染)，另一个是减少计算的量。

前面介绍的 React.memo 和 useCallback 都是为了减少重新 render 的次数。对于如何减少计算的量，就是 useMemo 来做的，接下来我们看例子。

```javascript
function App() {
	const [num, setNum] = useState(0)

	// 一个非常耗时的一个计算函数
	// result 最后返回的值是 49995000
	function expensiveFn() {
		let result = 0

		for (let i = 0; i < 10000; i++) {
			result += i
		}

		console.log(result) // 49995000
		return result
	}

	const base = expensiveFn()

	return (
		<div className="App">
			<h1>count：{num}</h1>
			<button onClick={() => setNum(num + base)}>+1</button>
		</div>
	)
}
```

### 可能产生性能问题

就算是一个看起来很简单的组件，也有可能产生性能问题，通过这个最简单的例子来看看还有什么值得优化的地方。

首先我们把 expensiveFn 函数当做一个计算量很大的函数(比如你可以把 i 换成 10000000)，然后当我们每次点击 +1 按钮的时候，都会重新渲染组件，而且都会调用 expensiveFn 函数并输出 49995000。由于每次调用 expensiveFn 所返回的值都一样，所以我们可以想办法将计算出来的值缓存起来，每次调用函数直接返回缓存的值，这样就可以做一些性能优化。

### useMemo 做计算结果缓存

针对上面产生的问题，就可以用 useMemo 来缓存 expensiveFn 函数执行后的值。

首先介绍一下 useMemo 的基本的使用方法，详细的使用方法可见官网[3]：

```javascript
function computeExpensiveValue() {
	// 计算量很大的代码
	return xxx
}

const memoizedValue = useMemo(computeExpensiveValue, [a, b])
```

useMemo 的第一个参数就是一个函数，这个函数返回的值会被缓存起来，同时这个值会作为 useMemo 的返回值，第二个参数是一个数组依赖，如果数组里面的值有变化，那么就会重新去执行第一个参数里面的函数，并将函数返回的值缓存起来并作为 useMemo 的返回值 。

了解了 useMemo 的使用方法，然后就可以对上面的例子进行优化，优化代码如下：

```JavaScript
function App() {
  const [num, setNum] = useState(0);

  function expensiveFn() {
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += i;
    }
    console.log(result)
    return result;
  }

  const base = useMemo(expensiveFn, []);

  return (
    <div className="App">
      <h1>count：{num}</h1>
      <button onClick={() => setNum(num + base)}>+1</button>
    </div>
  );
}
```

执行上面的代码，然后现在可以观察无论我们点击 +1 多少次，只会输出一次 49995000，这就代表 expensiveFn 只执行了一次，达到了我们想要的效果。

### 小结

useMemo 的使用场景主要是用来缓存计算量比较大的函数结果，可以避免不必要的重复计算，有过 vue 的使用经历同学可能会觉得跟 Vue 里面的计算属性有异曲同工的作用。

## 实现一个搜索推荐组件会考虑哪些?
