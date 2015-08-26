/**
 * A custom image class
 * Logic error: this class should have a position variable that can be changed through functions
 */
function GameImage(path, width, height) {
	var loaded = false;
	
	var img = new Image();
	img.onload = function() {
		loaded = true;
	};
	img.src = path;
	
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
			ctx.translate(pos.getX() + width / 2, pos.getY() + height / 2);
			ctx.rotate(toRadians(rotation));
			ctx.drawImage(img, -width / 2, -height / 2, width, height);	
			ctx.restore();
		}
	};
	
	/**
	 * Draws a rectangle in the same position the image would be drawn
	 * @param canvas {Object} the canvas where the rectangle is drawn
	 * @param pos {Vector2} the position vector where the rectangle should be drawn
	 * @param rotation {Number} the rotation (angle) of the rectangle
	 * @param colorString {String} the color (fill) string of the rectangle
	 */
	this.drawRect = function(canvas, pos, rotation, colorString) {
		var ctx = canvas.getContext("2d");
		ctx.save();
		ctx.translate(pos.getX() + width / 2, pos.getY() + height / 2);
		ctx.rotate(toRadians(rotation));
		ctx.fillStyle = colorString;
		ctx.fillRect(-width / 2, -height / 2, width, height);	
		ctx.restore();
	}
	
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
	var vertices = createVertices();
	var hovered = false;
	var picked = false;
	var center = new Vector2(position.getX() + img.getWidth() / 2, position.getY() + img.getHeight() / 2);
	
	/**
	 * Draws the mahjong tile
	 * @param canvas {Object} the canvas where the tile is drawn
	 */
	this.draw = function(canvas, camera) {
		for (var i = 0; i < vertices.length; i++){
			// Only draw the object if it's inside viewport
			if(camera.containsPoint(vertices[i])){
				img.draw(canvas, position, rotation);
				
				if(picked) {
					img.drawRect(canvas, position, rotation, "rgba(50, 50, 50, 0.75)");
				}
				else if(hovered) {
					img.drawRect(canvas, position, rotation, "rgba(200, 70, 70, 0.5)");
				}
				return;
			}
		}
	};

	this.drawZoneTile = function(canvas, zonePos, hoveredOnZone) {
		img.draw(canvas, zonePos, 0);
		if(hoveredOnZone) {
			img.drawRect(canvas, zonePos, 0, "rgba(200, 70, 70, 0.5)");
		}
	}
	
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
	 * @returns {Vector2} The position of this tile without rotation
	 */
	this.getPosition = function() {
		return position;
	}
	
	/**
	 * Gives the tile a new position, without rotation
	 * @param newPos {Vector2} the new position cector
	 */
	this.setPosition = function(newPos) {
		position = newPos;
		vertices = createVertices();
		updateCenter();
	};
	
	/**
	 * Gives the tile a new rotation
	 * @param newRotation {Number} the new rotation
	 */
	this.setRotation = function(newRotation) {
		rotation = newRotation;
		vertices = createVertices();
	};
	
	/**
	 * @param withoutRotation {Boolean} calculate vertices without rotation
	 * @returns {Array} the array of vertice vectors
	 */
	this.getVerticeArray = function() {
		return vertices;
	};
	
	/**
	 * @returns {Boolean} true, if this tile is being hovered (handled by TileManager), otherwise returns false
	 */
	this.getHovered = function() {
		return hovered;
	}
	
	/**
	 * Sets hovered value
	 * @param h {Boolean} new hovered value
	 */
	this.setHovered = function(h) {
		hovered = h;
	}
	
	/**
	 * @returns {Boolean} true, if this tile has been picked, otherwise returns false
	 */
	this.getPicked = function() {
		return picked;
	}
	
	/**
	 * Sets picked value
	 * @param p {Boolean} new picked value
	 */
	this.setPicked = function(p) {
		picked = p;
	}
	
	/**
	 * Debug function
	 */
	this.print = function() {
		console.log(img.getName() + ": " + position.toString());
		console.log("Path: " + img.getFullPath());
	};
	
	/**
	 * Private function:
	 * @returns {Array} The array of vertice vectors
	 */
	function createVertices() {
		var r = toRadians(rotation);
		var p = position.getX() + img.getWidth() / 2;
		var q = position.getY() + img.getHeight() / 2;
		var arr = [];
		
		for(var i = 0; i < 4; i++) {
			var x, y;
			
			if(i == 0){
				x = position.getX();
				y = position.getY();
			} else if(i == 1) {
				x = position.getX() + img.getWidth();
				y = position.getY();
			} else if(i == 2) {
				x = position.getX() + img.getWidth();
				y = position.getY() + img.getHeight();
			} else {
				x = position.getX();
				y = position.getY() + img.getHeight();
			}
			arr.push(new Vector2((x - p) * Math.cos(r) - (y - q) * Math.sin(r) + p,
   								(x - p) * Math.sin(r) + (y - q) * Math.cos(r) + q));
		}
		return arr;
	}
	
	/**
	 * temp
	 */
	this.distanceToTile = function(target) {
		var targetVertices = target.getVerticeArray();
		var distance = Number.MAX_VALUE;
		
		for(var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
			for(var x = 0; x < targetVertices.length; x++) {
				var vertice = targetVertices[x];
				
				var d = vertice.closestDistanceToLine(vertices[i], vertices[j]);
				
				if(d < distance) {
					distance = d;
				}
			}
		}
		for(var i = 0, j = targetVertices.length - 1; i < targetVertices.length; j = i++) {
			for(var x = 0; x < vertices.length; x++) {
				var vertice = vertices[x];
				
				var d = vertice.closestDistanceToLine(targetVertices[i], targetVertices[j]);
				
				if(d < distance) {
					distance = d;
				}
			}
		}
		return distance;
	}
	
	this.getCenter = function() {
		return center;
	}
	
	function updateCenter() {
		center = new Vector2(position.getX() + img.getWidth() / 2, position.getY() + img.getHeight() / 2);
	}
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
				var img = new GameImage(tileFolderPath + basicTileTypes[t] + "-" + i + ".png", tileWidth, tileHeight);
				
				pushTiles(img, positions, 4);
			}
		}
		
		// Add honor tiles
		for(var t = 0; t < honorTiles.length; t++){
			var img = new GameImage(tileFolderPath + honorTiles[t] + ".png", tileWidth, tileHeight);
			
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
	 * Updates the tiles based on mouse input
	 */
	this.update = function(mousePos) {
		var foundHovered = false;
		for(var i = 0; i < tiles.length; i++) {
			var tile = tiles[tiles.length - 1 - i];
			if(foundHovered) {
				tile.setHovered(false);
			} else {
				if(mousePos.isInPolygon(tile.getVerticeArray())) {
					tile.setHovered(true);
					foundHovered = true;
				} else {
					tile.setHovered(false);
				}
			}
		}
	};
	
	/**
	 * Draws the tiles
	 * @param canvas {Object} the canvas where the objects are drawn
	 */
	this.draw = function(canvas, camera) {
		for(var i = 0; i < tiles.length; i++) {
			tiles[i].draw(canvas, camera);
		}
	};
	
	
	/**
	 * @returns {Vector2} the maximum position that the camera should go to
	 */
	this.getMaxPos = function() {
		var maxX = 0;
		var maxY = 0;
		
		for(var i = 0; i < tiles.length; i++) {
			var vertices = tiles[i].getVerticeArray();
			
			for(var j = 0; j < vertices.length; j++) {
				var pos = vertices[j];
				
				if(pos.getX() > maxX) {
					maxX = pos.getX();
				}
				if(pos.getY() > maxY) {
					maxY = pos.getY();
				}
			}
		}
		
		// add (+100,+100) for some spacing
		var maxPos = new Vector2(maxX + diameter, maxY + diameter);
		return maxPos;
	};
	
	
	this.findHovered = function() {
		return tiles.find(function(t) {
			return t.getHovered();
		});
	}
	
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
			var rotation = Math.random() * 360;
			tiles[i].setRotation(rotation);
		}
	}
	
	/**
	 * Private function:
	 * Groups the mahjong tiles close to each other
	 */
	function groupTiles() {
		var min = Math.min(xCount, yCount);
		var max = Math.max(xCount, yCount);
		var movedTiles = [];
		
		for(var counter = 0; counter < max + min - 1; counter++) {
			// Array of tiles to be grouped on this iteration 
			var tilesArr = tiles.filter(function(t){
				return Math.abs(t.getPosition().getX() + t.getPosition().getY() - (2 + counter) * diameter) <= 1;
			});
			
			for (var i = 0; i < tilesArr.length; i++) {
				var tile = tilesArr[i];
				
				if(counter === 0) {
					movedTiles.push(tile);
				} else {
					// var target = randomArrayValue(movedTiles);
					var target = movedTiles[movedTiles.length - 1];
					var d = tile.distanceToTile(target);
					
					for(var j = 1; j < movedTiles.length; j++) {
						var nd = tile.distanceToTile(movedTiles[j]);
						
						if(nd < d) {
							d = nd;
							target = movedTiles[j];
						}
					}
					
					var newPosition = tile.getPosition().add(target.getCenter().subtract(tile.getCenter()).normalize().multiply(d));
					tile.setPosition(newPosition);
					movedTiles.push(tile);
				}
			}
		}
	}
	
	/**
	 * Creates an array of possible positions for the mahjong tiles
	 * @returns {Array} the shuffled array of positions
	 */
	function createPositionArray() {
		var array = [];
		
		for(var y = 0; y < yCount; y++){
			for(var x = 0; x < xCount; x++){
				array.push(new Vector2(diameter + x * diameter, diameter + y * diameter))
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
function ScreenManager(canvas) {
	var cardScreen = new CardScreen(this);
	var gameScreen = new GameScreen(this)
	var currentScreen = cardScreen;
	
	var map = [];	// Key input array
	var gameKeyCodes = [
	                    13, 32,				// Enter, Space
	                    37, 38, 39, 40	 	// Left, Up, Right, Down
	                    ];
	
	var click = false;
	var mouseCanvasPos = new Vector2(0, 0);
	var mousePos = new Vector2(0, 0);
	var camera = new Camera2D(canvas.width, canvas.height);
	var ctx = canvas.getContext("2d");
	
	/**
	 * Loads the contents of the screens and sets up key events
	 */
	this.loadContent = function() {
		defineEvents();
		
		cardScreen.loadContent();
		gameScreen.loadContent();
	}
	
	function defineEvents() {
		// Key events
		onkeydown = onkeyup = function(e) {
			e = e || event;
			map[e.keyCode] = e.type == 'keydown';

			// Debug
			//console.log(e.keyCode);
			
			// If the key is used by the game (defined in gameKeyCodes), prevent event bubbling
			if(gameKeyCodes.indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		};

		// Mouse event
		window.addEventListener('mousemove', function(e) {
			var rect = canvas.getBoundingClientRect();
			mouseCanvasPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top)
		}, false);
		
		canvas.onclick = function() {
			click = true;
		};
	}
	
	/**
	 * Switches the current screen
	 * @param screen {*Screen} the new screen
	 */
	this.switchScreen = function(screen) {
		camera.reset();
		screen.loadContent();
		currentScreen = screen;
	};
	
	/**
	 * Updates the current screen
	 */
	this.update = function() {
		currentScreen.update();
		click = false;
	}
	
	/**
	 * Draws the current screen
	 * @param canvas {Object} the canvas there the objects are drawn
	 */
	this.draw = function() {
		var tl = camera.getTranslation();
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.translate(-tl.getX(), -tl.getY());
		currentScreen.draw(canvas);
		ctx.translate(tl.getX(), tl.getY());
	}
	
	/**
	 * Private function:
	 * Sets the mouse position
	 * @param tl {Vector2} camera translation vector
	 */
	function setMousePos(tl) {
	    mousePos = mouseCanvasPos.add(tl);
	}
	
	// The classes below should inherit a base class called Screen, but do not due to the lack of JS skills, 2 hard 4 mii :P
	
	/**
	 * A MenuScreen contains the menu of the game
	 */
	function CardScreen(manager) {
		var cardManager = new CardManager("cards/cards.json", 85, 170, 150);
		var translation = new Vector2(0, 0);
		var cardsIcon, iconHovered, startButton;
		var iconPos = new Vector2(canvas.width - 175, 25);
		var startButtonPos = new Vector2((canvas.width - 200) / 2, canvas.height - 125);
		
		/**
		 * Loads the content
		 */
		this.loadContent = function() {
			camera.reset();
			
			cardsIcon = new GameImage("images/cards/cardsIcon.png", 100, 100);
			startButton = new GameImage("images/startButton.png", 200, 100);
			
			cardManager.loadContent();
		};
		
		/**
		 * Updates the menu
		 */
		this.update = function() {
			setMousePos(translation);
			
			iconHovered = mousePos.getX() >= iconPos.getX() && mousePos.getX() <= iconPos.getX() + cardsIcon.getWidth()
							&& mousePos.getY() >= iconPos.getY() && mousePos.getY() <= iconPos.getY() + cardsIcon.getHeight();
			
			cardManager.update(mousePos, click, 3);
			
			if(cardManager.isPickComplete()) {
				if(click) {
					var startButtonHovered = mousePos.getX() >= startButtonPos.getX() &&
																mousePos.getX() <= startButtonPos.getX() + startButton.getWidth() &&
																mousePos.getY() >= startButtonPos.getY() &&
																mousePos.getY() <= startButtonPos.getY() + startButton.getHeight();
					if(startButtonHovered) {
						manager.switchScreen(new GameScreen(manager, cardManager));
					}
				}
			}
		};
		
		/**
		 * Draws the menu
		 */
		this.draw = function(canvas) {
			var picked = cardManager.getPickedCards().length; 
			if(picked > 0) {
				cardsIcon.draw(canvas, iconPos, 0);
			}
			if(cardManager.isPickComplete() || (iconHovered && picked > 0)) {
				cardManager.drawPicked(canvas);
			} else {
				ctx.font = "50px Verdana";
				ctx.fillText("Pick (click) a card:", 350, 100);
				cardManager.drawBack(canvas);
			}

			if(cardManager.isPickComplete()) {
				startButton.draw(canvas, startButtonPos, 0);
			}
		};
	}
	
	/**
	 * A GameScreen contains all of the gameplay
	 */
	function GameScreen(manager, cardManager) {
		var tileWidth = 60;
		var tileHeight = 90;
		var tileManager = new TileManager(tileWidth, tileHeight);
		var handZone = new HandZone(canvas.width - 50, 100, 25, tileWidth, tileHeight);
		
		var speed = 15;
		var minPos, maxPos;
		
		var origin = new Vector2(0, 0);
		var timer = new Timer(100);
		var timeLimit1 = 30;
		var timeLimit2 = 60;
		var background, timerBg, submitButton, submitPos;
		
		var cardsIcon, iconHovered;
		var iconPos = new Vector2(canvas.width - 175, 25);
		
		/**
		 * Loads the content
		 */
		this.loadContent = function() {
			// Loading tile content
			tileManager.createTiles();
			minPos = new Vector2(0, 0);
			maxPos = tileManager.getMaxPos();
			
			background = new GameImage("images/gameBg.png", tileManager.getMaxPos().getX(), tileManager.getMaxPos().getY());
			timerBg = new GameImage("images/timerZone.png", 200, 75);
			submitButton = new GameImage("images/submitButton.png", 200, 50);
			cardsIcon = new GameImage("images/cards/cardsIcon.png", 100, 100);
			
			handZone.loadContent();
			
			timer.start();
		};
		
		/**
		 * Updates the game logic
		 */
		this.update = function() {
			if(timer.getTime() >= timeLimit2) {
				timer.stop();
				manager.switchScreen(new EndScreen(manager, handZone.getTiles(), timer.toString(), cardManager));
				return;
			}
			// Check key input
			if(map[37]) {
				camera.updateTranslation(new Vector2(-speed, 0), minPos, maxPos);
			}
			if(map[38]) {
				camera.updateTranslation(new Vector2(0, -speed), minPos, maxPos);
			}
			if(map[39]) {
				camera.updateTranslation(new Vector2(speed, 0), minPos, maxPos);
			}
			if(map[40]) {
				camera.updateTranslation(new Vector2(0, speed), minPos, maxPos);
			}
			var translation = camera.getTranslation();
			setMousePos(translation);
			
			// Update handZone
			var zonePos = new Vector2(translation.getX() + handZone.getMargin(),
										translation.getY() + canvas.height - handZone.getHeight());
			handZone.update(mousePos, click, zonePos);
			
			submitPos = new Vector2(translation.getX() + (canvas.width - submitButton.getWidth()) / 2,
										translation.getY() + canvas.height - 100 - submitButton.getHeight())
			var submitHover = mousePos.getX() >= submitPos.getX() &&  mousePos.getX() <= submitPos.getX() + submitButton.getWidth()
								&& mousePos.getY() >= submitPos.getY() && mousePos.getY() <= submitPos.getY() + submitButton.getHeight();
			
			// If not on handZone
			if(mousePos.getX() < zonePos.getX() || mousePos.getX() > zonePos.getX() + handZone.getWidth()
					|| mousePos.getY() < zonePos.getY() || mousePos.getY() > zonePos.getY() + handZone.getHeight()) {
				if(click) {
					// If hand completed and submitted, switch screens, end function
					if(handZone.isFull() && submitHover) {
						timer.stop();
						manager.switchScreen(new EndScreen(manager, handZone.getTiles(), timer.getTime(), cardManager));
						return;
					}
					
					var hovered = tileManager.findHovered();
					
					if(hovered) {
						if(!hovered.getPicked()) {
							handZone.pushTile(hovered);
						}
					}
				}
				tileManager.update(mousePos);
			}
			
			iconPos = translation.add(new Vector2(canvas.width - 175, 25));
			iconHovered = mousePos.getX() >= iconPos.getX() && mousePos.getX() <= iconPos.getX() + cardsIcon.getWidth()
							&& mousePos.getY() >= iconPos.getY() && mousePos.getY() <= iconPos.getY() + cardsIcon.getHeight();
		};
		
		/**
		 * Draws the game objects
		 * @param canvas {Object} the canvas where the objects are drawn
		 */
		this.draw = function(canvas) {
			var translation = camera.getTranslation();
			
			// Draw the background
			background.draw(canvas, origin, 0);
			
			// Draw tiles
			tileManager.draw(canvas, camera);
			
			// Draw hand zone
			handZone.draw(canvas, mousePos);
			if(handZone.isFull()) {
				// TODO: Draw submit button
				submitButton.draw(canvas, submitPos, 0);
			}

			// Draw timer		
			timerBg.draw(canvas, new Vector2(translation.getX() + 450, translation.getY() - 1), 0);
			
			var str = timer.toString();
			ctx.font = "50px Verdana";
			ctx.fillText(str, translation.getX() + 510 - (str.length - 3) * 17,  translation.getY() + 50);
			// console.log(timer.toString()); // debug
			
			// Icon & Cards
			cardsIcon.draw(canvas, iconPos, 0);
			if(iconHovered) {
				cardManager.drawPicked(canvas, translation);
			}
		};
		
		/**
		 * Private function:
		 * Modifies the screen to a new initial state
		 */
		function reset() {
			camera.reset();
		}
	}
	
	function EndScreen(manager, tiles, time, cardManager) {
		var ngButton;
		var buttonPos = new Vector2((canvas.width - 200) / 2, canvas.height - 125);
		
		this.loadContent = function() {
			ngButton = new GameImage("images/ngButton.png", 200, 100);
			
			for(var i = 0; i < tiles.length; i++) {
				tiles[i].setRotation(0);
				tiles[i].setPosition(new Vector2(35 + i * 75, 40));
				tiles[i].setPicked(false);
			}
		};
		
		this.update = function() {
			setMousePos(new Vector2(0, 0));
			
			if(click) {
				if(mousePos.getX() >= buttonPos.getX() && mousePos.getX() <= buttonPos.getX() + ngButton.getWidth()
						&& mousePos.getY() >= buttonPos.getY() && mousePos.getY() <= buttonPos.getY() + ngButton.getHeight()) {
					manager.switchScreen(new CardScreen(manager));
				}
			}
		};
		
		this.draw = function(canvas) {
			ctx.font = "16px Verdana";
			ctx.fillText("Time: " + time, 525, 20);
			
			for(var i = 0; i < tiles.length; i++) {
				tiles[i].draw(canvas, camera);
			}
			
			cardManager.drawPicked(canvas);
			ngButton.draw(canvas, buttonPos, 0);
		};
	}
}


function HandZone(zoneWidth, zoneHeight, margin, tileWidth, tileHeight) {
	var img;
	var tiles = [];
	var handSize = 14;
	var pos;
	var tileSpace = 10;
	var tileMargin = (zoneWidth - handSize * (tileWidth + tileSpace)) / 2;
	
	this.loadContent = function() {
		img = new GameImage("images/handZone.png", zoneWidth, zoneHeight);
	};
	
	this.getTiles = function() {
		return tiles;
	};
	
	this.getHeight = function() {
		return zoneHeight;
	};
	
	this.getWidth = function() {
		return zoneWidth;
	};
	
	this.getMargin = function() {
		return margin;
	};
	
	this.isFull = function() {
		return tiles.length == handSize;
	};
	
	this.pushTile = function(tile) {
		if(tiles.length < handSize) {
			tile.setPicked(true);
			tiles.push(tile);
		} else {
			// TODO: error message (effects)
		}
	};
	
	this.update = function(mousePos, click, zonePos) {
		pos = zonePos;
		
		for(var i = 0; i < tiles.length; i++) {
			// Clicked -> remove
			if(click){
				if(isTileHovered(i, mousePos)) {
					tiles[i].setPicked(false);
					tiles.splice(i, 1);
					break;
				}
			}
		}
	};
	
	this.draw = function(canvas, mousePos) {
		img.draw(canvas, pos, 0);
		
		var hasHovered = false;
		
		for(var i = 0; i < tiles.length; i++) {
			var h = false;
			
			if(!hasHovered) {
				h = isTileHovered(i, mousePos);
				hasHovered = h;
			}
			tiles[i].drawZoneTile(canvas, getTilePosition(i), h);
		}
	};
	
	function getTilePosition(index) {
		return pos.add(new Vector2(tileMargin + index * (tileWidth + tileSpace), (zoneHeight - tileHeight) / 2));
	}
	
	function isTileHovered(index, mousePos) {
		var tilePos = getTilePosition(index);
		
		return mousePos.getX() >= tilePos.getX() && mousePos.getX() <= tilePos.getX() + tileWidth
				&& mousePos.getY() >= tilePos.getY() && mousePos.getY() <= tilePos.getY() + tileHeight;
	}
}

function CardManager(path, space, startX, startY) {
	var cards = [];
	var pickedCards = [];
	var waitingCards = [];
	var pickComplete = false;
	var loaded = false;
	var animating = false;
	var folder = "cards/";
	var cardBack;
	var maxCardCount = 3;
	
	this.loadContent = function() {
		$.get(path, function(data){
			loadCards(data);
		}, "json")
		.fail(function(a, b, c){
			displayError("Invalid file: " + path);
		});
		
		cardBack = new GameImage("images/cards/cardBack.png", 200, 300);
	};
	
	this.finishedLoading = function() {
		return loaded && cards.length > 0 && cards.every(function(c){
			return c.isLoaded();
		});
	};
	
	this.update = function(mousePos, click, count) {
		if(this.finishedLoading()) {
			while(waitingCards.length < count) {
				waitingCards.push(this.getRandomCard());
			}
			if(click) {
				for(var i = 0; i < waitingCards.length; i++) {
					var cardPos = new Vector2(startX + (cardBack.getWidth() + space) * i, startY);
					var mouseOn = mousePos.getX() >= cardPos.getX() && mousePos.getX() <= cardPos.getX() + waitingCards[i].getWidth()
									&& mousePos.getY() >= cardPos.getY() && mousePos.getY() <= cardPos.getY() + waitingCards[i].getHeight();

					if(mouseOn && !pickComplete) {
						var temp = waitingCards.splice(i, 1)[0];
						pickedCards.push(temp);
						pickComplete = pickedCards.length == maxCardCount;
						return;
					}
				}
			}
		}
	};
	
	this.isPickComplete = function() {
		return pickComplete;
	}
	
	this.getRandomCard = function() {
		return randomArrayValue(cards);
	};
	
	this.drawPicked = function(canvas, tl) {
		var translation = new Vector2(0, 0);
		if(tl) translation = tl;
		
		for(var i = 0; i < pickedCards.length; i++) {
			var cardPos = translation.add(new Vector2(startX + (cardBack.getWidth() + space) * i, startY));
			pickedCards[i].draw(canvas, cardPos);
		}
	};
	
	this.drawBack = function(canvas, tl) {
		if(this.finishedLoading()) {
			var translation = new Vector2(0, 0);
			if(tl) translation = tl;
			
			for(var i = 0; i < waitingCards.length; i++) {
				var cardPos = translation.add(new Vector2(startX + (cardBack.getWidth() + space) * i, startY));
				waitingCards[i].drawBack(canvas, cardPos);
			}
		}
	};
	
	this.getPickedCards = function() {
		return pickedCards;
	}
	
	function loadCards(data) {
		var check = false;
		for(var property in data) {
			if(check) {
				console.log("Multiple lines in cards file?");
				break;
			}
			if(property != "cards") {
				console.log("Property not named cards?");
				break;
			}
			var cardFiles = data[property].split(";");
			
			for(var i = 0; i < cardFiles.length; i++) {
				cards.push(new Card(folder + cardFiles[i]));
			}
			check = true;
		}
		loaded = true;
		
		for(var i = 0; i < cards.length; i++) {
			cards[i].loadContent();
		}
	}
}

function Card(path) {
	var name, description, imagePath, value, image, fullImage, cardBase, cardBack;
	var loaded = false;
	var cardWidth = 200;
	var cardHeight = 300;
	
	this.loadContent = function() {
		cardBase = new GameImage("images/cards/card.png", cardWidth, cardHeight);
		cardBack = new GameImage("images/cards/cardBack.png", cardWidth, cardHeight);
		
		$.get(path, function(data){
			loadValues(data);
		}, "json")
		.fail(function(a, b, c){
			console.log("Couldn't load card: " + path);
		});
	};
	
	this.getWidth = function() {
		return cardWidth;
	};
	
	this.getHeight = function() {
		return cardHeight;
	};
	
	this.draw = function(canvas, pos) {
		if(fullImage) {
			fullImage.draw(canvas, pos, 0)
		} else {
			cardBase.draw(canvas, pos, 0);
			
			var ctx = canvas.getContext("2d");
			if(name) {
				ctx.font = "12px Verdana";
				ctx.fillText(name, pos.getX() + 15, pos.getY() + 25);
			}
			if(description) {
				// TODO:
			}
		}
		
	};
	
	this.drawBack = function(canvas, pos) {
		cardBack.draw(canvas, pos, 0);
	}
	
	this.isLoaded = function() {
		return loaded;
	}
	
	function loadValues(data) {
		if(data["fullImagePath"]) {
			imagePath = data["fullImagePath"];
			fullImage = new GameImage(imagePath, cardWidth, cardHeight);
		} else {
			name = data["name"];
			description = data["description"];
			imagePath = data["imagePath"];
			value = data["value"];
			image = new GameImage(imagePath, cardWidth, cardHeight);
		}
		loaded = true;
	}
}

/**
 * The mother of all creation, the game instance
 */
function MahjongGame() {
	var canvas = document.getElementById("mahjongCanvas");
	var screenManager = new ScreenManager(canvas);
	
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
		// Request new 
		window.requestAnimFrame(animate);
	
		// Update and draw
		screenManager.update();
		screenManager.draw();
	}
}