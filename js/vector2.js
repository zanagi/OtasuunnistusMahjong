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
		return new Vector2(x + that.getX(), y + that.getY());
	};

	/**
	 * @param that {Vector2}
	 * @returns {Vector2} the new vector with the values of this vector subtracted by the values of given vector
	 */
	this.subtract = function(that){
		return new Vector2(x - that.getX(), y - that.getY());
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
		return x * that.getX() + y * that.getY();
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
		return Math.sqrt(distanceSquared(that));
	};
	
	this.distanceSquared = function(that) {
		return (x - that.getX()) * (x - that.getX()) + (y - that.getY()) * (y - that.getY());
	}

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
	 * @param {Array} the array of Vector2 instances that the polygon consists of
	 */
	this.isInPolygon = function(polyArray) {
		// TODO:
		var xi, xj, yi, yj;
		var inPolygon = false;
		for(var i = 0, j = polyArray.length - 1; i < polyArray.length; j = i++) {
			xi = polyArray[i].getX();
			yi = polyArray[i].getY();
			xj = polyArray[j].getX();
			yj = polyArray[j].getY();
			if((yi > y) != (yj > y) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
				inPolygon = !inPolygon;
			}
		}
		return inPolygon;
	};
	
	/**
	 * @param {Vector2} start point of the line
	 * @param {Vector2} end point of the line
	 * @returns {Number} the closest distanve from this point to the given line
	 */
	this.closestDistanceToLine = function(p0, p1) {
		return Math.sqrt(cdtlSquared(this, p0, p1));
	};
	
	function cdtlSquared(p, v, w) {
		var l2 = v.distanceSquared(w);
		  if (l2 == 0) {
			  return p.distanceSquared(v);
		  }
		  var t = ((p.getX() - v.getX()) * (w.getX() - v.getX()) + (p.getY() - v.getY()) * (w.getY() - v.getY())) / l2;
		  
		  if (t < 0) { 
			  return p.distanceSquared(v);
		  }
		  if (t > 1) { 
			  return p.distanceSquared(w);
		  }
		  return p.distanceSquared(new Vector2(v.getX() + t * (w.getX() - v.getX()), v.getY() + t * (w.getY() - v.getY())));
	}
	
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