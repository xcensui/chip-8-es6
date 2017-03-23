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
}