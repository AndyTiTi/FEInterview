function myInstanceof(left, right) {
	let prototype = right.prototype
	left = left.__proto__
	while (true) {
		if (left === null || left === undefined) return false
		if (prototype === left) return true
		left = left.__proto__
	}
}
function Toy(){
  this.name = '123'
}
var a = new Toy()
console.log(myInstanceof(a,Toy));
