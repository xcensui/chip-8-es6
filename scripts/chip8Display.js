class Chip8Display {
	constructor() {
		this.width = 64;
		this.height = 32;

		this.clearScreen();
	}

	clearScreen() {
		console.log('Chip 8 Display clear');
		this.display = new Uint8Array(new ArrayBuffer(this.width*this.height));
	}

	toggleXYValue(x, y) {
		x %= this.width;
		y %= this.height;

		if (y + 1 == this.height) {
			return true;
		}
		
		var location = x + (y * this.width);

		this.display[location] ^= 1


		return !this.display[location]
	}
}