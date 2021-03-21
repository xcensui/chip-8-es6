class Chip8Display {
	constructor() {
		this.width = 64;
		this.height = 32;

		this.clearScreen();
	}

	clearScreen() {
		this.display = new Uint8Array(new ArrayBuffer(this.width*this.height));

		for (var i = 0; i < this.display.length; i++) {
			this.display[i] = 0;
		}
	}

	getScreen() {
		return this.display;
	}

	toggleXYValue(x, y) {
		if (x > this.width) {
			x -= this.width;
		}
		else if (x < 0) {
			x += this.width;
		}

		if (y > this.height) {
			y -= this.height;
		}
		else if (y < 0) {
			y += this.height;
		}

		var location = x + (y * this.width);

		this.display[location] ^= 1;

		return !this.display[location];
	}
}
