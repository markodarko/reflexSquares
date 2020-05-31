function randomINT(num){
	return Math.floor(Math.random()*(num+1))
}
function cycleArray(array){
	array.push(array.shift())
}