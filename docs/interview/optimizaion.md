---
title: 第一章
---

## SSR？

## 一个网站 SEO 怎么优化

## 用不了 Lighthouse 怎么办？

可以下载 npm 包
还有 WebPageTest

## 用户活跃度几千万的网站如何优化

## 性能优优化方法都有哪些？

怎么测量的，怎么优化的，优化前后的对比

## 前端加载优化你都做过哪些？

1. 首屏优化
2. 首次可交互时间

页面性能检测 lighthouse、pagespeed
polyfill（高版本的语法进行低版本实现，语法多、体积大）https://polyfill.io/v3/polyfill.min.js

1. 只请求当前需要的资源
   异步加载、懒加载、polyfill - 不需要 webpack 打包便可以分析浏览器版本，进行动态引入所需内容
2. 缩减资源体积
   打包压缩
   gzip 1.2M - 300k
   图片格式的优化，手机端相比 pc 减小分辨率（tinypng），根据屏幕分辨率展示不同分辨率的图片，webp 格式
   尽量控制 cookie 大小 request header js-cookie 头请求耗费请求资源
3. 时序优化
   js promise.all 对于不关联的文件一并请求
   ssr 服务端渲染，千人千面(根据不同特征进行缓存)，seo
   prefetch,prerender,preload

```javascript
<link rel="dns-prefetch" href="xxx1.com"/>
<link rel="dns-prefetch" href="xxx2.com"/>
<link rel="preconnect" href="xxx1.com"/>
<link rel="preload" as="image" href="xxx1.com/p.png"/> // 高优先级banner图
```

4. 合理利用缓存
   cdn cdn 预热（穿透服务） cdn 刷新（强制回源）
5. 装饰器模式计算函数执行耗时

## webp 是否被支持？

```javascript
function checkWebp() {
	try {
		return (
			document
				.createElement('canvas')
				.toDataURL('image/webp')
				.indexOf('data:image/webp') === 0
		)
	} catch (e) {
		return false
	}
}
export function getWebImageUrl(url) {
	if (!url) {
		throw Error('url 不能为空')
	}
	if (url.startwWith('data:')) {
		return url
	}

	if (!checkWebp()) {
		return url
	}
	return url + '?x-oss-pong.png'
}
```
