class CanvasRenderer {
	constructor(canvas, size) {
		this.context = canvas.getContext('2d');
		this.canvas = canvas;
		this.width = 64;
		this.height = 32;
		this.size = size;

		this.modWidth = this.width * this.size;
		this.modHeight = this.height * this.size;

		this.bgColour = 'transparent';
		this.fgColour = '#fff';

		this.frames = 0;
		this.lastFPSCheck = 0;
	}

	clear() {
		this.context.clearRect(0, 0, this.modWidth, this.modHeight);
	}

	frame(screen) {

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