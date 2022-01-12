---
title: 第二章
---

## Redux

Redux 通过提供一个统一的状态容器，使得数据能够自由而有序地在任意组件之间穿梭，这就是 Redux 实现组件间通信的思路。

## 实现一个 redux？

实现 createStore 的功能，关键点发布订阅的功能，以及取消订阅的功能。

## 用 ts 实现一个 redux？

## React.lazy 的原理是啥？

## react17 为什么不用 import React

jsx 经过编译之后编程 React.createElement，不引入 React 就会报错，react17 改变了编译方式，变成了 jsx.createElement

```js
function App() {
	return <h1>Hello World</h1>
}
//转换后
import { jsx as _jsx } from 'react/jsx-runtime'

function App() {
	return _jsx('h1', { children: 'Hello world' })
}
```

## FiberNode 有哪些属性

tag、key、elementType、stateNode、updateQueue

## jsx 和 Fiber 有什么关系

mount 时通过 jsx 对象（调用 createElement 的结果）调用 createFiberFromElement 生成 Fiber

update 时通过 reconcileChildFibers 或 reconcileChildrenArray 对比新 jsx 和老的 Fiber（current Fiber）生成新的 wip Fiber 树

## Fiber 架构

Fiber 是一个 js 对象，能承载节点信息、优先级、updateQueue，同时它还是一个工作单元。

-   Fiber 双缓存可以在构建好 wip Fiber 树之后切换成 current Fiber，内存中直接一次性切换，提高了性能

-   Fiber 的存在使异步可中断的更新成为了可能，作为工作单元，可以在时间片内执行工作，没时间了交还执行权给浏览器，下次时间片继续执行之前暂停之后返回的 Fiber

-   Fiber 可以在 reconcile 的时候进行相应的 diff 更新，让最后的更新应用在真实节点上

### Fiber 你需要知道的基础知识

1. <a href="./browser.html#浏览器刷新率" target="_blank">浏览器刷新率</a>
1. <a href="./browser.html#什么是时间分片-time-slicing" target="_blank">时间分片（Time Slicing）</a>

Fiber 架构的应用目的，按照 React 官方的说法，是实现“增量渲染”。所谓“增量渲染”，通俗来说就是把一个渲染任务分解为多个渲染任务，而后将其分散到多个帧里面。不过严格来说，增量渲染其实也只是一种手段，实现增量渲染的目的，是为了实现任务的可中断、可恢复，并给不同的任务赋予不同的优先级，最终达成更加顺滑的用户体验。

### Fiber 是如何实现更新过程可控？

Fiber 架构中的“可中断”“可恢复”到底是如何实现的？

更新过程的可控主要体现在下面几个方面：

1. 任务拆分
1. 任务挂起、恢复、终止
1. 任务具备优先级

-   1. 任务拆分

前面提到，React Fiber 之前是基于原生执行栈，每一次更新操作会一直占用主线程，直到更新完成。这可能会导致事件响应延迟，动画卡顿等现象。

在 React Fiber 机制中，它采用"化整为零"的战术，将调和阶段（Reconciler）递归遍历 VDOM 这个大任务分成若干小任务，每个任务只负责一个节点的处理。例如：

```js
import React from 'react'
import ReactDom from 'react-dom'
const jsx = (
	<div id="A1">
		A1
		<div id="B1">
			B1
			<div id="C1">C1</div>
			<div id="C2">C2</div>
		</div>
		<div id="B2">B2</div>
	</div>
)
ReactDom.render(jsx, document.getElementById('root'))
```

这个组件在渲染的时候会被分成八个小任务，每个任务用来分别处理 A1(div)、A1(text)、B1(div)、B1(text)、C1(div)、C1(text)、C2(div)、C2(text)、B2(div)、B2(text)。

再通过时间分片，在一个时间片中执行一个或者多个任务。这里提一下，所有的小任务并不是一次性被切分完成，而是处理当前任务的时候生成下一个任务，如果没有下一个任务生成了，就代表本次渲染的 Diff 操作完成。

-   2. 挂起、恢复、终止

再说挂起、恢复、终止之前，不得不提两棵 Fiber 树，`workInProgress tree` 和 `currentFiber tree`。

workInProgress 代表当前正在执行更新的 Fiber 树。在 render 或者 setState 后，会构建一颗 Fiber 树，也就是 `workInProgress tree`，这棵树在构建每一个节点的时候会收集当前节点的副作用，整棵树构建完成后，会形成一条完整的副作用链。

currentFiber 表示上次渲染构建的 Filber 树。在每一次更新完成后 workInProgress 会赋值给 currentFiber。在新一轮更新时 `workInProgress tree` 再重新构建，新 workInProgress 的节点通过 alternate 属性和 currentFiber 的节点建立联系。

在新 `workInProgress tree` 的创建过程中，会同 currentFiber 的对应节点进行 Diff 比较，收集副作用。同时也会复用和 currentFiber 对应的节点对象，减少新创建对象带来的开销。也就是说无论是创建还是更新，挂起、恢复以及终止操作都是发生在 `workInProgress tree` 创建过程中。

`workInProgress tree` 构建过程其实就是循环的执行任务和创建下一个任务，大致过程如下：

![fiber-tree](/fiber-tree.webp.jpg)

当没有下一个任务需要执行的时候，workInProgress tree 构建完成，开始进入提交阶段，完成真实 DOM 更新。

在构建 workInProgressFiber tree 过程中可以通过挂起、恢复和终止任务，实现对更新过程的管控。下面简化了一下源码，大致实现如下：

```js
let nextUnitWork = null;//下一个执行单元
//开始调度
function shceduler(task){
     nextUnitWork = task;
}
//循环执行工作
function workLoop(deadline){
  let shouldYield = false;//是否要让出时间片交出控制权
  while(nextUnitWork && !shouldYield){
    nextUnitWork = performUnitWork(nextUnitWork)
    shouldYield = deadline.timeRemaining()<1 // 没有时间了，检出控制权给浏览器
  }
  if(!nextUnitWork) {
    conosle.log("所有任务完成")
    //commitRoot() //提交更新视图
  }
  // 如果还有任务，但是交出控制权后,请求下次调度
  requestIdleCallback(workLoop,{timeout:5000})
}
/*
 * 处理一个小任务，其实就是一个 Fiber 节点，如果还有任务就返回下一个需要处理的任务，没有就代表整个
 */
function performUnitWork(currentFiber){
  ....
  return FiberNode
}
```

