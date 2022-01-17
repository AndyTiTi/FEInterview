---
title: 第二章
---

## Redux

Redux 通过提供一个统一的状态容器，使得数据能够自由而有序地在任意组件之间穿梭，这就是 Redux 实现组件间通信的思路.

- store：推送数据的仓库
- reducer：帮助 store 处理数据的方法（初始化、修改、删除）
- actions：数据更新的指令
- react 组件（UI）：订阅 store 中的数据

![redux](/redux.gif)

## 实现一个 redux?

实现 createStore 的功能，关键点发布订阅的功能，以及取消订阅的功能.

## 用 ts 实现一个 redux?

## React.lazy 的原理是啥?

## react 里有动态加载的 api 吗?

React.lazy

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

## 为什么需要 React-Hooks

-   告别难以理解的 Class；
-   解决业务逻辑难以拆分的问题；
-   使状态逻辑复用变得简单可行；
-   函数组件从设计思想上来看，更加契合 React 的理念.

## 为什么 hooks 不能写在条件判断中

hook 会按顺序存储在链表中，如果写在条件判断中，就没法保持链表的顺序

## 说一下 getDerivedStateFromProps

getDerivedStateFromProps 会在调用 render 方法之前调用，即在渲染 DOM 元素之前会调用，并且在初始挂载及后续更新时都会被调用. 该方法返回一个对象用于更新 state，如果返回 null 则不更新任何内容.

getDerivedStateFromProps 的存在只有一个目的：让组件在 props 变化时更新 state. state 的值在任何时候都取决于 props.

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

### React 性能优化的主要方向

1.  减少重新 render 的次数.因为在 React 里最重(花时间最长)的一块就是 reconction(简单的可以理解为 diff)，如果不 render，就不会 reconction.
1.  减少计算的量.主要是减少重复计算，对于函数式组件来说，每次 render 都会重新从头开始执行函数调用.
1.  使用 React Fragments 避免额外标记
    使用 Fragments 减少了包含的额外标记数量，这些标记只是为了满足在 React 组件中具有公共父级的要求。`<> <div></div> <div></div> </>`
1.  避免 componentWillMount()中的异步请求
    由于 API 调用是异步的，因此组件在调用 render 函数之前不会等待 API 返回数据。于是在初始渲染中渲染组件时没有任何数据。
    这样一开始渲染组件没有数据，然后检索数据，调用 setState，还得重新渲染组件。在 componentWillMount 阶段进行 AJAX 调用没有好处可言。
    **注意：**React 16.3 不推荐使用 componentWillMount。如果你使用的是最新版本的 React，请避免使用这个生命周期事件。
1.  不要使用内联函数定义
    如果我们使用内联函数，则每次调用“render”函数时都会创建一个新的函数实例; `<input type="button" onClick={(e) => { this.setState({inputValue: e.target.value}) }} value="Click For Inline Function" />`
1.  类组件:
    使用的 React 优化 API 主要是：shouldComponentUpdate 和 PureComponent，这两个 API 所提供的解决思路都是为了减少重新 render 的次数，主要是减少父组件更新而子组件也更新的情况
1.  函数式组件：React.memo 这个效果基本跟类组件里面的 PureComponent 效果极其类似
1.  懒加载组件

    ```js
    import React, { lazy, Suspense } from 'react'
    export default class CallingLazyComponents extends React.Component {
    	render() {
    		var ComponentToLazyLoad = null

    		if (this.props.name == 'Mayank') {
    			ComponentToLazyLoad = lazy(() => import('./mayankComponent'))
    		} else if (this.props.name == 'Anshul') {
    			ComponentToLazyLoad = lazy(() => import('./anshulComponent'))
    		}
    		return (
    			<div>
    				<h1>This is the Base User: {this.state.name}</h1>
    				<Suspense fallback={<div>Loading...</div>}>
    					<ComponentToLazyLoad />
    				</Suspense>
    			</div>
    		)
    	}
    }
    ```

