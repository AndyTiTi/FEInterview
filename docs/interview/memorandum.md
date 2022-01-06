---
title: 备忘录
---

1. JSONP 只限制 get 请求
2. 同源策略是用来防止利用用户的登录态发起恶意请求(CSRF 攻击)；跨域是为了阻止用户读取到另一个域名下的内容，Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止 CSRF，因为请求毕竟是发出去了。
3. Service Worker 传输协议必须为 HTTPS，因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。
4. Expires 受限于本地时间，如果修改了本地时间，可能会造成缓存失效。
5. CSS 选择符从右往左匹配查找，避免节点层级过多；对于没有任何依赖的 JS 文件可以加上 async 属性，表示 JS 文件下载和解析不会阻塞渲染；当 script 标签加上 defer 属性以后，表示该 JS 文件会并行下载，但是会放到 HTML 解析完成后顺序执行，所以对于这种情况你可以把 script 标签放在任意位置。
6. setTimeout 输出 i

```js
for (var i = 0; i < 6; i++) {
	setTimeout(
		function (f) {
			console.log(f)
		},
		i * 1000,
		i
	)
}
```