**挂起**

当第一个小任务完成后，先判断这一帧是否还有空闲时间，没有就挂起下一个任务的执行，记住当前挂起的节点，让出控制权给浏览器执行更高优先级的任务。

**恢复**

在浏览器渲染完一帧后，判断当前帧是否有剩余时间，如果有就恢复执行之前挂起的任务。如果没有任务需要处理，代表调和阶段完成，可以开始进入渲染阶段。这样完美的解决了调和过程一直占用主线程的问题。

那么问题来了他是如何判断一帧是否有空闲时间的呢？答案就是我们前面提到的 RIC (RequestIdleCallback) 浏览器原生 API，React 源码中为了兼容低版本的浏览器，对该方法进行了 Polyfill。

当恢复执行的时候又是如何知道下一个任务是什么呢？答案在前面提到的链表。在 React Fiber 中每个任务其实就是在处理一个 FiberNode 对象，然后又生成下一个任务需要处理的 FiberNode。顺便提一嘴，这里提到的 FiberNode 是一种数据格式：

```js
class FiberNode {
	constructor(tag, pendingProps, key, mode) {
		// 实例属性
		this.tag = tag // 标记不同组件类型，如函数组件、类组件、文本、原生组件...
		this.key = key // react 元素上的 key 就是 jsx 上写的那个 key ，也就是最终 ReactElement 上的
		this.elementType = null // createElement的第一个参数，ReactElement 上的 type
		this.type = null // 表示fiber的真实类型 ，elementType 基本一样，在使用了懒加载之类的功能时可能会不一样
		this.stateNode = null // 实例对象，比如 class 组件 new 完后就挂载在这个属性上面，如果是RootFiber，那么它上面挂的是 FiberRoot,如果是原生节点就是 dom 对象
		// fiber
		this.return = null // 父节点，指向上一个 fiber
		this.child = null // 子节点，指向自身下面的第一个 fiber
		this.sibling = null // 兄弟组件, 指向一个兄弟节点
		this.index = 0 //  一般如果没有兄弟节点的话是0 当某个父节点下的子节点是数组类型的时候会给每个子节点一个 index，index 和 key 要一起做 diff
		this.ref = null // reactElement 上的 ref 属性
		this.pendingProps = pendingProps // 新的 props
		this.memoizedProps = null // 旧的 props
		this.updateQueue = null // fiber 上的更新队列执行一次 setState 就会往这个属性上挂一个新的更新, 每条更新最终会形成一个链表结构，最后做批量更新
		this.memoizedState = null // 对应  memoizedProps，上次渲染的 state，相当于当前的 state，理解成 prev 和 next 的关系
		this.mode = mode // 表示当前组件下的子组件的渲染方式
		// effects
		this.effectTag = NoEffect // 表示当前 fiber 要进行何种更新
		this.nextEffect = null // 指向下个需要更新的fiber
		this.firstEffect = null // 指向所有子节点里，需要更新的 fiber 里的第一个
		this.lastEffect = null // 指向所有子节点中需要更新的 fiber 的最后一个
		this.expirationTime = NoWork // 过期时间，代表任务在未来的哪个时间点应该被完成
		this.childExpirationTime = NoWork // child 过期时间
		this.alternate = null // current 树和 workInprogress 树之间的相互引用
	}
}
```

在每次循环的时候，找到下一个执行需要处理的节点

```js
function performUnitWork(currentFiber) {
	//beginWork(currentFiber) //找到儿子，并通过链表的方式挂到currentFiber上，每一偶儿子就找后面那个兄弟
	//有儿子就返回儿子
	if (currentFiber.child) {
		return currentFiber.child
	}
	//如果没有儿子，则找弟弟
	while (currentFiber) {
		//一直往上找
		//completeUnitWork(currentFiber);//将自己的副作用挂到父节点去
		if (currentFiber.sibling) {
			return currentFiber.sibling
		}
		currentFiber = currentFiber.return
	}
}
```

在一次任务结束后返回该处理节点的子节点或兄弟节点或父节点。只要有节点返回，说明还有下一个任务，下一个任务的处理对象就是返回的节点。通过一个全局变量记住当前任务节点，当浏览器再次空闲的时候，通过这个全局变量，找到它的下一个任务需要处理的节点恢复执行。就这样一直循环下去，直到没有需要处理的节点返回，代表所有任务执行完成。最后大家手拉手，就形成了一颗 Fiber 树。

![fiber-root.webp](/fiber-root.webp.jpg)

**终止**

其实并不是每次更新都会走到提交阶段。当在调和过程中触发了新的更新，在执行下一个任务的时候，判断是否有优先级更高的执行任务，如果有就终止原来将要执行的任务，开始新的 workInProgressFiber 树构建过程，开始新的更新流程。这样可以避免重复更新操作。这也是在 React 16 以后生命周期函数 componentWillMount 有可能会执行多次的原因。

-   3. 任务具备优先级(优先级调度是如何实现的？)
       React Fiber 除了通过挂起，恢复和终止来控制更新外，还给每个任务分配了优先级。具体点就是在创建或者更新 FiberNode 的时候，通过算法给每个任务分配一个到期时间（expirationTime）。在每个任务执行的时候除了判断剩余时间，如果当前处理节点已经过期，那么无论现在是否有空闲时间都必须执行该任务。

同时过期时间的大小还代表着任务的优先级。

任务在执行过程中顺便收集了每个 FiberNode 的副作用，将有副作用的节点通过 firstEffect、lastEffect、nextEffect 形成一条副作用单链表 AI(TEXT)-B1(TEXT)-C1(TEXT)-C1-C2(TEXT)-C2-B1-B2(TEXT)-B2-A。

![fiber-root.webp](/fiber-effect.webp.jpg)

其实最终都是为了收集到这条副作用链表，有了它，在接下来的渲染阶段就通过遍历副作用链完成 DOM 更新。这里需要注意，更新真实 DOM 的这个动作是一气呵成的，不能中断，不然会造成视觉上的不连贯。

