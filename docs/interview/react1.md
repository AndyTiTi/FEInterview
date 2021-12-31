---
title: 第一章
---

## 第一题：React 性能优化思路？

:::tip React 性能优化的理念的主要方向就是这两个
1. 减少重新 render 的次数。因为在 React 里最重(花时间最长)的一块就是 reconction(简单的可以理解为 diff)，如果不 render，就不会 reconction。
2. 减少计算的量。主要是减少重复计算，对于函数式组件来说，每次 render 都会重新从头开始执行函数调用。
:::
- 类组件: 
使用的 React 优化 API 主要是：shouldComponentUpdate和 PureComponent，这两个 API 所提供的解决思路都是为了减少重新 render 的次数，主要是减少父组件更新而子组件也更新的情况
- 函数式组件：React.memo 这个效果基本跟类组件里面的 PureComponent效果极其类似


## 第二题：React.memo 高级用法？

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
  doSomething(a, b);
}

const memoizedCallback = useCallback(callback, [a, b])
```
```javascript
// 父组件 index.js
import React, { useState } from"react";
import ReactDOM from"react-dom";
import Child from"./child";

function App() {
  const [title, setTitle] = useState("这是一个 title");
  const [subtitle, setSubtitle] = useState("我是一个副标题");

  const callback = () => {
    setTitle("标题改变了");
  };
  return (
    <div className="App">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <button onClick={() => setSubtitle("副标题改变了")}>改副标题</button>
      <Child onClick={callback} name="桃桃" />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// 子组件 child.js
import React from"react";

function Child(props) {
  console.log(props);
  return (
    <>
      <button onClick={props.onClick}>改标题</button>
      <h1>{props.name}</h1>
    </>
  );
}

export default React.memo(Child);

```
```javascript
// index.js
import React, { useState, useCallback } from"react";
import ReactDOM from"react-dom";
import Child from"./child";

function App() {
  const [title, setTitle] = useState("这是一个 title");
  const [subtitle, setSubtitle] = useState("我是一个副标题");

  const callback = () => {
    setTitle("标题改变了");
  };

  // 通过 useCallback 进行记忆 callback，并将记忆的 callback 传递给 Child
  const memoizedCallback = useCallback(callback, [])

  return (
    <div className="App">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <button onClick={() => setSubtitle("副标题改变了")}>改副标题</button>
      <Child onClick={memoizedCallback} name="桃桃" />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```
> 问题：当父组件重新渲染的时候，传递给子组件的 props 发生了改变，再看传递给 Child 组件的就两个属性，一个是 name，一个是 onClick ，name 是传递的常量，不会变，变的就是 onClick 了，为什么传递给 onClick 的 callback 函数会发生改变呢？在文章的开头就已经说过了，在函数式组件里每次重新渲染，函数组件都会重头开始重新执行，那么这两次创建的 callback 函数肯定发生了改变，所以导致了子组件重新渲染。

> 解决：在函数没有改变的时候，重新渲染的时候保持两个函数的引用一致，这个时候就要用到 useCallback 这个 API 了

## useMemo
在文章的开头就已经介绍了，React 的性能优化方向主要是两个：一个是减少重新 render 的次数(或者说减少不必要的渲染)，另一个是减少计算的量。

前面介绍的 React.memo 和 useCallback 都是为了减少重新 render 的次数。对于如何减少计算的量，就是 useMemo 来做的，接下来我们看例子。
```javascript
function App() {
  const [num, setNum] = useState(0);

  // 一个非常耗时的一个计算函数
  // result 最后返回的值是 49995000
  function expensiveFn() {
    let result = 0;

    for (let i = 0; i < 10000; i++) {
      result += i;
    }

    console.log(result) // 49995000
    return result;
  }

  const base = expensiveFn();

  return (
    <div className="App">
      <h1>count：{num}</h1>
      <button onClick={() => setNum(num + base)}>+1</button>
    </div>
  );
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

const memoizedValue = useMemo(computeExpensiveValue, [a, b]);
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
执行上面的代码，然后现在可以观察无论我们点击 +1多少次，只会输出一次 49995000，这就代表 expensiveFn 只执行了一次，达到了我们想要的效果。

### 小结
useMemo 的使用场景主要是用来缓存计算量比较大的函数结果，可以避免不必要的重复计算，有过 vue 的使用经历同学可能会觉得跟 Vue 里面的计算属性有异曲同工的作用。