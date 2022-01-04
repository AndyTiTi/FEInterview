Function.prototype.newCall = function (context) {
	console.log(this)
	for (let i = 0; i < arguments.length; i++) {
		const ele = arguments[i]
		console.log(ele, '111')
	}
	if (typeof this !== 'function') {
		throw new TypeError('Error')
	}
	context = context || window
	context.fn = this
	const args = [...arguments].slice(1)
	const result = context.fn(...args)
	delete context.fn
	return result
}

function person() {
	console.log(this.name)
}

var b = { name: 'zs' }
person.newCall(b)