**关于 React Fiber 的思考**

1. 能否使用生成器（generater）替代链表
   在 Fiber 机制中，最重要的一点就是需要实现挂起和恢复，从实现角度来说 generator 也可以实现。那么为什么官方没有使用 generator 呢？猜测应该是是性能方面的原因。生成器不仅让您在堆栈的中间让步，还必须把每个函数包装在一个生成器中。一方面增加了许多语法方面的开销，另外还增加了任何现有实现的运行时开销。性能上远没有链表的方式好，而且链表不需要考虑浏览器兼容性。

2. Vue 是否会采用 Fiber 机制来优化复杂页面的更新
   这个问题其实有点搞事情，如果 Vue 真这么做了是不是就是变相承认 Vue 是在"集成" Angular 和 React 的优点呢？React 有 Fiber，Vue 就一定要有？

两者虽然都依赖 DOM Diff，但是实现上却有区别，DOM Diff 的目的都是收集副作用。Vue 通过 Watcher 实现了依赖收集，本身就是一种很好的优化。所以 Vue 没有采用 Fiber 机制，也无伤大雅。

总结
React Fiber 的出现相当于是在更新过程中引进了一个中场指挥官，负责掌控更新过程，足球世界里管这叫前腰。抛开带来的性能和效率提升外，这种“化整为零”和任务编排的思想，可以应用到我们平时的架构设计中。

### Fiber 树和传统虚拟 DOM 树有何不同？

## react 里有动态加载的 api 吗？

React.lazy

## 为什么需要 React-Hooks

-   告别难以理解的 Class；
-   解决业务逻辑难以拆分的问题；
-   使状态逻辑复用变得简单可行；
-   函数组件从设计思想上来看，更加契合 React 的理念。

## 为什么 hooks 不能写在条件判断中

hook 会按顺序存储在链表中，如果写在条件判断中，就没法保持链表的顺序

## 说一下 getDerivedStateFromProps

getDerivedStateFromProps 会在调用 render 方法之前调用，即在渲染 DOM 元素之前会调用，并且在初始挂载及后续更新时都会被调用。

state 的值在任何时候都取决于 props。

getDerivedStateFromProps 的存在只有一个目的：让组件在 props 变化时更新 state。

该方法返回一个对象用于更新 state，如果返回 null 则不更新任何内容。

```js
class Header extends React.Component {
	constructor(props) {
		super(props)
		this.state = { favoritesite: 'runoob' }
	}
	static getDerivedStateFromProps(props, state) {
		return { favoritesite: props.favsite }
	}
	changeSite = () => {
		this.setState({ favoritesite: 'google' })
	}
	render() {
		return (
			<div>
				<h1>我喜欢的网站是 {this.state.favoritesite}</h1>
				<button type="button" onClick={this.changeSite}>
					修改网站名
				</button>
			</div>
		)
	}
}

ReactDOM.render(<Header favcol="taobao" />, document.getElementById('root'))
```

## React 性能优化

-   渲染列表时加 key
-   自定义事件、DOM 事件及时销毁
-   合理使用一部组件
-   减少函数 bind this 的次数
-   合理使用 SCU PureComponent
-   合适使用 Immutable.js
-   webpack 层面的优化
-   前端通用的性能优化，如图片懒加载
-   使用 SSR

## 为什么用 key

-   必须用 key，且不能是 index 或 random
-   diff 算法中通过 tag 和 key 来判断，是否是 sameNode
-   减少渲染次数，提升渲染性能

## React 生命周期

