---
title: 第一章
---

## React 生命周期

![react 15](/react15.jpg)
![react 16](/react16.jpg)

![在这里插入图片描述](https://img-blog.csdnimg.cn/f9de7c8334ae42d9a8121e0bd1ab505c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

### React 父子组件生命周期

> mountComponent 负责管理生命周期中的 mounting 阶段的方法调用

mountComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillMount 在其子组件的 componentWillMount 之前调用，而父组件的 componentDidMount 在其子组件的 componentDidMount 之后调用

> updateComponent 负责管理生命周期中的 updating 阶段的方法调用

updateComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillUpdate 在其子组件的 componentWillUpdate 之前调用，而父组件的 componentDidUpdate 在其子组件的 componentDidUpdate 之后调用

<div style="display:flex">
<img src="https://img-blog.csdnimg.cn/133f6cfb49314dab8d8638f324f2f487.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16" alt="图片替换文本" width="500" />
<img src="https://img-blog.csdnimg.cn/b22e942c99eb4a67a44f2866dc84fba4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16" alt="图片替换文本" width="500" />
</div>

## React 事件机制

[一文吃透 React 事件机制原理](https://toutiao.io/posts/28of14w/preview)

## React 三种模式

![](/reactmode.webp.jpg)
![](/mode-diff.webp.jpg)

## React Fiber 架构

React16 引入了 fiber 的概念，fiber 也称纤程。

引入 fiber 后的 reconciler 称为 Fiber Reconciler，fiber 包含了多种含义:

**作为一个工作单元**

fiber 是协调过程中工作单元。React16 后，协调的过程从递归变成了可以中断的循环过程。

```js
// 执行协调的循环
function workLoopConcurrent() {
	// Perform work until Scheduler asks us to yield
	//shouldYield为Scheduler提供的函数， 通过 shouldYield 返回的结果判断当前是否还有可执行下一个工作单元的时间
	while (workInProgress !== null && !shouldYield()) {
		workInProgress = performUnitOfWork(workInProgress)
	}
}
```

每当 React 执行完一个工作单元便会去检查当前是否还有可执行下一个工作单元的时间，若有则继续执行下一个工作单元，如果没有更多得时间则将控制权归还给浏览器，并在浏览器空闲时再恢复渲染。

**作为一种数据结构**

fiber 也可以认为是是一种数据结构，React 将 VDOM tree 由 n 叉树的结构改造成了由 fiber 节点组成的**多条相交的链表**结构。我们来看看 fiber 节点的属性定义：

```js
function FiberNode(
	tag: WorkTag,
	pendingProps: mixed,
	key: null | string,
	mode: TypeOfMode
) {
	// 作为静态数据结构的属性
	this.tag = tag
	this.key = key
	this.elementType = null
	this.type = null
	this.stateNode = null

	// 用于连接其他Fiber节点形成Fiber树
	// 指向父级Fiber节点
	this.return = null
	// 指向子Fiber节点
	this.child = null
	// 指向右边第一个兄弟Fiber节点
	this.sibling = null
	this.index = 0

	this.ref = null

	// 作为动态的工作单元的属性
	this.pendingProps = pendingProps
	this.memoizedProps = null
	this.updateQueue = null
	this.memoizedState = null
	this.dependencies = null

	this.mode = mode

	this.effectTag = NoEffect
	this.nextEffect = null

	this.firstEffect = null
	this.lastEffect = null

	// 调度优先级相关
	this.lanes = NoLanes
	this.childLanes = NoLanes

	// 指向该fiber在另一次更新时对应的fiber，下面的双缓冲部分会详细介绍
	this.alternate = null
}
```

这三个属性使 fiber 节点处于三个单向链表当中：

-   child 链表（子节点链表）
-   sibling 链表（兄弟节点链表）
-   return 链表（父节点链表）

各个 fiber 节点的所处的链表相交组合，便构成了 fiber tree。

我们来看一个简单的例子：

```js
function App() {
  return (
    <div>
      father
      <div>child</>
    </div>
  )
}
```

对应的 fiber tree 为：

![fiber-tree](/fiber-tree1.webp.jpg)

**可优雅的进行中断**

我们再来看看引入 fiber 后，fiber tree 的遍历过程：（不需要完全看懂，只需要看懂遍历的流程就好）

```js
// 执行协调的循环
function workLoopConcurrent() {
	// Perform work until Scheduler asks us to yield
	//shouldYield为Scheduler提供的函数， 通过 shouldYield 返回的结果判断当前是否还有可执行下一个工作单元的时间
	while (workInProgress !== null && !shouldYield()) {
		workInProgress = performUnitOfWork(workInProgress)
	}
}

function performUnitOfWork(unitOfWork: Fiber): void {
	//...

	let next
	//...
	//对当前节点进行协调，如果存在子节点，则返回子节点的引用
	next = beginWork(current, unitOfWork, subtreeRenderLanes)

	//...

	//如果无子节点，则代表当前的child链表已经遍历完
	if (next === null) {
		// If this doesn't spawn new work, complete the current work.
		//此函数内部会帮我们找到下一个可执行的节点
		completeUnitOfWork(unitOfWork)
	} else {
		workInProgress = next
	}

	//...
}

function completeUnitOfWork(unitOfWork: Fiber): void {
	let completedWork = unitOfWork
	do {
		//...

		//查看当前节点是否存在兄弟节点
		const siblingFiber = completedWork.sibling
		if (siblingFiber !== null) {
			// If there is more work to do in this returnFiber, do that next.
			//若存在，便把siblingFiber节点作为下一个工作单元，继续执行performUnitOfWork，执行当前节点并尝试遍历当前节点所在的child链表
			workInProgress = siblingFiber
			return
		}
		// Otherwise, return to the parent
		//如果不存在兄弟节点，则回溯到父节点，尝试查找父节点的兄弟节点
		completedWork = returnFiber
		// Update the next thing we're working on in case something throws.
		workInProgress = completedWork
	} while (completedWork !== null)

	//...
}
```

![](/fiber-progress.png)

可以看到，React 采用 child 链表（子节点链表）、sibling 链表（兄弟节点链表）、 return 链表（父节点链表）多条单向链表遍历的方式来代替 n 叉树的深度优先遍历。在协调的过程中，我们不再需要依赖系统调用栈。因为单向链表遍历是严格按照链表方向，同时每个节点都拥有唯一的下一节点，所以在中断时，我们不需要维护整理调用栈，以便恢复中断。我们只需要保护对中断时所对应的 fiber 节点的引用，在恢复中断时就可以继续遍历下一个节点（不管下一个节点是 child 还是 sibling 还是 return）。

### Fiber 你需要知道的基础知识

1. <a href="./browser.html#浏览器刷新率" target="_blank">浏览器刷新率</a>
1. <a href="./browser.html#什么是时间分片-time-slicing" target="_blank">时间分片（Time Slicing）</a>

Fiber 架构的应用目的，按照 React 官方的说法，是实现“增量渲染”。所谓“增量渲染”，通俗来说就是把一个渲染任务分解为多个渲染任务，而后将其分散到多个帧里面。不过严格来说，增量渲染其实也只是一种手段，实现增量渲染的目的，是为了实现任务的可中断、可恢复，并给不同的任务赋予不同的优先级，最终达成更加顺滑的用户体验。

### Fiber 双缓存

现在我们知道了 Fiber 可以保存真实的 dom，真实 dom 对应在内存中的 Fiber 节点会形成 Fiber 树，这颗 Fiber 树在 react 中叫 current Fiber，也就是当前 dom 树对应的 Fiber 树，而正在构建 Fiber 树叫 workInProgress Fiber，这两颗树的节点通过 alternate 相连.

```js
function App() {
	return (
		<>
			<h1>
				<p>count</p> xiaochen
			</h1>
		</>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
```

![](/fiber1.webp.jpg)
构建 workInProgress Fiber 发生在 createWorkInProgress 中，它能创建或者复用 Fiber

```js
//ReactFiber.old.js
export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
	let workInProgress = current.alternate
	if (workInProgress === null) {
		//区分是在mount时还是在update时
		workInProgress = createFiber(
			current.tag,
			pendingProps,
			current.key,
			current.mode
		)
		workInProgress.elementType = current.elementType
		workInProgress.type = current.type
		workInProgress.stateNode = current.stateNode

		workInProgress.alternate = current
		current.alternate = workInProgress
	} else {
		workInProgress.pendingProps = pendingProps //复用属性
		workInProgress.type = current.type
		workInProgress.flags = NoFlags

		workInProgress.nextEffect = null
		workInProgress.firstEffect = null
		workInProgress.lastEffect = null

		//...
	}

	workInProgress.childLanes = current.childLanes //复用属性
	workInProgress.lanes = current.lanes

	workInProgress.child = current.child
	workInProgress.memoizedProps = current.memoizedProps
	workInProgress.memoizedState = current.memoizedState
	workInProgress.updateQueue = current.updateQueue

	const currentDependencies = current.dependencies
	workInProgress.dependencies =
		currentDependencies === null
			? null
			: {
					lanes: currentDependencies.lanes,
					firstContext: currentDependencies.firstContext,
			  }

	workInProgress.sibling = current.sibling
	workInProgress.index = current.index
	workInProgress.ref = current.ref

	return workInProgress
}
```

-   在 mount 时：

    会创建 fiberRoot 和 rootFiber，然后通过 jsx 对象（调用 createElement 的结果）调用 createFiberFromElement 生成 Fiber 节点，节点连接成 current Fiber 树。
    ![](/fiber-mount.webp.jpg)

-   在 update 时：
    会根据新的状态形成的 jsx（ClassComponent 的 render 或者 FuncComponent 的返回值）和 current Fiber 对比（diff 算法）形成一颗叫 workInProgress 的 Fiber 树，然后将 fiberRoot 的 current 指向 workInProgress 树，此时 workInProgress 就变成了 current Fiber。fiberRoot：指整个应用的根节点，只存在一个
    :::tip
    fiberRoot：指整个应用的根节点，只存在一个
    rootFiber：ReactDOM.render 或者 ReactDOM.unstable_createRoot 创建出来的应用的节点，可以存在多个。
    :::

我们现在知道了存在 current Fiber 和 workInProgress Fiber 两颗 Fiber 树，Fiber 双缓存指的就是，在经过 reconcile（diff）形成了新的 workInProgress Fiber 然后将 workInProgress Fiber 切换成 current Fiber 应用到真实 dom 中，存在双 Fiber 的好处是在内存中形成视图的描述，在最后应用到 dom 中，减少了对 dom 的操作。

**现在来看看 Fiber 双缓存创建的过程图：**

-   mount 时

    1. 刚开始只创建了 fiberRoot 和 rootFiber 两个节点
       ![](/fiber-mount1.webp.jpg)
    2. 然后根据 jsx 创建 workInProgress Fiber
       ![](/fiber-mount2.webp.jpg)
    3. 把 workInProgress Fiber 切换成 current Fiber
       ![](/fiber-mount3.webp.jpg)

-   update 时

    1. 根据 current Fiber 创建 workInProgress Fiber
       ![](/fiber-update1.webp.jpg)
    2. 把 workInProgress Fiber 切换成 current Fiber
       ![](/fiber-update2.webp.jpg)

### Fiber 是如何实现更新过程可控？

Fiber 架构中的“可中断”“可恢复”到底是如何实现的？

更新过程的可控主要体现在下面几个方面：

-   任务拆分
-   任务挂起、恢复、终止
-   任务具备优先级

1. 任务拆分

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

2. 挂起、恢复、终止

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
    	//beginWork(currentFiber) //找到儿子，并通过链表的方式挂到currentFiber上，没有儿子就找后面那个兄弟
    	//有儿子就返回儿子
    	if (currentFiber.child) {
    		return currentFiber.child
    	}
    	//如果没有儿子，则找兄弟节点
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

3. 任务具备优先级【优先级调度是如何实现的?】
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

**总结**

React Fiber 的出现相当于是在更新过程中引进了一个中场指挥官，负责掌控更新过程，足球世界里管这叫前腰。抛开带来的性能和效率提升外，这种“化整为零”和任务编排的思想，可以应用到我们平时的架构设计中。

## React 16 如果没有开启 Concurrent 模式，那它还能叫 Fiber 架构吗？

这个问题很有意思，从动机上来看，Fiber 架构的设计确实主要是为了 Concurrent 而存在。

在 React 16，包括已发布的 React 17 版本中，不管是否是 Concurrent，整个数据结构层面的设计、包括贯穿整个渲染链路的处理逻辑，已经完全用 Fiber 重构了一遍。站在这个角度来看，Fiber 架构在 React 中并不能够和异步渲染画严格的等号，它是一种同时兼容了同步渲染与异步渲染的设计。
## Fiber 树和传统虚拟 DOM 树有何不同？

## React 的渲染流程

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
-   不管是在首次渲染还是更新状态的时候，这些渲染的任务都会经过 Scheduler 的调度，Scheduler 会根据任务的优先级来决定将哪些任务优先进入 render 阶段，比如用户触发的更新优先级非常高，如果当前正在进行一个比较耗时的任务，则这个任务就会被用户触发的更新打断，在 Scheduler 中初始化任务的时候会计算一个过期时间，不同类型的任务过期时间不同，优先级越高的任务，过期时间越短，优先级越低的任务，过期时间越长。

    在最新的 Lane 模型中，则可以更加细粒度的根据二进制 1 的位置，来决定任务的优先级，通过二进制的融合和相交，判断任务的优先级是否足够在此次 render 的渲染。

    Scheduler 会分配一个时间片给需要渲染的任务，如果是一个非常耗时的任务，如果在一个时间片之内没有执行完成，则会从当前渲染到的 Fiber 节点暂停计算，让出执行权给浏览器，在之后浏览器空闲的时候从之前暂停的那个 Fiber 节点继续后面的计算，这个计算的过程就是计算 Fiber 的差异，并标记副作用。

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

## 快速搞定虚拟 DOM 的两个“大问题”

1. 挂载阶段
   React 将结合 JSX 的描述，构建出虚拟 DOM 树，然后通过 ReactDOM.render 实现虚拟 DOM 到真实 Dom 的映射（触发渲染流水线）
2. 更新阶段
   页面的变化会先作用于虚拟 DOM，虚拟 DOM 将在 JS 层借助算法先对比出具体有哪些真实 DOM 需要被改变，然后再将这些改变作用于真实 DOM

## 实现一个搜索推荐组件会考虑哪些?
