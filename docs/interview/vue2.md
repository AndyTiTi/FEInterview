---
title: 第二章
---

## 如何提取 props 定义?

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

## Vue3 自定义 hook - useAxios?

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

## Vue3 监控 Suspense 组件异常信息?

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

## Vue cssInJS vue-jss?

[GitHub](https://www.github.com/pure-vue/vue-jss)

## Vue组件渲染更新过程

![在这里插入图片描述](https://img-blog.csdnimg.cn/5a1295a39d0f4e548ee1f33a7767e5fa.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/4db74c62c1714835a53ab45edde47f5f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP6IyD6aaG,size_20,color_FFFFFF,t_70,g_se,x_16)
