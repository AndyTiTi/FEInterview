---
title: 第一章
---

## 第一题：TS和ES6区别?

`TypeScript`是由微软开发的编程语言，是JavaScript的超集，本质还是要转化为JavaScript。

`ES6`是约定，所有浏览器都可以实现，但不是都支持。当我们处于“use strict”模式时，ES6的特性才会被打开，因此为了测试我们的ES6代码，我的建议是总是在文件的顶部添加“use strict

1. 开源，跨平台。它本身不需要考虑运行环境的问题，所有支持JavaScript的地方都可以使用typescript；
2. 引入静态类型声明，减少不必要的类型判断和文档注释；
3. 及早发现错误，静态类型检查1或编译时发现问题，不用等到运行；
4. 类、接口的使用更易于构建和维护组件；
5. 重构更方便可靠，适合大型项目；

## 第二题：type和interface区别？

`type 只是一个类型别名，并不会产生类型。`所以其实 type 和 interface 其实不是同一个概念，其实他们俩不应该用来比较的，只是有时候用起来看着类似。
1. 定义类型范围不同
    - interface只能定义对象类型或接口当名字的函数类型
    - type可以定义任何类型，包括基础类型、联合类型、交叉类型、元祖
    ```javascript
    type num = number
    type baseType = string|number|symbol

    interface Car{brandNo:string}
    interface Plane{No:string,brandNo:string}
    type TypVechile = Carl|Plane
    ```
2. 用type交叉类型 & 可让类型中的成员合并
3. 接口可以extends一个或多个接口或类，也可以继承type，但type类型没有继承功能。**一般接口继承类和type的应用场景很少见。**
4. 定义两个同名的interface会合并声明，定义两个同名的type会出现编译错误

[1]一文吃透 React 事件机制原理: https://toutiao.io/posts/28of14w/preview

[2]flex 语法篇: https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

[3]函数式组件与类组件有何不同？: https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/

[4]前端模块化：CommonJS,AMD,CMD,ES6: https://juejin.im/post/5aaa37c8f265da23945f365c

[5]webpack 是如何实现动态导入的: https://juejin.im/post/5d26e7d1518825290726f67a