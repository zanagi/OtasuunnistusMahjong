/**
 * A custom image class
 */
function GameImage(folderPath, filename, width, height) {
	var loaded = false;
	
	var img = new Image();
	img.onload = function() {
		loaded = true;
	};
	img.src = folderPath + filename + ".png";
	
	/**
	 * Draws the image
	 * @param canvas {Object} the canvas where the image is drawn
	 * @param pos {Vector2} the position vector where the image should be drawn
	 * @param rotation {Number} the rotation (angle) of the image
	 */
	this.draw = function(canvas, pos, rotation) {
		if(this.isLoaded()) {
			var ctx = canvas.getContext("2d");
			ctx.save();
			ctx.translate(pos.getX(), pos.getY());
			ctx.rotate(rotation * Math.PI / 180);
			ctx.drawImage(img, -width / 2, -height / 2, width, height);	
			ctx.restore();
		}
	};
	
	/**
	 * @returns {Boolean} true if the image has been loaded successfully, otherwise returns false
	 */
	this.isLoaded = function() {
		return loaded;
	};
	
	/**
	 * @returns {Number} the width of the image
	 */
	this.getWidth = function() {
		return width;
	};
	
	/**
	 * @returns {Number} the height of the image
	 */
	this.getHeight = function() {
		return height;
	};
	
	/**
	 * @returns {String} the name (filename without extension) of the image
	 */
	this.getName = function() {
		return filename;
	};
	
	/**
	 * Debug function
	 * @returns {String} the full path of the image file
	 */
	this.getFullPath = function() {
		return img.src;
	};
}


/**
 * Class for mahjong tiles
 * @param img {GameImage} The image of the tile
 * @param pos {Vector2} The initial position vector of the tile
 */
function Tile(img, pos) {
	var rotation = 0.0;
	var position = pos;
	
	/**
	 * Draws the mahjong tile
	 * @param canvas {Object} the canvas where the tile is drawn
	 */
	this.draw = function(canvas) {
		img.draw(canvas, position, rotation);
	};

	/**
	 * @returns {Boolean} true if image has been loaded, otherwise returns false
	 */
	this.imageLoaded = function() {
		return img.isLoaded();
	};
	
	/**
	 * @returns {String} the name of the image
	 */
	this.getName = function() {
		return img.getName();
	};
	
	/**
	 * Gives the tile a new position
	 * @param newPos {Vector2} the new position cector
	 */
	this.setPosition = function(newPos) {
		position = newPos;
	};
	
	/**
	 * Gives the tile a new rotation
	 * @param newRotation {Number} the new rotation
	 */
	this.setRotation = function(newRotation) {
		rotation = newRotation;
	};
	
	/**
	 * Debug function
	 */
	this.print = function() {
		console.log(img.getName() + ": " + position.toString());
		console.log("Path: " + img.getFullPath());
	};
}


/**
 * A TileManager instance manages all mahjong tiles
 * @param tileWidth {Number} the preferred width of the image of the mahjong tiles
 * @param tileHeight {Number} the preferred height of the image of the mahjong tiles
 */
function TileManager(tileWidth, tileHeight) {
	var tiles = [];
	var xCount = 17; 	// Columns
	var yCount = 8; 	// Rows
	var diameter = Math.sqrt(tileWidth * tileWidth + tileHeight * tileHeight);
	var center = new Vector2(diameter * xCount / 2.0, diameter * yCount / 2.0);
	
	/**
	 * Creates new mahjong tiles and adds them to the tiles array
	 */
	this.createTiles = function() {
		var tileFolderPath = "images/tiles/";
		var basicTileTypes = ["man", "pin", "sou"];
		var honorTiles = ["east", "south", "west", "north", "hatsu", "chun", "haku"]
		var positions = createPositionArray(xCount, yCount, diameter);
		
		// Add basic tiles man/pin/sou 1-9 
		for(var t = 0; t < basicTileTypes.length; t++){
			for(var i = 1; i <= 9; i++){
				var img = new GameImage(tileFolderPath, basicTileTypes[t] + "-" + i, tileWidth, tileHeight);
				
				pushTiles(img, positions, 4);
			}
		}
		
		// Add honor tiles
		for(var t = 0; t < honorTiles.length; t++){
			var img = new GameImage(tileFolderPath, honorTiles[t], tileWidth, tileHeight);
			
			pushTiles(img, positions, 4);
		}
		
		// Rotate and group the tiles
		rotateTiles();
		groupTiles();
	};
	
	/**
	 * @returns {Boolean} true if the images are loaded for every tile, otherwise returns false
	 */
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
	 * Draws the tiles
	 * @param canvas {Object} the canvas where the objects are drawn
	 */
	this.draw = function(canvas) {
		for(var i = 0; i < tiles.length; i++) {
			tiles[i].draw(canvas);
		}
	};
	
	/**
	 * Private function:
	 * Creates new tiles equal to the given amount and gives them a position from the given position array
	 * @param img {GameImage} the image of the tiles
	 * @param positions {Array} the array of possible positions for the tiles
	 * @param count {Number} the number of tiles to be added to the tiles array (should be 4, unless using red doras where it can be 1-3)
	 */
	function pushTiles(img, positions, count){
		// Error handling
		if(positions.length < count) {
			alert("Not enough position in positions array!");
			return;
		}
		
		for(var i = 0; i < count; i++){
			tiles.push(new Tile(img, positions.pop()));	
		}
	}
	
	/**
	 * Private function: 
	 * Resets the positions and rotations of the mahjong tiles
	 */
	function resetTiles() {
		var positions = createPositionArray(xCount, yCount, diameter);
		
		for(var i = 0; i < tiles.length; i++){
			tiles[i].setPosition(positions.pop());
		}
		rotateTiles();
		groupTiles();
	}
	
	/** 
	 * Private function: 
	 * Rotates all mahjong tiles randomly
	 */
	function rotateTiles() {
		for(var i = 0; i < tiles.length; i++){
			tiles[i].setRotation(Math.random() * 360);
		}
	}
	
	/**
	 * Private function:
	 * Groups the mahjong tiles close to each other
	 */
	function groupTiles() {
		// TODO: check rectangle intersection for the rotated tiles
	}
	
	/**
	 * Creates an array of possible positions for the mahjong tiles
	 * @returns {Array} the shuffled array of positions
	 */
	function createPositionArray() {
		var array = [];
		
		for(var y = 0; y < yCount; y++){
			for(var x = 0; x < xCount; x++){
				array.push(new Vector2(diameter + x * diameter * 2, diameter + y * diameter * 2))
			}
		}
		return shuffle(array);
	};
	
	/**
	 * Debug function
	 */
	this.print = function(){
		for(var i = 0; i < tiles.length; i++){
			tiles[i].print();
		}
	};
}


