---
title: 第一章
---

## TS 和 ES6 区别?

`TypeScript`是由微软开发的编程语言，是 JavaScript 的超集，本质还是要转化为 JavaScript。

`ES6`是约定，所有浏览器都可以实现，但不是都支持。当我们处于“use strict”模式时，ES6 的特性才会被打开，因此为了测试我们的 ES6 代码，我的建议是总是在文件的顶部添加“use strict

1. 开源，跨平台。它本身不需要考虑运行环境的问题，所有支持 JavaScript 的地方都可以使用 typescript；
2. 引入静态类型声明，减少不必要的类型判断和文档注释；
3. 及早发现错误，静态类型检查 1 或编译时发现问题，不用等到运行；
4. 类、接口的使用更易于构建和维护组件；
5. 重构更方便可靠，适合大型项目；

## type 和 interface 区别？

`type 只是一个类型别名，并不会产生类型。`所以其实 type 和 interface 其实不是同一个概念，其实他们俩不应该用来比较的，只是有时候用起来看着类似。

1. 定义类型范围不同

    - interface 只能定义对象类型或接口当名字的函数类型
    - type 可以定义任何类型，包括基础类型、联合类型、交叉类型、元祖

    ```javascript
    type num = number
    type baseType = string | number | symbol

    interface Car {
    	brandNo: string;
    }
    interface Plane {
    	No: string;
    	brandNo: string;
    }
    type TypVechile = Carl | Plane
    ```

2. 用 type 交叉类型 & 可让类型中的成员合并
3. 接口可以 extends 一个或多个接口或类，也可以继承 type，但 type 类型没有继承功能。**一般接口继承类和 type 的应用场景很少见。**
4. 定义两个同名的 interface 会合并声明，定义两个同名的 type 会出现编译错误

## Pick 和 Omit

## 实现一个 Typescript 里的 Pick

type Pick<T, K extends keyof T> = { [P in K]: T[P] }
