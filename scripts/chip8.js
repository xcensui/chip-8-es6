class Chip8 {

	constructor() {
		this.reset(); //Because why would anyone want properties defined in their class right ES6 people?!
	}

	getOpcode() {
		return this.memory[this.counters[1]] << 8 | this.memory[this.counters[1] + 1];
	}

	start() {
		this.running = true;
		window.requestAnimationFrame(() => this.run());
	}

	run() {
		if (this.running) {
			for (var i = 0; i < 10; i++) {
				this.doCycle();
			}			

			this.stop();
		
			window.requestAnimationFrame(() => this.run());
		}
	}

	stop() {
		this.running = false;
	}

	reset() {
		console.log('Resetting Chip8');

		this.memory = new Uint8Array(new ArrayBuffer(0xfff));
		this.stack = new Uint16Array(new ArrayBuffer(0x10));
		this.reg = new Uint8Array(new ArrayBuffer(0x10));
		this.keyState = new Uint8Array(new ArrayBuffer(0x10));
		this.counters = new Uint16Array(new ArrayBuffer(4)); //Holds opcode, progCounter, addrReg, and timer.
		this.sound = new Chip8Sound();
		this.display = new Chip8Display();
		this.running = false;
		var font = this.systemFont();
		var i = 0;

		for (i; i < font.length; i++) {
			this.memory[i] = font[i];
		}

		this.counters[0] = 0;		//Opcode
		this.counters[1] = 0x200;	//PC
		this.counters[2] = 0;		//Reg
		this.counters[3] = 0;		//Timer

		console.log(this.counters);
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

	doCycle() {
		this.counters[0] = this.getOpcode();
		this.counters[1] += 2;

		this.handleOpcode();
	}

	opcodeNoSupport(source) {
		throw new Error('['+source+'] Opcode '+this.counters[0].toString(16)+' is not supported.');
	}

	handleOpcode() {
		switch(this.counters[0] & 0xF000) {
			case 0x0000:
				this.handleOpcode0();
				break;
			case 0x8000:
				this.handleOpcode8();
				break;
			case 0xE000:
				this.handleOpcodeE();
				break;
			case 0xF000:
				this.handleOpcodeF();
				break;
			default:
				this.opcodeNoSupport('Opcode');
		}
	}

	handleOpcode0() {
		switch(this.counters[0] & 0x00FF) {
			case 0x00E0:
				this.OpcodeE0();
				break;
			case 0x00EE:
				this.OpcodeEE();
				break;
			default:
				this.opcodeNoSupport('Opcode0');
		}
	}

	handleOpcode8() {
		switch(this.counter[0] & 0x000F) {
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}

	handleOpcodeE() {
		switch(this.counter[0] & 0x000F) {
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}

	handleOpcodeF() {
		switch(this.counter[0] & 0x00FF) {
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}
}