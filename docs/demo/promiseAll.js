function promiseAll(promiseArray) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(promiseArray)) {
			return reject(new Error('参数必须是数组'))
		}
		let count = 0
		let arr = []
		let len = promiseArray.length
		for (let i = 0; i < len; i++) {
			Promise.resolve(promiseArray[i])
				.then((res) => {
					count++
					// arr.push(res)
					// promise是有顺序的，但是push是没有顺序的，哪个promise执行快就会被先推入数组，导致最终执行顺序错乱，所以用下标赋值
					arr[i] = res
					if (count === len) {
						resolve(arr)
					}
				})
				.catch((e) => reject(e))
		}
	})
}
const pro1 = new Promise((res, rej) => {
	setTimeout(() => {
		res('1')
	}, 1000)
})
const pro2 = new Promise((res, rej) => {
	setTimeout(() => {
		res('2')
	}, 1000)
})
const pro3 = new Promise((res, rej) => {
	setTimeout(() => {
		res('3')
	}, 1000)
})

promiseAll([pro1, pro2, pro3])
	.then((res) => {
		console.log(res)
	})
	.catch((e) => {
		console.log(e)
	})
