const testData = {
	a: 111,
	b: 'cccc',
	xxx: true,
  22:true
}
// 虚引用 ，避免 b:obja,c:obja出现相同引用重复计算问题
const seen = new WeakSet()

function sizeOfObject(object) {
	if (object === null) {
		return 0
	}
	let bytes = 0
	const properties = Object.keys(object)
	for (let i = 0; i < properties.length; i++) {
		const key = properties[i]
		bytes += calculator(key)
		if (typeof object[key] === 'object' && object[key] !== null) {
			if (seen.has(object[key])) {
				continue
			}
			seen.add(object[key])
		}
		bytes += calculator(object[key])
	}
  return bytes
}

function calculator(object) {
	const objectType = typeof object
	switch (objectType) {
		case 'string':
			return object.length * 2
		case 'boolean':
			return 4
		case 'number':
			return 8
		case 'object':
			if (Array.isArray(object)) {
				return object
					.map(calculator)
					.reduce((res, current) => res + current, 0)
			} else {
				return sizeOfObject(object)
			}
		default:
			return 0
	}
}
console.log(calculator(testData));