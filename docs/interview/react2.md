---
title: 第二章
---

## 实现一个 redux？

实现 createStore 的功能，关键点发布订阅的功能，以及取消订阅的功能。

## 用 ts 实现一个 redux？

## React.lazy 的原理是啥？

## FiberNode 有哪些属性

## react 里有动态加载的 api 吗？

React.lazy

## 详细的介绍一下 getDerivedStateFromProps

[1]一文吃透 React 事件机制原理: https://toutiao.io/posts/28of14w/preview

[2]flex 语法篇: https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

[3]函数式组件与类组件有何不同？: https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/

[4]前端模块化：CommonJS,AMD,CMD,ES6: https://juejin.im/post/5aaa37c8f265da23945f365c

[5]webpack 是如何实现动态导入的: https://juejin.im/post/5d26e7d1518825290726f67a

## React

![在这里插入图片描述](https://img-blog.csdnimg.cn/1a8261db444246dfa228ab6cc6dff4fb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/6fded7c2025d4719ad109d928fadca4c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/f815175f3e584787a4ac09833a8c0db8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2b92bede804243c299a5c40505283d6b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/ad3183775c574c6c882a2847c2f17d40.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/441b1412d477439c916c60a389766059.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/0d1e6daf81a8456e802724bfaf8063a0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## 为什么用 key

![在这里插入图片描述](https://img-blog.csdnimg.cn/e54720d5b1cb49d4abb937f1ce60f1ff.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## React 生命周期

![在这里插入图片描述](https://img-blog.csdnimg.cn/f9de7c8334ae42d9a8121e0bd1ab505c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## React 父子组件生命周期

> mountComponent 负责管理生命周期中的 mounting 阶段的方法调用

mountComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillMount 在其子组件的 componentWillMount 之前调用，而父组件的 componentDidMount 在其子组件的 componentDidMount 之后调用

> updateComponent 负责管理生命周期中的 updating 阶段的方法调用

updateComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillUpdate 在其子组件的 componentWillUpdate 之前调用，而父组件的 componentDidUpdate 在其子组件的 componentDidUpdate 之后调用
![在这里插入图片描述](https://img-blog.csdnimg.cn/133f6cfb49314dab8d8638f324f2f487.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/b22e942c99eb4a67a44f2866dc84fba4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## React 单向数据流

![在这里插入图片描述](https://img-blog.csdnimg.cn/e7edd5e79d644812a597905861c6d094.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## 为什么要用 SyntheticEvent 合成事件机制？

![在这里插入图片描述](https://img-blog.csdnimg.cn/c887b4ff266342ada9a904d2e7f2b758.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## React17 将事件绑定从 document 移到了 root 上

![在这里插入图片描述](https://img-blog.csdnimg.cn/111c8d020ab34acd9e81f0fabbccbac2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## React 的 batchUpdate 机制![在这里插入图片描述](https://img-blog.csdnimg.cn/9c4f657d6f9b473fbb7635875f59adfc.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/30dfad9123a648778d134e0737c54179.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/d0465598cefa4a4d82ff9776492325f3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/6a26452ccef04b3cb4e90d2ba25b55bd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/5bf42d43e4dc492391e85ffd37b95ec0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/107809394513428898c617ec325ccbe1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/1761f2a120704439bf5335bb2ef16dd5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/a71b1d2284f546b9a3f74387a225d5f1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/0f9e796535ba485a83e73e7c8e18b8af.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)

## jsx 的渲染过程

jsx 会经过 babel 编译成 createElement 函数的结构，然后 createElement 执行产生虚拟 dom 结构 VNode(就是一个有一定属性的对象结构)，然后通过 render 函数处理 VNode 为虚拟节点，在页面中渲染

## dom 的更新过程

diff 算法对比新旧 VNode，如果新旧 VNode 不一样就调用 render 重新渲染视图的过程

## diff 算法流程

## setState 触发后的整个逻辑主要脉络

## React Fiber & Concurrent Mode

![在这里插入图片描述](https://img-blog.csdnimg.cn/5a36dd7c83ee4b51ada12ee0566a307b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