1.  渲染列表时加 key
1.  自定义事件、DOM 事件及时销毁
1.  合理使用一部组件
1.  减少函数 bind this 的次数
1.  合理使用 SCU PureComponent
1.  合适使用 Immutable.js
1.  webpack 层面的优化
1.  前端通用的性能优化，如图片懒加载
1.  使用 SSR

### 为什么用 key

-   必须用 key，且不能是 index 或 random
-   diff 算法中通过 tag 和 key 来判断，是否是 sameNode
-   减少渲染次数，提升渲染性能

### React.memo 高级用法

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
	if (prevProps.xxx !== nextProps.xxx) {
		return false
	}
	return true
}
export default React.memo(MyComponent, areEqual)
```

如果你有在类组件里面使用过 `shouldComponentUpdate()`这个方法，你会对 React.memo 的第二个参数非常的熟悉，不过值得注意的是，如果 props 相等，areEqual 会返回 true；如果 props 不相等，则返回 false.这与 shouldComponentUpdate 方法的返回值相反

### useCallback

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

> 问题：当父组件重新渲染的时候，传递给子组件的 props 发生了改变，再看传递给 Child 组件的就两个属性，一个是 name，一个是 onClick ，name 是传递的常量，不会变，变的就是 onClick 了，为什么传递给 onClick 的 callback 函数会发生改变呢?在文章的开头就已经说过了，在函数式组件里每次重新渲染，函数组件都会重头开始重新执行，那么这两次创建的 callback 函数肯定发生了改变，所以导致了子组件重新渲染.

> 解决：在函数没有改变的时候，重新渲染的时候保持两个函数的引用一致，这个时候就要用到 useCallback 这个 API 了

### useMemo

useMemo() 基本用法如下：

> const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

useMemo() 返回的是一个 memoized 值，只有当依赖项（比如上面的 a,b 发生变化的时候，才会重新计算这个 memoized 值）

memoized 值不变的情况下，不会重新触发渲染逻辑。

说起渲染逻辑，需要记住的是 useMemo() 是在 render 期间执行的，所以不能进行一些额外的副操作，比如网络请求等。

React 的性能优化方向主要是两个：一个是减少重新 render 的次数(或者说减少不必要的渲染)，另一个是减少计算的量.

:::tip
前面介绍的 React.memo 和 useCallback 都是为了减少 re-render 的次数; 而在某些场景下，我们只是希望 component 的部分不要进行 re-render，而不是整个 component 不要 re-render，也就是要实现 `局部 Pure` 功能.
:::

对于如何减少计算的量，就是 useMemo 来做的，接下来我们看例子.

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

就算是一个看起来很简单的组件，也有可能产生性能问题，通过这个最简单的例子来看看还有什么值得优化的地方.

首先我们把 expensiveFn 函数当做一个计算量很大的函数(比如你可以把 i 换成 10000000)，然后当我们每次点击 +1 按钮的时候，都会重新渲染组件，而且都会调用 expensiveFn 函数并输出 49995000.由于每次调用 expensiveFn 所返回的值都一样，所以我们可以想办法将计算出来的值缓存起来，每次调用函数直接返回缓存的值，这样就可以做一些性能优化.

### useMemo 做计算结果缓存

针对上面产生的问题，就可以用 useMemo 来缓存 expensiveFn 函数执行后的值.

首先介绍一下 useMemo 的基本的使用方法，详细的使用方法可见官网[3]：

```javascript
function computeExpensiveValue() {
	// 计算量很大的代码
	return xxx
}

