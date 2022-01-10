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

## Fiber 是什么，它为什么能提高性能

Fiber 是一个 js 对象，能承载节点信息、优先级、updateQueue，同时它还是一个工作单元。

-   Fiber 双缓存可以在构建好 wip Fiber 树之后切换成 current Fiber，内存中直接一次性切换，提高了性能

-   Fiber 的存在使异步可中断的更新成为了可能，作为工作单元，可以在时间片内执行工作，没时间了交还执行权给浏览器，下次时间片继续执行之前暂停之后返回的 Fiber

-   Fiber 可以在 reconcile 的时候进行相应的 diff 更新，让最后的更新应用在真实节点上

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

**相同点：**都可以接收 props 返回 react 元素

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

## react 怎么通过 dom 元素，找到与之对应的 fiber 对象的？

通过 internalInstanceKey 对应

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

## React Fiber & Concurrent Mode

-   将 reconciliation 阶段进行任务拆分(commit 无法拆分)
-   DOM 需要渲染时暂停，空闲时恢复
-   window.requestIdleCallbak

## React 16 在所有情况下都是异步渲染的吗？

## Fiber 架构

Fiber 架构的应用目的，按照 React 官方的说法，是实现“增量渲染”。所谓“增量渲染”，通俗来说就是把一个渲染任务分解为多个渲染任务，而后将其分散到多个帧里面。不过严格来说，增量渲染其实也只是一种手段，实现增量渲染的目的，是为了实现任务的可中断、可恢复，并给不同的任务赋予不同的优先级，最终达成更加顺滑的用户体验。

## Fiber 架构中的“可中断”“可恢复”到底是如何实现的？

## Fiber 树和传统虚拟 DOM 树有何不同？

## 优先级调度又是如何实现的？
