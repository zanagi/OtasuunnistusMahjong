/**
 * Shuffles an array
 * @param arr {Array} The array to be shuffled
 * @returns {Array} The shuffled array
 */
function shuffle(arr){
    for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
}

/**
 * Converts angle from degrees to radians
 * @param angle {Number}
 * @returns {Number} angle in radians
 */
function toRadians(angle) {
	return angle * Math.PI / 180;
}

/**
 * 
 * @param array {Array}
 * @returns a random value from the array
 */
function randomArrayValue(array) {
	return array[Math.floor(Math.random() * movedTiles.length)];
}