const memoizedValue = useMemo(computeExpensiveValue, [a, b])
```

useMemo 的第一个参数就是一个函数，这个函数返回的值会被缓存起来，同时这个值会作为 useMemo 的返回值，第二个参数是一个数组依赖，如果数组里面的值有变化，那么就会重新去执行第一个参数里面的函数，并将函数返回的值缓存起来并作为 useMemo 的返回值 .

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

执行上面的代码，然后现在可以观察无论我们点击 +1 多少次，只会输出一次 49995000，这就代表 expensiveFn 只执行了一次，达到了我们想要的效果.

### 小结

useMemo 的使用场景主要是用来缓存计算量比较大的函数结果，可以避免不必要的重复计算，有过 vue 的使用经历同学可能会觉得跟 Vue 里面的计算属性有异曲同工的作用.

## setState 是同步的还是异步的

**多次传入相同的对象，执行时会合并，传入函数不会被合并**

legacy 模式下：命中 batchedUpdates 时是异步 未命中 batchedUpdates 时是同步的；setTimeout 或者原生事件是同步的

concurrent 模式下：都是异步的

![image](/setState.png)

-   setState 无所谓同步异步
-   看是否能命中 batchUpdate 机制
-   判断 isBatchingUpdates

### 哪些能触发 batchUpdate?

生命周期和它调用的函数
react 中注册的事件和它调用的函数
react 可以管理的入口

### 哪些不能触发 batchUpdate?

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

新的 Fiber 架构能在 scheduler 的调度下实现暂停继续，排列优先级，Lane 模型能使 Fiber 节点具有优先级，在高优先级的任务打断低优先级的任务时，低优先级的更新可能会被跳过，所有以上生命周期可能会被执行多次，和之前版本的行为不一致.

## React 单向数据流

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
-   对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象.如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题.但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象.

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
            //eventTypes是一个对象，对象保存了原生事件名和对应的配置项dispatchConfig的映射关系.由于v16React的事件是统一绑定在document上的，React用独特的事件名称比如onClick和onClickCapture，来说明我们给绑定的函数到底是在冒泡事件阶段，还是捕获事件阶段执行.
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

4. diffProperties 函数在 diff props 如果发现是合成事件(onClick) 就会调用 legacyListenToEvent 函数.注册事件监听器.肯定是合成事件吧

```js
//  registrationName -> onClick 事件
//  mountAt -> document or container
function legacyListenToEvent(registrationName，mountAt){
   const dependencies = registrationNameDependencies[registrationName]; // 根据 onClick 获取  onClick 依赖的事件数组 [ 'click' ].
    for (let i = 0; i < dependencies.length; i++) {
    const dependency = dependencies[i];
    //这个经过多个函数简化，如果是 click 基础事件，会走 legacyTrapBubbledEvent ,而且都是按照冒泡处理
     legacyTrapBubbledEvent(dependency, mountAt);
  }
}

```

5. legacyTrapBubbledEvent 就是执行将绑定真正的 dom 事件的函数 legacyTrapBubbledEvent(冒泡处理).

```js
1. 先找到React合成事件对应的原生事件集合onClick-click,onCheng-[blur,change,input,keydown,keyup],然后遍历依赖项的数组,绑定事件

