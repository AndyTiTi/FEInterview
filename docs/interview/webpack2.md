---
title: 第二章
---

## 写过 webpack 的 plugins 吗

## 谈谈你对 webpack 的理解？

webpack 是一个打包模块化 js 的工具，在 webpack 里一切文件皆模块，通过 loader 转换文件，通过 plugin 注入钩子，最后输出由多个模块组合成的文件，webpack 专注构建模块化项目。WebPack 可以看做是模块的打包机器：它做的事情是，分析你的项目结构，找到 js 模块以及其它的一些浏览器不能直接运行的拓展语言，例如：Scss，TS 等，并将其打包为合适的格式以供浏览器使用

## 说说 webpack 与 grunt、gulp 的不同？

三者都是前端构建工具，grunt 和 gulp 在早期比较流行，现在 webpack 相对来说比较主流，不过一些轻量化的任务还是会用 gulp 来处理，比如单独打包 CSS 文件等。
grunt 和 gulp 是基于任务和流（Task、Stream）的。类似 jQuery，找到一个（或一类）文件，对其做一系列链式操作，更新流上的数据， 整条链式操作构成了一个任务，多个任务就构成了整个 web 的构建流程。
webpack 是基于入口的。webpack 会自动地递归解析入口所需要加载的所有资源文件，然后用不同的 Loader 来处理不同的文件，用 Plugin 来扩展 webpack 功能。
所以，从构建思路来说，gulp 和 grunt 需要开发者将整个前端构建过程拆分成多个`Task`，并合理控制所有`Task`的调用关系；webpack 需要开发者找到入口，并需要清楚对于不同的资源应该使用什么 Loader 做何种解析和加工
对于知识背景来说，gulp 更像后端开发者的思路，需要对于整个流程了如指掌 webpack 更倾向于前端开发者的思路

## 什么是 bundle,什么是 chunk，什么是 module?

bundle：是由 webpack 打包出来的文件
chunk：webpack 打包过程中 Modules 的集合，是（打包过程中）的概念
module：是开发中的单个模块，在 webpack 的世界，一切皆模块，一个模块对应一个文件，webpack 会从配置的 entry 中递归开始找出所有依赖的模块

## 什么是 Loader?什么是 Plugin?

1）Loaders 是用来告诉 webpack 如何转化处理某一类型的文件，并且引入到打包出的文件中
2）Plugin 是用来自定义 webpack 打包过程的方式，一个插件是含有 apply 方法的一个对象，通过这个方法可以参与到整个 webpack 打包的各个流程(生命周期)

## 有哪些常见的 Loader？他们是解决什么问题的？

file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
source-map-loader：加载额外的 Source Map 文件，以方便断点调试
image-loader：加载并且压缩图片文件
babel-loader：把 ES6 转换成 ES5
css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
eslint-loader：通过 ESLint 检查 JavaScript 代码
