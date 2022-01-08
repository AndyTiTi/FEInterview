## 翻转字符串方法

```js
/**
 * @param {number} x
 * @return {number}
 */
const reverse = (x) => {
	debugger
	// 获取相应数的绝对值
	let int = Math.abs(x)
	// 极值
	const MAX = 2147483647
	const MIN = -2147483648
	let num = 0

	// 遍历循环生成每一位数字
	while (int !== 0) {
		// 借鉴欧几里得算法，从 num 的最后一位开始取值拼成新的数
		num = (int % 10) + num * 10
		// 剔除掉被消费的部分
		int = Math.floor(int / 10)
	}
	// 异常值
	if (num >= MAX || num <= MIN) {
		return 0
	}
	if (x < 0) {
		return num * -1
	}
	return num
}
reverse('123')
```