2. 大部分事件都是用的冒泡,特殊的事件用的是捕获比如scroll事件
case TOP_SCROLL: {                                // scroll 事件
    legacyTrapCapturedEvent(TOP_SCROLL, mountAt); // legacyTrapCapturedEvent 事件捕获处理.
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
       // 事件捕获阶段处理函数.
   }else{
       /* TODO: 重要, 这里进行真正的事件绑定.*/
      targetContainer.addEventListener(topLevelType,listener,false) // document.addEventListener('click',listener,false)
   }
}
这个函数内容虽然不多，但是却非常重要,首先绑定我们的事件统一处理函数 dispatchEvent，绑定几个默认参数，事件类型 topLevelType demo中的click ，还有绑定的容器doucment.然后真正的事件绑定,添加事件监听器addEventListener. 事件绑定阶段完毕
```

7. 总结

    - 在 React，diff DOM 元素类型的 fiber 的 props 的时候， 如果发现是 React 合成事件，比如 onClick，会按照事件系统逻辑单独处理.
    - 根据 React 合成事件类型，找到对应的原生事件的类型，然后调用判断原生事件类型，大部分事件都按照冒泡逻辑处理，少数事件会按照捕获逻辑处理（比如 scroll 事件）.
    - 调用 addTrappedEventListener 进行真正的事件绑定，绑定在 document 上，dispatchEvent 为统一的事件处理函数.
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
7. 事件只针对原生组件生效，自定义组件不会触发 onClick.--这个不懂啊
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

## 说下 SyntheticEvent 合成事件机制?

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

-   进行了浏览器兼容.顶层事件代理，能保证冒泡一致性(混合使用会出现混乱)

-   默认批量更新

-   避免事件对象频繁创建和回收，react 引入事件池，在事件池中获取和释放对象（react17 中废弃） react17 事件绑定在容器上了

## 我们写的事件是绑定在 dom 上么，如果不是绑定在哪里?

v16 绑定在 document 上，v17 绑定在 container 上

![在这里插入图片描述](https://img-blog.csdnimg.cn/111c8d020ab34acd9e81f0fabbccbac2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## 为什么我们的事件手动绑定 this(不是箭头函数的情况)

合成事件监听函数在执行的时候会丢失上下文

## 为什么不能用 return false 来阻止事件的默认行为?

说到底还是合成事件和原生事件触发时机不一样

## JSX 的渲染过程

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

区别就在于多出了一层虚拟 DOM 作为缓冲层.这个缓冲层带来的利好是：

当 DOM 操作（渲染更新）比较频繁时，
它会先将前后两次的虚拟 DOM 树进行对比，
定位出具体需要更新的部分，生成一个“补丁集”，
最后只把“补丁”打在需要更新的那部分真实 DOM 上，实现精准的“差量更新”.

## React diff 算法流程

传统 diff 算法的复杂度为 O(n^3)，显然这是无法满足性能要求的。**React 通过制定大胆的策略，将 O(n^3) 复杂度的问题转换成 O(n) 复杂度的问题。**

diff 策略

1. Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
1. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
1. 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。

**基于以上三个前提策略，React 分别对 tree diff、component diff 以及 element diff 进行算法优化，事实也证明这三个前提策略是合理且准确的，它保证了整体界面构建的性能。**

-   tree diff

    基于策略一，React 对树的算法进行了简洁明了的优化，即对树进行分层比较，两棵树只会对同一层次的节点进行比较。

    既然 DOM 节点跨层级的移动操作少到可以忽略不计，针对这一现象，React 通过 updateDepth 对 Virtual DOM 树进行层级控制，只会对相同颜色方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

    _如果出现了 DOM 节点跨层级的移动操作，React diff 会有怎样的表现呢？_ 是的，对此我也好奇不已，不如试验一番。

    如下图，A 节点（包括其子节点）整个被移动到 D 节点下，由于 React 只会简单的考虑同层级节点的位置变换，而对于不同层级的节点，只有创建和删除操作。当根节点发现子节点中 A 消失了，就会直接销毁 A；当 D 发现多了一个子节点 A，则会创建新的 A（包括子节点）作为其子节点。此时，React diff 的执行情况：create A -> create B -> create C -> delete A。
    ![](/react.diff.jpg)

    由此可发现，当出现节点跨层级移动时，并不会出现想象中的移动操作，而是以 A 为根节点的树被整个重新创建，这是一种影响 React 性能的操作，因此 React 官方建议不要进行 DOM 节点跨层级的操作。

    > 注意：在开发组件时，保持稳定的 DOM 结构会有助于性能的提升。例如，可以通过 CSS 隐藏或显示节点，而不是真的移除或添加 DOM 节点。

-   component diff

    React 是基于组件构建应用的，对于组件间的比较所采取的策略也是简洁高效。

    -   如果是同一类型的组件，按照原策略继续比较 virtual DOM tree。
    -   如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点
    -   对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切的知道这点那可以节省大量的 diff 运算时间，因此 React 允许用户通过 shouldComponentUpdate() 来判断该组件是否需要进行 diff。

    如下图，当 component D 改变为 component G 时，即使这两个 component 结构相似，一旦 React 判断 D 和 G 是不同类型的组件，就不会比较二者的结构，而是直接删除 component D，重新创建 component G 以及其子节点。虽然当两个 component 是不同类型但结构相似时，React diff 会影响性能，但正如 React 官方博客所言：不同类型的 component 是很少存在相似 DOM tree 的机会，因此这种极端因素很难在实现开发过程中造成重大影响的。

    ![](/react.component.diff.jpg)

-   element diff

## React 类组件 this 绑定问题

:::tip
[真正的原因在 JavaScript 不在 React](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes#用原型和静态方法绑定_this)

当调用静态或原型方法时没有指定 this 的值，那么方法内的 this 值将被置为 undefined.即使你未设置 "use strict" ，因为 class 体内部的代码总是在严格模式下执行.
:::

```js
class Animal {
	speak() {
		return this
	}
	static eat() {
		return this
	}
}

