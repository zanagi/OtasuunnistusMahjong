function Sprite(spriteSheet, xCount, yCount, interval) {
	var frameCount = xCount * yCount;
	var currentFrame = 0;
	var frameWidth = spriteSheet.width / xCount;
	var frameHeight = spriteSheet.height / yCount;
	var time = 0;
	
	this.update = function() {
		time += 1;

		if (time >= interval) {
			time = 0;
			currentFrame = (currentFrame + 1) % frameCount;
		}
	};
	
	this.draw = function(ctx, x, y) {
		ctx.drawImage(spriteSheet, currentFrame % xCount * frameWidth,
				currentFrame / xCount * this.frameHeight, frameWidth,
				frameHeight, x, y, frameWidth, frameHeight);
	};
}