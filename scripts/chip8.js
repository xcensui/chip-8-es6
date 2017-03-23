class Chip8 {

	constructor() {
		this.reset(); //Because why would anyone want properties defined in their class right ES6 people?!
	}

	getOpcode() {
		return this.memory[this.progCounter[0]] << 8 | this.memory[this.progCounter[0] + 1];
	}

	start() {
		this.running = true;

		window.requestAnimationFrame(this.run());
	}

	run() {
		if (this.running) {
			for (var i = 0; i < 10; i++) {
				console.log(this.getOpcode());
				this.progCounter[0] += 2;
			}			

			this.running = false;
		}		
		window.requestAnimationFrame(this.run());
	}

	doCycle() {

	}

	reset() {
		console.log('Resetting Chip8');

		this.memory = new Uint8Array(new ArrayBuffer(0xfff));
		this.stack = new Uint16Array(new ArrayBuffer(0x10));
		this.reg = new Uint8Array(new ArrayBuffer(0x10));
		this.keyState = new Uint8Array(new ArrayBuffer(0x10));
		this.opcode = new Uint16Array(1);
		this.progCounter = new Uint16Array(1);
		this.addrReg = new Uint16Array(1);
		this.timer = new Uint16Array(1);
		this.sound = new Chip8Sound();
		this.display = new Chip8Display();
		this.running = false;
		var font = this.systemFont();
		var i = 0;

		for (i; i < font.length; i++) {
			this.memory[i] = font[i];
		}

		console.log(this.memory);

		this.progCounter[0] = 0x200;
		this.addrReg[0] = 0;
		this.timer[0] = 0;
		this.opcode[0] = 0;
	}

	systemFont() {
		return [
			0xF0, 0x90, 0x90, 0x90, 0xF0,
            0x20, 0x60, 0x20, 0x20, 0x70,
            0xF0, 0x10, 0xF0, 0x80, 0xF0,
            0xF0, 0x10, 0xF0, 0x10, 0xF0,
            0x90, 0x90, 0xF0, 0x10, 0x10,
            0xF0, 0x80, 0xF0, 0x10, 0xF0,
            0xF0, 0x80, 0xF0, 0x90, 0xF0,
            0xF0, 0x10, 0x20, 0x40, 0x40,
            0xF0, 0x90, 0xF0, 0x90, 0xF0,
            0xF0, 0x90, 0xF0, 0x10, 0xF0,
            0xF0, 0x90, 0xF0, 0x90, 0x90,
            0xE0, 0x90, 0xE0, 0x90, 0xE0,
            0xF0, 0x80, 0x80, 0x80, 0xF0,
            0xE0, 0x90, 0x90, 0x90, 0xE0,
            0xF0, 0x80, 0xF0, 0x80, 0xF0,
            0xF0, 0x80, 0xF0, 0x80, 0x80
		];
	}
}