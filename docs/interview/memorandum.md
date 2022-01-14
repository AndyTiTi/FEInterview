---
title: 备忘录
---

![](/profile1.png)
![](/profile2.png)
![](/profile3.png)
1. JSONP 只限制 get 请求

2. CSS 选择符从右往左匹配查找，避免节点层级过多；对于没有任何依赖的 JS 文件可以加上 async 属性，表示 JS 文件下载和解析不会阻塞渲染；当 script 标签加上 defer 属性以后，表示该 JS 文件会并行下载，但是会放到 HTML 解析完成后顺序执行，所以对于这种情况你可以把 script 标签放在任意位置。
3. setTimeout 输出 i

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

## 算法

二叉树、二分查找

```js
// 当时用的 js，用 ts 只是为了表达的更清晰一点
interface Barrage {
	time: Number;
	barrage: String;
}
const binarySearch = (arr: Barrage[], time: number) => {
	let l = 0
	let r = arr.length - 1
	while (l <= r) {
		const mid = (l + r) / 2
		if (arr[mid].time === time) {
			return arr[mid].barrage
		} else if (arr[mid].time < time) {
			l = mid + 1
		} else {
			r = mid - 1
		}
	}
	return null
}
```

## 回文字符串，最多删一个字符

## n 叉树层序遍历

```js
const levelOrder = (root) => {
	while (root.length) {
		const temp = root.shift()
		console.log(temp.val)
		for (let i = 0; i < temp.children.length; i++) {
			root.push(temp.children[i])
		}
	}
}

const root = [
	{
		val: 1,
		children: [
			{
				val: 3,
				children: [],
			},
		],
	},
	{
		val: 2,
		children: [
			{
				val: 4,
				children: [],
			},
		],
	},
]
```