![在这里插入图片描述](https://img-blog.csdnimg.cn/f9de7c8334ae42d9a8121e0bd1ab505c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## React 父子组件生命周期

> mountComponent 负责管理生命周期中的 mounting 阶段的方法调用

mountComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillMount 在其子组件的 componentWillMount 之前调用，而父组件的 componentDidMount 在其子组件的 componentDidMount 之后调用

> updateComponent 负责管理生命周期中的 updating 阶段的方法调用

updateComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillUpdate 在其子组件的 componentWillUpdate 之前调用，而父组件的 componentDidUpdate 在其子组件的 componentDidUpdate 之后调用

<div style="display:flex">
<img src="https://img-blog.csdnimg.cn/133f6cfb49314dab8d8638f324f2f487.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16" alt="图片替换文本" width="500" />
<img src="https://img-blog.csdnimg.cn/b22e942c99eb4a67a44f2866dc84fba4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16" alt="图片替换文本" width="500" />
</div>

## setState 是同步的还是异步的

**多次传入相同的对象，执行时会合并，传入函数不会被合并**

legacy 模式下：命中 batchedUpdates 时是异步 未命中 batchedUpdates 时是同步的；setTimeout 或者原生事件是同步的

concurrent 模式下：都是异步的

![image](/setState.png)

-   setState 无所谓同步异步
-   看是否能命中 batchUpdate 机制
-   判断 isBatchingUpdates

## 哪些能触发 batchUpdate？

生命周期和它调用的函数
react 中注册的事件和它调用的函数
react 可以管理的入口

## 哪些不能触发 batchUpdate？

setTimeout、setInterval
自定义的 DOM 事件和它调用的函数
react 管不到的入口

## 函数组件和类组件的区别

**相同点：**

都可以接收 props 返回 react 元素

**不同点：**

编程思想：类组件需要创建实例，面向对象，函数组件不需要创建实例，接收输入，返回输出，函数式编程

内存占用：类组建需要创建并保存实例，占用一定的内存

值捕获特性：函数组件具有值捕获的特性 下面的函数组件换成类组件打印的 num 一样吗

可测试性：函数组件方便测试

状态：类组件有自己的状态，函数组件没有只能通过 useState

生命周期：类组件有完整生命周期，函数组件没有可以使用 useEffect 实现类似的生命周期

逻辑复用：类组件继承 Hoc（逻辑混乱 嵌套），组合优于继承，函数组件 hook 逻辑复用

跳过更新：shouldComponentUpdate PureComponent，React.memo

发展未来：函数组件将成为主流，屏蔽 this、规范、复用，适合时间分片和渲染

## 为什么标记 UNSAFE

componentWillMount、componentWillMount、componentWillUpdate 为什么标记 UNSAFE

新的 Fiber 架构能在 scheduler 的调度下实现暂停继续，排列优先级，Lane 模型能使 Fiber 节点具有优先级，在高优先级的任务打断低优先级的任务时，低优先级的更新可能会被跳过，所有以上生命周期可能会被执行多次，和之前版本的行为不一致。

## React 单向数据流

![redux](/redux.gif)

## React 事件系统原理

![react-event](/react-event.jpg)

1. 我们编写的 click 事件,最终会被转换城 fiber 对象
2. fiber 对象上的 memoizedProps 和 pendingProps 保存了我们的事件
3. 当前元素绑定的事件是 noop()函数和 document 上的事件监听器,click 事件其实是绑定在 document 上面.
4. 真实 DOM 上的 click 事件,会被单独处理,被 react 替换成空函数
5. onChange 事件,在 document 上面,有好几个事件跟他对应:blur,change,input,keydown 等
6. react 并不是一开始就把所有事件绑定在 document 上面,而是采用了一种按需绑定,比如发现了 click 事件,才会绑定 document click 事件
7. 我们使用的 click 事件,在 react 并不是原生事件,而是原生事件合成的 React 事件.
8. click 事件合称为 onClick 事件,blur,change,keyDown,keyUp 等,合成了 onChange 事件
9. React 源码流程图

**事件合成**

-   合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力
-   对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象。

**1. react 是如何合成事件**

```js
const namesToPlugins = {
    SimpleEventPlugin,
//SimpleEventPlugin等是处理各个事件函数的插件，比如一次点击事件，就会找到SimpleEventPlugin对应的处理函数
    EnterLeaveEventPlugin,

    ChangeEventPlugin,

    SelectEventPlugin,

    BeforeInputEventPlugin,
}

//namesToPlugins:事件名-事件模块插件的映射

// plugins:对上面注册的所有插件列表,初始化为空
const  plugins = [LegacySimpleEventPlugin, LegacyEnterLeaveEventPlugin, ...];

//registrationNameModules

{
    onBlur: SimpleEventPlugin,
    onClick: SimpleEventPlugin,
    onClickCapture: SimpleEventPlugin,
    onChange: ChangeEventPlugin,
    onChangeCapture: ChangeEventPlugin,
    onMouseEnter: EnterLeaveEventPlugin,
    onMouseLeave: EnterLeaveEventPlugin,
    // ...
}
//registrationNameModules
// 合成事件-对应的事件插件的关系,在处理props中事件的时候,根据不同的事件名称,找到对应的事件插件,统一绑定在document上,没有出现过就不会绑定

// 事件插件
const SimpleEventPlugin = {
    eventTypes:{
        'click':{ /* 处理点击事件  */
            phasedRegistrationNames:{
                bubbled: 'onClick',       // 对应的事件冒泡 - onClick
                captured:'onClickCapture' //对应事件捕获阶段 - onClickCapture
            },
            dependencies: ['click'], //事件依赖
            //eventTypes是一个对象，对象保存了原生事件名和对应的配置项dispatchConfig的映射关系。由于v16React的事件是统一绑定在document上的，React用独特的事件名称比如onClick和onClickCapture，来说明我们给绑定的函数到底是在冒泡事件阶段，还是捕获事件阶段执行。
        },
        'blur':{ /* 处理失去焦点事件 */ },
        // ...
    }
    extractEvents:function(topLevelType,targetInst,){ /* eventTypes 里面的事件对应的统一事件处理函数，接下来会重点讲到 */ }
}


// registrationNameDependencies::记录合成事件和原生事件之间的关系
{
    onBlur: ['blur'],
    onClick: ['click'],
    onClickCapture: ['click'],
    onChange: ['blur', 'change', 'click', 'focus', 'input', 'keydown', 'keyup', 'selectionchange'],
    onMouseEnter: ['mouseout', 'mouseover'],
    onMouseLeave: ['mouseout', 'mouseover'],
    // ...
}
```

注册事件：

```js
injectEventPluginsByName({
	SimpleEventPlugin: SimpleEventPlugin,
	EnterLeaveEventPlugin: EnterLeaveEventPlugin,
	ChangeEventPlugin: ChangeEventPlugin,
	SelectEventPlugin: SelectEventPlugin,
	BeforeInputEventPlugin: BeforeInputEventPlugin,
})
// injectEventPluginsByName做的事情很简单，形成上述的namesToPlugins,然后执行recomputePluginOrdering,
// ecomputePluginOrdering,作用很明确了，形成上面说的那个plugins,数组,然后publishEventForPlugin,publishEventForPlugin 作用形成上述的 registrationNameModules 和 registrationNameDependencies 对象中的映射关系
```

**2. react 如何绑定事件**
![regist-event.png](/regist-event.png)

1. 事件绑定流程

```html
<div>
	<button onClick="{" this.handerClick } className="button">点击</button>
</div>
```

2. 编译的时候,绑定给 hostCompoonent 种类的 fiber,本例中的 button 元素,在 button 对应的 fiber 上面,memoizedProps,pendingProps 形成保存

```js
// button 对应 fiber
memoizedProps = {
	onClick: function handerClick() {},
	className: 'button',
}
```

3. React 在调合子节点的时候,会进入 diff 阶段,如果判断是 HostComponent 类型的 fiber,会用 diff props 函数 diffPropsties 单独处理

4. diffProperties 函数在 diff props 如果发现是合成事件(onClick) 就会调用 legacyListenToEvent 函数。注册事件监听器.肯定是合成事件吧

```js
//  registrationName -> onClick 事件
//  mountAt -> document or container
function legacyListenToEvent(registrationName，mountAt){
   const dependencies = registrationNameDependencies[registrationName]; // 根据 onClick 获取  onClick 依赖的事件数组 [ 'click' ]。
    for (let i = 0; i < dependencies.length; i++) {
    const dependency = dependencies[i];
    //这个经过多个函数简化，如果是 click 基础事件，会走 legacyTrapBubbledEvent ,而且都是按照冒泡处理
     legacyTrapBubbledEvent(dependency, mountAt);
  }
}

```

5. legacyTrapBubbledEvent 就是执行将绑定真正的 dom 事件的函数 legacyTrapBubbledEvent(冒泡处理)。

```js
1. 先找到React合成事件对应的原生事件集合onClick-click,onCheng-[blur,change,input,keydown,keyup],然后遍历依赖项的数组,绑定事件

2. 大部分事件都是用的冒泡,特殊的事件用的是捕获比如scroll事件
case TOP_SCROLL: {                                // scroll 事件
    legacyTrapCapturedEvent(TOP_SCROLL, mountAt); // legacyTrapCapturedEvent 事件捕获处理。
    break;
}
case TOP_FOCUS: // focus 事件
case TOP_BLUR:  // blur 事件
legacyTrapCapturedEvent(TOP_FOCUS, mountAt);
legacyTrapCapturedEvent(TOP_BLUR, mountAt);
break;
```

6. 绑定 dispatchEvent ,进行事件监听

```js
/*
  targetContainer -> document
  topLevelType ->  click
  capture = false
*/
function addTrappedEventListener(targetContainer,topLevelType,eventSystemFlags,capture){
   const listener = dispatchEvent.bind(null,topLevelType,eventSystemFlags,targetContainer)
   if(capture){
       // 事件捕获阶段处理函数。
   }else{
       /* TODO: 重要, 这里进行真正的事件绑定。*/
      targetContainer.addEventListener(topLevelType,listener,false) // document.addEventListener('click',listener,false)
   }
}
这个函数内容虽然不多，但是却非常重要,首先绑定我们的事件统一处理函数 dispatchEvent，绑定几个默认参数，事件类型 topLevelType demo中的click ，还有绑定的容器doucment。然后真正的事件绑定,添加事件监听器addEventListener。 事件绑定阶段完毕
```

7. 总结

    - 在 React，diff DOM 元素类型的 fiber 的 props 的时候， 如果发现是 React 合成事件，比如 onClick，会按照事件系统逻辑单独处理。
    - 根据 React 合成事件类型，找到对应的原生事件的类型，然后调用判断原生事件类型，大部分事件都按照冒泡逻辑处理，少数事件会按照捕获逻辑处理（比如 scroll 事件）。
    - 调用 addTrappedEventListener 进行真正的事件绑定，绑定在 document 上，dispatchEvent 为统一的事件处理函数。
    - 有一点值得注意: 只有上述那几个特殊事件比如 scorll,focus,blur 等是在事件捕获阶段发生的，其他的都是在事件冒泡阶段发生的，无论是 onClick 还是 onClickCapture 都是发生在冒泡阶段

8. EventPlugin， 事件插件可以认为是 React 将不同的合成事件处理函数封装成了一个模块，每个模块只处理自己对应的合成事件，这样不同类型的事件种类就可以在代码上解耦，例如针对 onChange 事件有一个单独的 LegacyChangeEventPlugin 插件来处理，针对 onMouseEnter， onMouseLeave 使用 LegacyEnterLeaveEventPlugin 插件来处理

9. react 执行 diff 操作,标记出哪些 DOM 类型的节点需要添加或者更新
10. 当检测到需要创建一个节点或者更新一个节点的时候,使用 registernationModule 查看一个 prop 是不是一个事件类型,如果是就执行下一步. onClick,onMouseDown
11. 通过 registrationNameDependencied 检查这个 React 事件依赖了哪些原生事件类型.找到原生的事件属性注册到顶层,onClick-click
12. 检查一个或者多个原生事件类型有没有被注册过,如果注册过,就忽略.也就是说,永远都只有一个 click 事件注册到 document 上面
13. 如果这个原生事件类型没有被注册过,就注册这个原生事件到 document 上,回调为 React 提供 dispatchEvent 函数
14. 所有原生事件的 listener 都是 dispatchEvent 函数
15. 同一个类型的事件 react 只会绑定一次,无论写了多少个 onClick,最终反映到 DOM 事件上只会有一个 listener
16. 业务逻辑的 listener 和实际的 DOM 事件压根就没有关系,react 只是会确保原生事件能够被触发,监听到.后续会由 React 来派发我们的事件回调.

**3. react 如何触发事件**
![trigger-event.png](/trigger-event.png)

1. 事件触发处理函数 dispatchEvent,所有类型种类的事件都是绑定为 React 的 dispatchEvent 函数

```js
export function dispatchEventForLegacyPluginEventSystem(
	topLevelType: DOMTopLevelEventType,
	eventSystemFlags: EventSystemFlags,
	nativeEvent: AnyNativeEvent,
	targetInst: null | Fiber
): void {
	const bookKeeping = getTopLevelCallbackBookKeeping(
		topLevelType,
		nativeEvent,
		targetInst,
		eventSystemFlags
	)

	try {
		// Event queue being processed in the same cycle allows
		// `preventDefault`.
		batchedEventUpdates(handleTopLevel, bookKeeping)
	} finally {
		releaseTopLevelCallbackBookKeeping(bookKeeping)
	}
}
//bookkeeping 为事件执行时组件的层级关系存储,如果在事件执行过程中发生组件结构变更,并不会影响事件的触发流程
```

2. React 注册事件的时候,统一的监听器是 dispatchEvent,当我们点击按钮之后,首先执行的是 dispatchEvent,而真正的源对象是 event,被默认绑定为第四个参数

```js
function dispatchEvent(
	topLevelType,
	eventSystemFlags,
	targetContainer,
	nativeEvent
) {
	/* 尝试调度事件 */
	const blockedOn = attemptToDispatchEvent(
		topLevelType,
		eventSystemFlags,
		targetContainer,
		nativeEvent
	)
}
```

3. handleTopLevel:依次执行 plugins 里所有的事件插件,如果一个插件检测到自己需要处理的事件类型时,处理改事件
    - 根据真实的事件源对象,找到 e.target 真实的 dom 元素
    - 根据 dom 元素,找到与他对应的 fiber 对象 targetInst,比如找到 button 对应的 fiber
    - 然后进去 legacy 模式的事件处理系统,在这个模式下,批量更新处理事件

```js
/*
topLevelType -> click
eventSystemFlags -> 1
targetContainer -> document
nativeEvent -> 原生事件的 event 对象
*/
function attemptToDispatchEvent(
	topLevelType,
	eventSystemFlags,
	targetContainer,
	nativeEvent
) {
	/* 获取原生事件 e.target */
	const nativeEventTarget = getEventTarget(nativeEvent)
	/* 获取当前事件，最近的dom类型fiber ，我们 demo中 button 按钮对应的 fiber */
	let targetInst = getClosestInstanceFromNode(nativeEventTarget)
	/* 重要：进入legacy模式的事件处理系统 */
	dispatchEventForLegacyPluginEventSystem(
		topLevelType,
		eventSystemFlags,
		nativeEvent,
		targetInst
	)
	return null
}
```

4. 原生 dom 如何找到对应的 fiber

![find-fiber-ndoe.webp](/find-fiber-ndoe.webp.jpg)

```js
1 .为什么这里要找原生呢,编译模板的时候虚拟dom直接对应这个事件不久好了吗?
2 .点击原生dom的时候不会会dispatch一个事件,那个事件不是会告诉当前触发的taget,编译的时候target和事件对一个映射不就这里不用找了吗?
3 .React 在初始化真实 dom 的时候，用一个随机的 key internalInstanceKey 指针指向了当前dom对应的fiber对象，fiber对象用stateNode指向了当前的dom元素

// 声明随机key
var internalInstanceKey = '__reactInternalInstance$' + randomKey;

// 使用随机key
function getClosestInstanceFromNode(targetNode){
  // targetNode -dom  targetInst -> 与之对应的fiber对象

  var targetInst = targetNode[internalInstanceKey];
}
```

**4. LegacySimpleEventPlugin 插件**

1. 通过原生事件类型决定使用哪个合成事件类型,
2. 如果对象池里面有这个类型的实例,就取出,覆盖他的属性,作为本次派发的事件对象,没有就新建一个
   ![legacy-simple-event-plugin.webp](/legacy-simple-event-plugin.webp.jpg)
3. 从点击的原生事件中找到对应的 DOM 节点,从 DOM 节点中找到一个最近的 React 组件实例,从而找到了一条由这个实例父节点不断向上组成的链条.这个链就是我们要触发合成事件的链
4. 方向触发这条链,模拟捕获阶段,触发所有 props 中含有 onClickCapture 的实例.正向触发这条链,子-父,模拟冒泡阶段,触发所有 props 中含有的 onClick 的实例
5. React 的冒泡和捕获并不是真正 DOM 级别的冒泡和捕获
6. react 会在一个原生事件里触发所有相关节点的 onClick 事件,在执行 onClick 之前 React 会打开批量渲染开关,这个开关会将所有的 setState 变成异步函数
7. 事件只针对原生组件生效，自定义组件不会触发 onClick。--这个不懂啊
8. 我们收到的 event 对象为 React 合成事件,event 对象在事件之外不可以使用

```js
function onClick(event) {
    setTimeout(() => {
        console.log(event.target.value);
    }， 100);
}

```

9 .React 会在派发事件的时候打开批量更新,此时所有的 setState 都变成异步

```js
function onClick(event) {
    setState({a: 1}); // 1
    setState({a: 2}); // 2
//这里两次只会触发一次render,
    setTimeout(() => {
        setState({a: 3}); // 3
        setState({a: 4}); // 4
//这里会触发两次render
    }， 0);
}

```

10. 所有的事件注册到顶层事件上,所以多个 ReactDOM.render 会存在冲突,所以多版本 react 在事件上存在冲突

**5. legacy 事件处理系统与批量更新**

1. batchedEventUpdates 为批量更新的主要函数

```js
/* topLevelType - click事件 ｜ eventSystemFlags = 1 ｜ nativeEvent = 事件源对象  ｜ targetInst = 元素对应的fiber对象  */
function dispatchEventForLegacyPluginEventSystem(
	topLevelType,
	eventSystemFlags,
	nativeEvent,
	targetInst
) {
	/* 从React 事件池中取出一个，将 topLevelType ，targetInst 等属性赋予给事件  */
	const bookKeeping = getTopLevelCallbackBookKeeping(
		topLevelType,
		nativeEvent,
		targetInst,
		eventSystemFlags
	)
	try {
		/* 执行批量更新 handleTopLevel 为事件处理的主要函数 */
		batchedEventUpdates(handleTopLevel, bookKeeping)
	} finally {
		/* 释放事件池 */
		releaseTopLevelCallbackBookKeeping(bookKeeping)
	}
}
```

2. react 通过开关 isBatchingEventUpdate 来控制是否启用批量更新

```js
export function batchedEventUpdates(fn, a) {
	isBatchingEventUpdates = true
	try {
		fn(a)
		// handleTopLevel(bookKeeping)
		//这里里面触发setState,都是在一个同步内,所以setState会被merge为一次操作,生效,批量更新.
	} finally {
		isBatchingEventUpdates = false
	}
}
```

3. handleTopLevel

```js
// 流程简化后
// topLevelType - click
// targetInst - button Fiber
// nativeEvent
function handleTopLevel(bookKeeping) {
	const {
		topLevelType,
		targetInst,
		nativeEvent,
		eventTarget,
		eventSystemFlags,
	} = bookKeeping
	for (let i = 0; i < plugins.length; i++) {
		const possiblePlugin = plugins[i]
		/* 找到对应的事件插件，形成对应的合成event，形成事件执行队列  */
		const extractedEvents = possiblePlugin.extractEvents(
			topLevelType,
			targetInst,
			nativeEvent,
			eventTarget,
			eventSystemFlags
		)
	}
	if (extractedEvents) {
		events = accumulateInto(events, extractedEvents)
	}
	/* 执行事件处理函数 */
	runEventsInBatch(events)
}
```

4. extractEvents 形成事件对象 event 和 事件处理函数队列

```js
const SimpleEventPlugin = {
	extractEvents: function (
		topLevelType,
		targetInst,
		nativeEvent,
		nativeEventTarget
	) {
		const dispatchConfig = topLevelEventsToDispatchConfig.get(topLevelType)
		if (!dispatchConfig) {
			return null
		}
		switch (topLevelType) {
			default:
				EventConstructor = SyntheticEvent
				break
		}
		/* 产生事件源对象 */
		const event = EventConstructor.getPooled(
			dispatchConfig,
			targetInst,
			nativeEvent,
			nativeEventTarget
		)
		const phasedRegistrationNames =
			event.dispatchConfig.phasedRegistrationNames
		const dispatchListeners = []
		const { bubbled, captured } =
			phasedRegistrationNames /* onClick / onClickCapture */
		const dispatchInstances = []
		/* 从事件源开始逐渐向上，查找dom元素类型HostComponent对应的fiber ，收集上面的React合成事件，onClick / onClickCapture  */
		while (instance !== null) {
			const { stateNode, tag } = instance
			if (tag === HostComponent && stateNode !== null) {
				/* DOM 元素 */
				const currentTarget = stateNode
				if (captured !== null) {
					/* 事件捕获 */
					/* 在事件捕获阶段,真正的事件处理函数 */
					const captureListener = getListener(instance, captured)
					if (captureListener != null) {
						/* 对应发生在事件捕获阶段的处理函数，逻辑是将执行函数unshift添加到队列的最前面 */
						dispatchListeners.unshift(captureListener)
						dispatchInstances.unshift(instance)
						dispatchCurrentTargets.unshift(currentTarget)
					}
				}
				if (bubbled !== null) {
					/* 事件冒泡 */
					/* 事件冒泡阶段，真正的事件处理函数，逻辑是将执行函数push到执行队列的最后面 */
					const bubbleListener = getListener(instance, bubbled)
					if (bubbleListener != null) {
						dispatchListeners.push(bubbleListener)
						dispatchInstances.push(instance)
						dispatchCurrentTargets.push(currentTarget)
					}
				}
			}
			instance = instance.return
		}
		if (dispatchListeners.length > 0) {
			/* 将函数执行队列，挂到事件对象event上 */
			event._dispatchListeners = dispatchListeners
			event._dispatchInstances = dispatchInstances
			event._dispatchCurrentTargets = dispatchCurrentTargets
		}
		return event
	},
}

// 形成React事件独有的合成事件源对象,这个对象,保存了整个事件的信息.将作为参数传递给真正的事件处理函数

//然后声明事件可执行队列,按照冒泡和捕获逻辑,从事件源开始逐渐向上,查找dom元素类型hostComponent对应的fiber,收集上面的react合成 事件,例如Onclick,onClickCapture,对于冒泡阶段的事件,push到执行队列后面,捕获阶段的事件onClickCapture,unshift到队列的前面

//最后将事件执行队列,保存到React事件源对象上,等待执行
```

5. React 事件源对象

```js
function SyntheticEvent( dispatchConfig,targetInst,nativeEvent,nativeEventTarget){
  this.dispatchConfig = dispatchConfig;
  this._targetInst = targetInst;
  this.nativeEvent = nativeEvent;
  this._dispatchListeners = null;
  this._dispatchInstances = null;
  this._dispatchCurrentTargets = null;
  this.isPropagationStopped = () => false; /* 初始化，返回为false  */

}
SyntheticEvent.prototype={
    stopPropagation(){ this.isPropagationStopped = () => true;  }, /* React单独处理，阻止事件冒泡函数 */
    preventDefault(){ },  /* React单独处理，阻止事件捕获函数  */
    ...
}
```

**6. runEventInbatch 事件触发**

1. dispatchListenersi 就是我们的事件处理函数,比如 handleClick,所以事件处理函数中,返回 false,并不会阻止浏览器默认行为
2. e.preventDefault() 需要这样才行

```js
function runEventsInBatch(){
    const dispatchListeners = event._dispatchListeners;
    const dispatchInstances = event._dispatchInstances;
    if (Array.isArray(dispatchListeners)) {
    for (let i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) { /* 判断是否已经阻止事件冒泡 */
        break;
      }

      dispatchListeners[i](event)
    }
  }
  /* 执行完函数，置空两字段 */
  event._dispatchListeners = null;
  event._dispatchInstances = null;

dom上所有带有通过jsx绑定的onClick的回调函数都会按顺序（冒泡或者捕获）会放到Event._dispatchListeners 这个数组里，后面依次执行它
}

```

**7. 事件池**

1. 每次用的事件源对象,在事件函数执行完毕之后,可以通过 releaseTopLevelbackBookkeeping 等方法将事件源对象释放到事件池中,这样的好处就是不必在创建事件源对象,下次使用的时候可以直接从事件池中取出一个事件源对象进行复用.执行完毕之后,再次释放到事件池中
2. 总结
    - 首先通过统一处理函数 dispatchEvent,进行批量更新 betchUpdate
    - 然后执行事件对应的处理插件中的 extractEvents,合成事件源对象,每次 React 会从事件源开始,从上遍历类型为 hostCompoent 即 DOM 类型的 fiber,判断 props 中是否有当前事件,比如 onClick,最终形成一个事件执行队列,React 就是用这个队列,来模拟事件捕获,事件源,事件冒泡这一过程.
    - 最后通过 EventsInBatch 执行事件对列,如果发现阻止冒泡,那么 break 跳出旬换,最后重置事件源,返回事件池中,完成整个流程

**react 17 事件系统**

1. 调整将顶层事件绑定在 container 上面,而不是 document,可以解决多版本共存的问题,可以实现微前端方案
2. 对齐原生浏览器事件,支持原生捕获事件
3. onFocus,onBlur 使用 foucsin,blusout 合成
4. onScroll 不在进行冒泡,原生的支持冒泡
5. 取消事件复用,优化不明显了,而且容易用错

**事件委托**

1. 这种如果我们在一个 map 渲染出来的元素上添加点击事件,他是会自动帮我们委托到一个父级元素上面吗?
2. 先委托到一个父级元素上,Event 提供了一个属性叫 target.可以返回事件的目标节点.我们成为事件源,也就是说,target 对象就可以表示为触发当前事件 dom.我们可以根据 dom 进行判断到底是哪个元素触发了事件,根据不同的元素,执行不同的回调方法
3. 优点

    - 减少事件的注册,能够提升整体性能
    - 半路新怎得 dom 节点,相应事件的更新,不需要重新绑定

4. 步骤 1 .jsx 被 render 函数执行

```html
<div onClick="{this.handlerClick}"></div>
```

```js
{
  $$typeof: REACT_ELEMENT_TYPE, type：'div', key: 'key_name', ref: "ref_name",
  props: { class: "class_name", id: "id_name", onClick：fn },
  _owner: ReactCurrentOwner.current
}
```

```js
/**
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 */
```

## 说下 SyntheticEvent 合成事件机制？

-   更好的兼容性和跨平台
-   挂载到 document，减少内存消耗，避免频繁解绑（react17 后挂载到 container）
-   方便时间的统一管理（如事务机制）

## 你对合成事件的理解

| 类型         | 原生事件   | 合成事件               |
| ------------ | ---------- | ---------------------- |
| 命名方式     | 全小写     | 小驼峰                 |
| 事件处理函数 | 字符串     | 函数对象               |
| 阻止默认行为 | 返回 false | event.preventDefault() |

**理解：**

-   React 把事件委托到 document 上（v17 是 container 节点上）
-   先处理原生事件 冒泡到 document 上在处理 react 事件
-   React 事件绑定发生在 reconcile 阶段 会在原生事件绑定前执行
    **优势：**

-   进行了浏览器兼容。顶层事件代理，能保证冒泡一致性(混合使用会出现混乱)

-   默认批量更新

-   避免事件对象频繁创建和回收，react 引入事件池，在事件池中获取和释放对象（react17 中废弃） react17 事件绑定在容器上了

## 我们写的事件是绑定在 dom 上么，如果不是绑定在哪里？

v16 绑定在 document 上，v17 绑定在 container 上

![在这里插入图片描述](https://img-blog.csdnimg.cn/111c8d020ab34acd9e81f0fabbccbac2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## 为什么我们的事件手动绑定 this(不是箭头函数的情况)

合成事件监听函数在执行的时候会丢失上下文

## 为什么不能用 return false 来阻止事件的默认行为？

说到底还是合成事件和原生事件触发时机不一样

## jsx 的渲染过程

jsx 会经过 babel 编译成 createElement 函数的结构，然后 createElement 执行产生虚拟 dom 结构 VNode(就是一个有一定属性的对象结构)，然后通过 render 函数处理 VNode 为虚拟节点，在页面中渲染

## ReactDOM 之 render 源码分析

![render](/render.awebp)

```js
/**
 * 1.把vdom（虚拟DOM）变成真实DOM dom
 * 2.把虚拟DOM上的属性更新（同步）到dom上
 * 3.把此虚拟DOM的儿子们也都变成真实DOM挂载到自己的dom上dom.appendChlid
 * 4.把自己挂载到容器上
 * @param {*} vdom 要渲染的虚拟DOM
 * @param {*} container 要把虚拟DOM转换真实DOM并插入到容器中去
 */
function render(vdom, container) {
	const dom = createDOM(vdom)
	container.appendChild(dom)
}
/**
 * 把虚拟DOM变成真实DOM
 * @param {*} vdom
 */
function createDOM(vdom) {
	//如果是数字或者字符串，就直接返回文本节点
	if (typeof vdom === 'number' || typeof vdom === 'string') {
		return document.createTextNode(vdom)
	}
	//否则就是一个虚拟DOM对象，即React元素
	let { type, props } = vdom
	let dom = null
	if (typeof type === 'function') {
		//自定义函数组件
		return momentFunctionComponent(vdom)
	} else {
		if (type) {
			//原生
			dom = document.createElement(type)
		}
	}
	//使用虚拟DOM的属性更新刚创建出来的真实DOM的属性
	updateProps(dom, props)
	//在这里处理props.children属性
	if (
		typeof props.children === 'string' ||
		typeof props.children === 'number'
	) {
		//如果只有一个子类，并且是数字或者字符串
		dom.textContent = props.children
	} else if (typeof props.children === 'object' && props.children.type) {
		//如果只有一个子类，并且是虚拟dom元素
		render(props.children, dom)
		//如果是数组
	} else if (Array.isArray(props.children)) {
		reconcileChildren(props.children, dom)
	} else {
		console.log('baocuo')
		dom.textContent = props.children ? props.children.toString() : ''
	}
	return dom
}
/**
 * 把一个类型为自定义函数组件的虚拟DOM转换为真实DOM并返回
 * @param {*} vdom 类型为自定义函数组件的虚拟DOM
 */
function momentFunctionComponent(vdom) {
	let { type: FunctionComponent, props } = vdom
	let renderVdom = FunctionComponent(props)
	return createDOM(renderVdom)
}
/**
 * 遍历数组
 * @param {*} childrenVdom 子类们的虚拟dom
 * @param {*} parentDOM 父类的真实DOM
 */
function reconcileChildren(childrenVdom, parentDOM) {
	for (let i = 0; i < childrenVdom.length; i++) {
		let childVdom = childrenVdom[i]
		render(childVdom, parentDOM)
	}
}
/**
 * 使用虚拟DOM的属性更新刚创建出来的真实DOM的属性
 * @param {*} dom 真实DOM
 * @param {*} newProps 新属性对象
 */
function updateProps(dom, newProps) {
	for (let key in newProps) {
		if (key === 'children') continue
		if (key === 'style') {
			let styleObj = newProps.style
			for (let attr in styleObj) {
				dom.style[attr] = styleObj[attr]
			}
		} else {
			//js支持dom.title='设置'
			dom[key] = newProps[key]
		}
	}
}
const ReactDOM = { render }
export default ReactDOM
```

## dom 的更新过程

diff 算法对比新旧 VNode，如果新旧 VNode 不一样就调用 render 重新渲染视图的过程

区别就在于多出了一层虚拟 DOM 作为缓冲层。这个缓冲层带来的利好是：

当 DOM 操作（渲染更新）比较频繁时，
它会先将前后两次的虚拟 DOM 树进行对比，
定位出具体需要更新的部分，生成一个“补丁集”，
最后只把“补丁”打在需要更新的那部分真实 DOM 上，实现精准的“差量更新”。

## diff 算法流程

## React 16 在所有情况下都是异步渲染的吗？
