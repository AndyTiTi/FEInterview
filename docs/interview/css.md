## BFC？

文档布局分为三种：

-   普通流
-   定位流
-   浮动流

BFC（被隔离的容器，里面的元素不会影响外部元素）属于普通流，可以看做是元素的一种属性，当拥有这种属性之后，该元素就可以看做是一块隔离了的区域，容器里的元素不会对外部元素造成影响；

怎么触发 BFC?

1. 浮动元素 【float：left\right 不为 none】
2. display：inline-block\table-cell\table\flexx\grid
3. overflow:hidden|scroll|aotu, 不为 visible 的块元素
4. 绝对定位元素【元素的 position 为 absolute 或 fixed，非 relative】

解决了什么问题？

-   margin 塌陷
-   清除浮动
-   阻止元素被浮动元素覆盖

## link 和@import 使用和区别

1、属性不同

link 是 html 提供的标签，不仅可以加载 css 文件，还能定义 RSS、rel 连接属性等。而

@import 是 css 中的语法规则

2、加载顺序不同

页面打开时，link 引用的 css 文件被加载。而@import 引用的 CSS 等页面加载完后最后加载。

3、兼容性

@import 是 css2.1 后提出的，而 link 是不存在兼容问题。

4、DOM 控制性

js 操作 DOM，可以使用 link 改变样式，无法使用@import 的方式使用样式。

## css 优先级

important > 内联 > ID 选择器 > 类选择器 > 标签选择器

## 避免 css 全局污染。

我常用的 css modules

## css modules 的原理

生成唯一的类名

## flex: 0 1 auto; 是什么意思？

## less 的 & 代表什么？
