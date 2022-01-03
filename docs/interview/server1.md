---
title: 第一章
---

## 第一题：setTimeout和setImmediate？
```javascript
setTimeout(() => {
	console.log('setTimeout')
}, 0)
setImmediate(() => {
	console.log('setImmediate')
})
// 输出结果 执行顺序不确定
setImmediate
setTimeout
[Done] exited with code=0 in 0.175 seconds

setTimeout
setImmediate
[Done] exited with code=0 in 0.117 seconds

// 在nodejs中 setTimeout(fn, 0)===setTimeout(fn, 1)
// 在浏览器中 setTimeout(fn, 0)===setTimeout(fn, 4)

// 因为eventLoop的启动也需要时间，可能执行到poll阶段已经超过了1ms，此时setTimeout会限制性，反之setImmediate先执行

var path = require('path')
var fs = require('fs')
console.log(path.resolve(__dirname, './test.html'));
fs.readFile(path.resolve(__dirname, './test.html'), () => {
	setTimeout(() => {
		console.log('setTimeout')
	}, 0)
	setImmediate(() => {
		console.log('setImmediate')
	})
})
// 始终输入顺序是setImmediate在先
e:\VueRefrence\FEInterview\docs\demo\test.html
setImmediate
setTimeout

[Done] exited with code=0 in 0.146 seconds
```