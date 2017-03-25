class CanvasRenderer {
	constructor(canvas, width, height, size) {
		this.canvas = canvas;
		this.width = width;
		this.height = height;
		this.size = size;

		this.frames = 0;
		this.lastFPSCheck = 0;
	}

	render() {

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