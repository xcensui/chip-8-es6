class CanvasRenderer {
	constructor(canvas, size, width, height) {
		this.context = canvas.getContext('2d');
		this.canvas = canvas;
		this.size = size;

		this.reset(width, height);
		this.colours = ['#000', '#fff']; //BG, FG
	}

	reset(width, height) {
		this.lastFPSCheck = 0;
		this.frames = 0;
		this.setWidthHeight(width, height);
	}

	clear() {
		this.context.clearRect(0, 0, (this.width * this.size), this.height * this.size);
	}

	setWidthHeight(width, height) {
		this.width = width;
		this.height = height;
		this.setCanvasSize();
	}

	setCanvasSize() {
		this.canvas.width = (this.width * this.size);
		this.canvas.height = (this.height * this.size);
		this.clear();
	}

	frame(screen) {
		this.clear();

		for (var i = 0; i < screen.length; i++) {
			var x = (i % this.width) * this.size;
			var y = Math.floor((i / this.width)) * this.size;

			this.context.fillStyle = this.colours[screen[i]];
			this.context.fillRect(x, y, this.size, this.size);
		}

		this.frames++;
	}

	getFPS() {
		var fps = this.frames / ((new Date - this.lastFPSCheck) * 1000);

		if (fps === Infinity) {
			fps = 0;
		}

		this.frames = 0;
		this.lastFPSCheck = new Date;
		return fps;
	}
}