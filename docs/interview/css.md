## BFC？
文档布局分为三种：
- 普通流
- 定位流
- 浮动流

BFC（被隔离的容器，里面的元素不会影响外部元素）属于普通流，可以看做是元素的一种属性，当拥有这种属性之后，该元素就可以看做是一块隔离了的区域，容器里的元素不会对外部元素造成影响；

怎么触发BFC?
1. 浮动元素 【float：left\right 不为none】
2. display：inline-block\table-cell\table\flexx\grid
3. overflow:hidden|scroll|aotu, 不为visible的块元素
4. 绝对定位元素【元素的position为absolute或fixed，非relative】

解决了什么问题？
- margin塌陷
- 清除浮动
- 阻止元素被浮动元素覆盖