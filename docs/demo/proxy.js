let onWatch = (obj) => {
	let handler = {
		get(target, property, receiver) {
			console.log(target, property, receiver)
			return Reflect.get(target, property, receiver)
		},
		set(target, property, value) {
			console.log(property, target[property])
			return Reflect.set(target, property, value)
		},
	}
	return new Proxy(obj, handler)
}
let obj = { a: 1 }
let p = onWatch(obj)
p.a = 2
p.a
