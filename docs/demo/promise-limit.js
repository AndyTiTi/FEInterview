function limitLoad(urls, handler, limit) {
	const sequence = [].concat(urls)
	let promises = []

	promises = sequence.splice(0, limit).map((url, index) => {
		return handler(url).then(() => {
			return index
		})
	})
	let p = Promise.race(promises)
	for (let i = 0; i < sequence.length; i++) {
		p = p.then((res) => {
			promises[res] = handler(sequence[i]).then(() => {
				return res
			})
			return Promise.race(promises)
		})
	}
}
const urls = [
	{ info: 'task1', time: 1000 },
	{ info: 'task2', time: 2000 },
	{ info: 'task3', time: 3000 },
	{ info: 'task4', time: 4000 },
	{ info: 'task5', time: 5000 },
	{ info: 'task6', time: 6000 },
	{ info: 'task7', time: 7000 },
	{ info: 'task8', time: 8000 },
]
function loadImg(url) {
	return new Promise((resolve, reject) => {
		console.log('--- ' + url.info + ' start!')
		setTimeout(() => {
			console.log(url.info + ' OK!')
			resolve()
		}, url.time)
	})
}

// limitLoad(urls, loadImg, 3)

class PromiseQueue {
	constructor(options = {}) {
		this.concurrency = options.concurrency || 1
		this.currentCount = 0
		this.pendingList = []
	}

	add(task) {
		this.pendingList.push(task)
		this.run()
	}

	run() {
		if (
			this.pendingList.length === 0 ||
			this.currentCount === this.concurrency
		) {
			return
		}
		const fn = this.pendingList.shift()
		this.currentCount++
		const promise = fn()
		promise
			.then(this.complateOne.bind(this))
			.catch(this.complateOne.bind(this))
	}

	complateOne() {
		this.currentCount--
		this.run()
	}
}

var promise = new PromiseQueue({ concurrency: 3 })
urls.forEach((url) => {
	promise.add(() => loadImg(url))
})
