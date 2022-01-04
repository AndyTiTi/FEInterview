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

limitLoad(urls, loadImg, 3)
