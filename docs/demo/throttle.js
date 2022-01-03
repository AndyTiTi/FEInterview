function throttle(fn, delay) {
	let last = 0
	return function () {
		let now = Date.now()
		if (now - last >= delay) {
			fn.apply(this, arguments)
			last = now
		}
	}
}
// function throttle(fn, delay) {
// 	let timer = null
// 	return function () {
// 		let args = arguments
// 		let self = this
// 		if (!timer) {
// 			timer = setTimeout(() => {
// 				fn.apply(self, args)
// 				clearTimeout(timer)
// 			}, delay)
// 		}
// 	}
// }
// function throttle(fn, delay) {
// 	let startTime = Date.now()
// 	let timer = null
// 	return function () {
// 		let curTime = Date.now()
// 		let args = arguments
// 		let self = this
// 		let remainTime = delay - (curTime - startTime)
// 		clearTimeout(timer)
// 		if (remainTime <= 0) {
// 			startTime = Date.now()
// 			fn.apply(self, args)
// 		} else {
// 			timer = setTimeout(fn, remainTime)
// 		}
// 	}
// }

function debounce(fn, delay) {
	let timer = null
	return function () {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			fn()
		}, delay)
	}
}
function log() {
	console.log(111)
}

const fn = debounce(log, 1000)

var timer = setInterval(() => {
	fn()
}, 50)
setTimeout(() => {
	clearInterval(timer)
}, 3000)