/**
 * A ScreenManager manages all the screens that the game is separated into
 */
function ScreenManager() {
	var menuScreen = new MenuScreen();
	var gameScreen = new GameScreen()
	var currentScreen = gameScreen;
	
	var map = [];	// Key input array
	var gameKeyCodes = [
	                    13, 32,				// Enter, Space
	                    37, 38, 39, 40	 	// Left, Up, Right, Down
	                    ];
	
	/**
	 * Loads the contents of the screens and sets up key events
	 */
	this.loadContent = function() {
		// Key events
		onkeydown = onkeyup = function(e) {
			e = e || event;
			map[e.keyCode] = e.type == 'keydown';

			// Debug
			console.log(e.keyCode);
			
			// If the key is used by the game (defined in gameKeyCodes), prevent event bubbling
			if(gameKeyCodes.indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		};
		
		menuScreen.loadContent();
		gameScreen.loadContent();
	}
	
	/**
	 * Switches the current screen
	 * @param screen {*Screen} the new screen
	 */
	this.switchScreen = function(screen) {
		currentScreen = screen;
	};
	
	/**
	 * Updates the current screen
	 */
	this.update = function() {
		currentScreen.update();
	}
	
	/**
	 * Draws the current screen
	 * @param canvas {Object} the canvas there the objects are drawn
	 */
	this.draw = function(canvas) {
		currentScreen.draw(canvas);
	}
	
	// The classes below should inherit a base class called Screen, but do not due to the lack of skills :P
	
	/**
	 * A MenuScreen contains the menu of the game
	 */
	function MenuScreen(manager) {
		
		/**
		 * Loads the content
		 */
		this.loadContent = function() {
			
		};
		
		/**
		 * Updates the menu
		 */
		this.update = function() {
			
		};
		
		/**
		 * Draws the menu
		 */
		this.draw = function(canvas) {
			
		};
	}
	
	/**
	 * A GameScreen contains all of the gameplay
	 */
	function GameScreen(manager) {
		var tileWidth = 60;
		var tileHeight = 90;
		var tileManager = new TileManager(tileWidth, tileHeight);
		
		/**
		 * Loads the content
		 */
		this.loadContent = function() {
			// Loading tile content
			tileManager.createTiles();
		};
		
		/**
		 * Updates the game logic
		 */
		this.update = function() {
			
		};
		
		/**
		 * Draws the game objects
		 * @param canvas {Object} the canvas where the objects are drawn
		 */
		this.draw = function(canvas) {
			tileManager.draw(canvas);
		}
		
		/**
		 * Private function:
		 * Modifies the screen to a new initial state
		 */
		function reset() {
			
		}
	}
}


/**
 * The mother of all creation, the game instance
 */
function MahjongGame() {
	var canvas = document.getElementById("mahjongCanvas");
	var screenManager = new ScreenManager();
	
	/**
	 * Loads the content
	 */
	this.loadContent = function() {
		// Animation looper
		window.requestAnimFrame = window.requestAnimationFrame || window.oRequestAnimationFrame;
		
		screenManager.loadContent();
		
		console.log("Content loaded!");
	};
	
	/**
	 * Start the game
	 */
	this.start = function() {
		animate();
		
		console.log("Game started!");
	}
	
	/**
	 * Starts the update/animation loop
	 */
	function animate() {
		// Clear canvas
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Request new 
		window.requestAnimFrame(animate);
		
		screenManager.update();
		screenManager.draw(canvas);
	}
}