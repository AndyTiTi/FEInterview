---
title: 第一章
---

## 第一题：如何提取props定义？

```javascript
const PropsType = {
  msg: String,
  age: {
    type: Number,
    required: true,
  },
} as const

export default defineComponent({
  props: PropsType,
  setup(props) {
    return () => <div>{props.age}</div>
  },
})
```

为达到复用 PropsType 的目的，需要 as const 进行只读约束

::: warning 介绍
1. readonly constraint allows TS to treat the type of {required:true} as constant instead of boolean
2. readonly 约束允许 TS 将 {required:true} 的类型视为常量而不是布尔值
:::


## 第二题：如何提高 webpack 的构建速度？

多入口情况下，使用 CommonsChunkPlugin 来提取公共代码
通过 externals 配置来提取常用库
利用 DllPlugin 和 DllReferencePlugin 预编译资源模块 通过 DllPlugin 来对那些我们引用但是绝对不会修改的 npm 包来进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来。
使用 Happypack 实现多线程加速编译
使用 webpack-uglify-parallel 来提升 uglifyPlugin 的压缩速度。 原理上 webpack-uglify-parallel 采用了多核并行压缩来提升压缩速度
使用 Tree-shaking 和 Scope Hoisting 来剔除多余代码

## 第三题：怎么配置单页应用？怎么配置多页应用？

单页应用可以理解为 webpack 的标准模式，直接在 entry 中指定单页应用的入口即可，这里不再赘述
多页应用的话，可以使用 webpack 的 AutoWebPlugin 来完成简单自动化的构建，但是前提是项目的目录结构必须遵守他预设的规范。 多页应用中要注意的是：
每个页面都有公共的代码，可以将这些代码抽离出来，避免重复的加载。比如，每个页面都引用了同一套 css 样式表
随着业务的不断扩展，页面可能会不断的追加，所以一定要让入口的配置足够灵活，避免每次添加新页面还需要修改构建配置

## 第四题：如何在 vue 项目中实现按需加载？

Vue UI 组件库的按需加载 为了快速开发前端项目，经常会引入现成的 UI 组件库如 ElementUI、iView 等，但是他们的体积和他们所提供的功能一样，是很庞大的。 而通常情况下，我们仅仅需要少量的几个组件就足够了，但是我们却将庞大的组件库打包到我们的源码中，造成了不必要的开销。
不过很多组件库已经提供了现成的解决方案，如 Element 出品的 babel-plugin-component 和 AntDesign 出品的 babel-plugin-import 安装以上插件后，在.babelrc 配置中或 babel-loader 的参数中进行设置，即可实现组件按需加载了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/dd79ac82e9b54269bd60e21c1426233b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_14,color_FFFFFF,t_70,g_se,x_16)

单页应用的按需加载 现在很多前端项目都是通过单页应用的方式开发的，但是随着业务的不断扩展，会面临一个严峻的问题——首次加载的代码量会越来越多，影响用户的体验。

通过 import(_)语句来控制加载时机，webpack 内置了对于 import(_)的解析，会将 import(_)中引入的模块作为一个新的入口在生成一个 chunk。 当代码执行到 import(_)语句时，会去加载 Chunk 对应生成的文件。import()会返回一个 Promise 对象，所以为了让浏览器支持，需要事先注入 Promise polyfill
