/**
 * A class simulating two-dimensional vectors (direction/position)
 * @param sx {Number} 
 * @param sy {Number}
 */
function Vector2(sx, sy) {
	var x = sx * 1.0; 	//Make sure the x-y values stay as floating point numbers
	var y = sy * 1.0;

	this.getX = function() {
		return x;
	};
	
	this.getY = function() {
		return y;
	};
	
	/**
	 * @param that {Vector2}
	 * @returns {Vector2} the new vector with the values of this vector added by the values of given vector
	 */
	this.add = function(that){
		return new Vector2(x + that.x, y + that.y);
	};

	/**
	 * @param that {Vector2}
	 * @returns {Vector2} the new vector with the values of this vector subtracted by the values of given vector
	 */
	this.subtract = function(that){
		return new Vector2(x - that.x, y - that.y);
	};

	/**
	 * @param amount {Number} the value this vector should be multiplied with
	 * @returns {Vector2} the multiplied vector
	 */
	this.multiply = function(amount){
		return new Vector2(x * amount, y * amount);
	};

	/**
	 * @param that {Vector2}
	 * @returns {Number} The dot product of this vector and the given vector
	 */
	this.dotproduct = function(that){
		return x * that.x + y * that.y;
	};

	/**
	 * @param that {Vector2} The normal vector
	 * @returns {Vector2} The reflected vector through the given normal Vector 
	 */
	this.reflect = function(that){
		return this.substract(that.multiply(2 * this.dotproduct(that))).normalize().multiply(this.length());
	};

	/**
	 * @returns {Number} The squared length of this vector
	 */
	this.lengthSquared = function() {
		return (x * x) + (y * y);
	};

	/**
	 * @returns {Number} The length of this vector
	 */
	this.length = function() {
		return Math.sqrt(this.lengthSquared());
	};

	/**
	 * @param that {Vector2} The vector (point) to compare distance with
	 * @returns {Number} The distance between this vector (as point) and the given vector
	 */
	this.distance = function(that) {
		return Math.sqrt((x - that.x) * (x - that.x) + (y - that.y) * (y - that.y));
	};

	/**
	 * @returns {Vector2} This vector as a direction vector with the length of 1
	 */
	this.normalize = function() {
		if (x === 0 && y === 0) {
			console.log("Trying to normalize zero vector");
			return this;
		}
		return new Vector2(x / this.length(), y / this.length());
	};

	/**
	 * @returns {Vector2} new Vector2 instance with the same values
	 */
	this.clone = function() {
		return new Vector2(x, y);
	};
	
	this.toString = function() {
		return "(" + x + ", " + y + ")";
	};
}