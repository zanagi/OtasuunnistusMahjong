function Camera2D(canvas) {
	var tl = new Vector2(0, 0); // Translation vector (the top-left position of the camera)
	var ctx = canvas.getContext("2d");
	
	/**
	 * Updates the translation vector
	 */
	this.updateTranslation = function(diff, min, max) {
		var x = Math.min(Math.max(tl.getX() + diff.getX(), min.getX()), max.getX());
		var y = Math.min(Math.max(tl.getY() + diff.getY(), min.getY()), max.getY());
		tl = new Vector2(x, y);
	}
	
	/**
	 * Applies the translation to canvas
	 * @param ctx {Object} The context of the canvas
	 */
	this.apply = function() {
		ctx.translate(-tl.getX(), -tl.getY());
	}
	
	/**
	 * Undoes the translation to canvas
	 * @param ctx {Object} The context of the canvas
	 */
	this.reset = function() {
		ctx.translate(tl.getX(), tl.getY());
	}
}