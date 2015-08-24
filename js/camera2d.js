function Camera2D(width, height) {
	var tl = new Vector2(0, 0); // Translation vector (the top-left position of the camera)

	/**
	 * Updates the translation vector
	 */
	this.updateTranslation = function(diff, min, max) {
		var x = Math.min(Math.max(tl.getX() + diff.getX(), min.getX()), max.getX() - width);
		var y = Math.min(Math.max(tl.getY() + diff.getY(), min.getY()), max.getY() - height);
		tl = new Vector2(x, y);
	};
	
	/**
	 * @returns {Vector2} the translation vector
	 */
	this.getTranslation = function() {
		return tl;
	}
	
	/**
	 * Resets the translation
	 */
	this.reset = function() {
		tl = new Vector2(0, 0);
	};
	
	/**
	 * @param point {Vector2}
	 * @return {Boolean} true if point (position vector) is inside viewport, otherwise returns false
	 */
	this.containsPoint = function(point) {
		return (point.getX() >= tl.getX() && point.getX() <= tl.getX() + width
				&& point.getY() >= tl.getY() && point.getY() <= tl.getY() + height);
	}
	
	/**
	 * Debug function
	 */
	this.print = function() {
		console.log("Translation: " + tl.toString());
	};
}