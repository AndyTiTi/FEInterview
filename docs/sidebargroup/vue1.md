---
title: 第一章
---

#### 第一题：如何提取 props 定义？

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

#### 第二题：Vue3 自定义 hook - useAxios？

```javascript
import { ref } from 'vue';
import axios from 'axios';
export default function <T>(url: string) {
  const result = ref<T | null>(null);
  const loading = ref(true);
  const loaded = ref(false);
  const error = ref(null);
  axios
    .get(url)
    .then((res) => {
      console.log(res);
      loading.value = false;
      loaded.value = true;
      result.value = res.data;
    })
    .catch((e) => {
      error.value = e;
      loading.value = false;
    });
  return {
    result,
    loading,
    loaded,
    error,
  };
}

// 使用
import useAxios from './hooks/useAxios';
const { result, loading, loaded } = useAxios<CatResult[]>(
  'https://api.thecatapi.com/v1/images/search?limit=1'
);
```

#### 第三题：Vue3监控Suspense组件异常信息？
```html
<p>{{ error }}</p>
```
```javascript
import { onErrorCaptured } from 'vue';
setup() {
  const error = ref(null);
  onErrorCaptured((e: any) => {
    error.value = e;
    // 返回布尔值，表示是否向上传播
    return true;
  });
}
```

#### 第四题：Vue cssInJS vue-jss？

[GitHub](https://www.github.com/pure-vue/vue-jss)

#### 第五题：v-for和v-if优先级？

1. 显然v-for优先于v-if被解析（codegen.js源码中，genFor优于genIf进行了判断）
2. 如果同时出现，每次渲染都会先执行循环再判断条件，无论如何循环都不可避免性能浪费；
3. 要避免这种情况，则在外层嵌套template，在这一层进行v-if判断，然后在内部进行v-for的遍历；

#### 第六题：Vue组件的data为什么必须是个函数，而Vue的根实例则没有此限制？

Vue组件可能存在多个实例，如果使用对象形式定义data，则会导致他们共用一个data对象，那么状态变更将会影响所有组件实例，这是不合理的；采用函数形式定义，在initData时会将其作为工厂函数返回全新的data对象，有效规避多实例之间状态污染的问题。而在Vue根实例创建过程中则不存在该限制，也是因为根实例只有一个，不需要担心这种情况。最终会进行合并策略mergeOptions

#### 第七题：Vue中key的作用和工作原理？
断点调试技巧【断点右击 EditTarget-> 进行结点的锁死，避免别的流程影响调试思路】

::: tip
使用key
:::

![Image from alias](/usekey.png)
::: warning
不使用key
:::

![Image from alias](/key.png)
```javascript
// 首次循环patch A
A B C D E
A B F C D E

// 第2次循环patch B
B C D E
B F C D E

// 第3次循环patch E
C D E
F C D E

// 第4次循环patch D
C D
F C D

// 第5次循环patch C
C 
F C

// oldCh全部处理结束，newCh中剩下的F，创建F并插入到C前面
```
正确解答：

1. key的作用主要是为了高效的更新虚拟DOM，其原理是vue在patch过程中通过key可以精准判断两个节点是否是同一个，从而避免频繁更新不同元素，使得整个patch过程更加高效，减少DOM操作量，提高性能。

2. 另外，若不设置key还可能在列表更新时引发一些隐蔽的bug

3. vue中在使用相同标签名元素的过渡切换时，也会使用到key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果。

#### 第八题：Vue中diff算法？
1. diff算法是虚拟DOM技术的产物，vue里面实际叫做patch，它的核心实现来自于snabbdom；通过新旧虚拟DOM作对比（即patch），将变化的地方转换为DOM操作

2. 在vue 1中是没有patch的，因为界面中每个依赖都有专门的watcher负责更新，这样项目规模变大就会成为性能瓶颈，vue 2中为了降低watcher粒度，每个组件只有一个watcher，但是当需要更新的时候，怎样才能精确找到发生变化的地方？这就需要引入patch才行。

3. 组件中数据发生变化时，对应的watcher会通知更新并执行其更新函数，它会执行渲染函数获取全新虚拟dom：newVnode，此时就会执行patch比对上次渲染结果oldVnode和新的渲染结果newVnode。

4. patch过程遵循深度优先、同层比较的策略；两个节点之间比较时，如果它们拥有子节点，会先比较子节点；比较两组子节点时，会假设头尾节点可能相同先做尝试，没有找到相同节点后才按照通用方式遍历查找；查找结束再按情况处理剩下的节点；借助key通常可以非常精确找到相同节点，因此整个patch过程非常高效。

> 修改数据 - 触发数据响应式setter - 触发notify - 将watcher加入异步更新队列 - 事件循环执行完毕清空队列 - watcher执行更新函数 - 调用组件的更新渲染函数 - 执行过程中就是diff patch的过程