let obj = new Animal()
obj.speak() // Animal {}
let speak = obj.speak
speak() // undefined

Animal.eat() // class Animal
let eat = Animal.eat
eat() // undefined
```

如果上述代码通过传统的基于函数的语法来实现，那么依据初始的 this 值，在非严格模式下方法调用会发生自动装箱.若初始值是 undefined，this 值会被设为全局对象.

严格模式下不会发生自动装箱，this 值将保留传入状态.

```js
function Animal() {}

Animal.prototype.speak = function () {
	return this
}

Animal.eat = function () {
	return this
}

let obj = new Animal()
let speak = obj.speak
speak() // global object

let eat = Animal.eat
eat() // global object
```

> 在 constructor 中绑定是最佳和最高效的地方，因为我们在初始化 class 时已经将函数绑定，让 this 指向正确的上下文.

```js
class Foo {
	constructor(name) {
		this.name = name
		this.display = this.display.bind(this)
	}
	display() {
		console.log(this.name)
	}
}
var foo = new Foo('coco')
foo.display() // coco
var display = foo.display
display() // coco
```

**不用 bind 绑定方式**
当然，实际写 React Component 还有其他的一些方式来使 this 指向这个 class :

最常用的 public class fields

```js
class Foo extends React.Component {
	handleClick = () => {
		console.log(this)
	}

	render() {
		return (
			<button type="button" onClick={this.handleClick}>
				Click Me
			</button>
		)
	}
}
```

这是因为我们使用 public class fields 语法，handleClick 箭头函数会自动将 this 绑定在 Foo 这个 class, 具体就不做探究.

**箭头函数**

```js
class Foo extends React.Component {
	handleClick(event) {
		console.log(this)
	}

	render() {
		return (
			<button type="button" onClick={(e) => this.handleClick(e)}>
				Click Me
			</button>
		)
	}
}
```

这是因为在 ES6 中，箭头函数 this 默认指向函数的宿主对象(或者函数所绑定的对象).

## 服务端渲染 SSR

### React16 中 render 和 hydrate 的区别

#### render()

render 话不多说就是渲染的意思，官方解释：

-   在提供的 container 里渲染一个 React 元素，并返回对该组件的引用（或者针对无状态组件返回 null）.
-   如果 React 元素之前已经在 container 里渲染过，这将会对其执行更新操作，并仅会在必要时改变 DOM 以映射最新的 React 元素
-   如果提供了可选的回调函数，该回调将在组件被渲染或更新之后被执行.

hydrate()
与 render() 相同，但它用于在 ReactDOMServer 渲染的容器中对 HTML 的内容进行 hydrate 操作.

hydrate 基本上用于 SSR（服务器端渲染）. SSR 为您提供了从服务器附带的框架或 HTML 标记，因此，第一次在页面加载时不为空白，搜索引擎机器人可以将其索引为 SEO（SSR 的一个用例）. 因此，hydrate 会将 JS 添加到您的页面或要应用 SSR 的节点. 这样您的页面才能响应用户执行的事件.

渲染用于在客户端浏览器 Plus 上渲染组件，如果尝试将 hydrate 替换为 render，则会收到警告，提示 render 已弃用，在 SSR 情况下无法使用. 由于它比水合物慢，因此将其除去.

#### 为什么在服务端渲染的时候不采用 render?

在 react15 中，当服务端和客户端渲染不一致时，render 会做 dom patch，使得最后的渲染内容和客户端一致，否则这会使得客户端代码陷入混乱之中，如下的代码就会挂掉.
