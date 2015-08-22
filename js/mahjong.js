/**
 * A custom image class
 */
function GameImage(filename, width, height) {
	var loaded = false;
	
	var img = new Image();
	img.onload = function() {
		loaded = true;
	};
	img.src = "../images/" + filename + ".png";
	
	/**
	 * Draws the image
	 */
	this.draw = function(ctx, pos) {
		if(this.isLoaded()){
			ctx.drawImage(this.img, pos.getX(), pos.getY(), width, height);	
		}
	};
	
	/**
	 * @returns {Boolean} true if the image has been loaded successfully, otherwise returns false
	 */
	this.isLoaded = function() {
		return loaded;
	};
	
	this.getWidth = function() {
		return width;
	};
	
	this.getHeight = function() {
		return height;
	};
	
	this.getName = function() {
		return filename;
	};
}

/**
 * Class for mahjong tiles
 * @param img {GameImage}
 * @param pos {Vector2}
 */
function Tile(img, pos) {
	var rotation = 0.0;
	
	this.draw = function(ctx) {
		img.draw(ctx, pos);
	};

	this.imageLoaded = function() {
		return img.isLoaded();
	}
	
	this.getName = function() {
		return img.getName();
	}
	
	/**
	 * Debug function
	 */
	this.print = function() {
		console.log(img.getName() + ": " + pos.toString());
	};
}

/**
 * 
 */
function TileManager(tileWidth, tileHeight) {
	var tiles = [];
	var xCount = 17; 	// Columns
	var yCount = 8; 	// Rows
	var diameter = Math.sqrt(tileWidth * tileWidth + tileHeight * tileHeight);
	var center = new Vector2(diameter * xCount / 2.0, diameter * yCount / 2.0);
	
	this.createTiles = function() {
		var basicTileTypes = ["man", "pin", "sou"];
		var honorTiles = ["east", "south", "west", "north", "hatsu", "chun", "haku"]
		var positions = createPositionArray(xCount, yCount, diameter);
		
		for(var t = 0; t < basicTileTypes.length; t++){
			for(var i = 1; i <= 9; i++){
				var img = new GameImage(basicTileTypes[t] + "-" + i, tileWidth, tileHeight);
				
				this.pushTiles(img, positions, 4);
			}
		}
		
		for(var t = 0; t < honorTiles.length; t++){
			var img = new GameImage(honorTiles[t], tileWidth, tileHeight);
			
			this.pushTiles(img, positions, 4);
		}
	};
	
	this.pushTiles = function(img, positions, count){
		for(var i = 0; i < count; i++){
			tiles.push(new Tile(img, positions.pop()));	
		}
	};
	
	function createPositionArray(xCount, yCount, diameter) {
		var array = [];
		
		for(var y = 0; y < yCount; y++){
			for(var x = 0; x < xCount; x++){
				array.push(new Vector2(50 + x * diameter, 50 + y * diameter))
			}
		}
		return shuffle(array);
	};
	
	this.allTilesLoaded = function() {
		for(var i = 0; i < tiles.length / 4; i++){
			if(!tiles[i * 4].imageLoaded()){
				console.log("Not loaded: " + tiles[i * 4].getName())
				return false;
			}
		}
		return true;
	}
	
	/**
	 * Debug function
	 */
	this.print = function(){
		for(var i = 0; i < tiles.length; i++){
			tiles[i].print();
		}
	};
}