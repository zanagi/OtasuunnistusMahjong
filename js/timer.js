function Timer(interval) {
	
	var start;
	var time = 0; // Millis
	var running = false;
	
	this.start = function() {
		start = new Date().getTime();
		window.setTimeout(update, interval);
		
		running = true;
	};
	
	this.stop = function() {
		running = false;
	};
	
	this.toString = function() {
		return (time / 1000.0).toFixed(1);
	}
	
	function update() {
		if(running) {
			time += interval;
			
			var diff = (new Date().getTime() - start) - time;
			window.setTimeout(update, (100 - diff));
		}
	}
}