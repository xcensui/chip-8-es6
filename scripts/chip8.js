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
		this.stack = new Uint16Array(new ArrayBuffer(0x20));
		this.reg = new Uint8Array(new ArrayBuffer(0x10));
		this.keyState = new Uint8Array(new ArrayBuffer(0x10));
		this.counters = new Uint16Array(new ArrayBuffer(0x8)); //Holds opcode, progCounter, addrReg, and timer.
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

		console.log(this.memory);
		console.log(this.stack);
		console.log(this.reg);
		console.log(this.keyState);
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
		console.warn('['+source+'] Opcode '+this.counters[0].toString(16)+' is not supported.');
	}

	handleOpcode() {
		switch(this.counters[0] & 0xF000) {
			case 0x0000:
				this.handleOpcode0();
				break;
			case 0x1000:
				break;
			case 0x2000:
				break;
			case 0x3000:
				break;
			case 0x4000:
				break;
			case 0x5000:
				break;
			case 0x6000:
				break;
			case 0x7000:
				break;
			case 0x8000:
				this.handleOpcode8();
				break;
			case 0x9000:
				break;
			case 0xA000:
				break;
			case 0xB000:
				break;
			case 0xC000:
				break;
			case 0xD000:
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
			case 0x0001:
				break;
			case 0x0002:
				break;
			case 0x0003:
				break;
			case 0x0004:
				break;
			case 0x0005:
				break;
			case 0x0006:
				break;
			case 0x0007:
				break;
			case 0x000E:
				break;
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}

	handleOpcodeE() {
		switch(this.counter[0] & 0x000F) {
			case 0x0001:
				break;
			case 0x000E:
				break;
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}

	handleOpcodeF() {
		switch(this.counter[0] & 0x00FF) {
			case 0x0007:
				break;
			case 0x000A:
				break;
			case 0x0015:
				break;
			case 0x0018:
				break;
			case 0x001E:
				break;
			case 0x0029:
				break;
			case 0x0033:
				break;
			case 0x0055:
				break;
			case 0x0065:
				break;
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}
}