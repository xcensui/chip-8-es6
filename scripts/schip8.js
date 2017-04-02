class SuperChip8 extends Chip8 {
	constructor(width, height, renderer) {
		super(width, height, renderer);
	}

	reset() {
		this.hp48 = new Uint8Array(new ArrayBuffer(0x7));
		this.extended = false;
		super.reset();
	}

	handleOpcode() {
		switch(this.o) {
			case 0x0000:
				this.handleOpcode0();
				break;
			case 0xF000:
				this.handleOpcodeF();
				break;
			default:
				super.handleOpcode();
				break
		}
	}

	handleOpcode0() {
		switch(this.nn) {
			case 0x00FB:
				console.log('Opcode00FB');
				this.Opcode00FB();
				break;
			case 0x00FC:
				console.log('Opcode00FC');
				this.Opcode00FC();
				break;
			case 0x00FD:
				console.log('Opcode00FD');
				this.Opcode00FD();
				break;
			case 0x00FE:
				console.log('Opcode00FE');
				this.Opcode00FE();
				break;
			case 0x00FF:
				console.log('Opcode00FF');
				this.Opcode00FF();
				break;
			default:
				if ((this.nn >> 4) == 0x00C) {
					console.log('Opcode00CN');
					this.Opcode00CN();
				}
				else {
					super.handleOpcode0();
				}
				break;
		}
	}

	handleOpcodeF() {
		switch(this.nn) {
			case 0x0030:
				console.log('OpcodeFX30');
				this.OpcodeFX30();
				break;
			case 0x0075:
				console.log('OpcodeFX75');
				this.OpcodeFX75();
				break;
			case 0x0085:
				console.log('OpcodeFX85');
				this.OpcodeFX85();
				break;
			default:
				super.handleOpcodeF();
				break;
		}		
	}

	Opcode00CN() {

	}

	Opcode00FB() {
		
	}

	Opcode00FC() {
		
	}

	Opcode00FD() { //00FD - Stops emulation cycle
		console.log('Exiting Emulator');
		this.running = false;		
	}

	Opcode00FE() { //00FE - Disables extended mode
		console.log('Extended mode: OFF');
		this.extended = false;		
	}

	Opcode00FF() { //00FF - Enables extended mode
		console.log('Extended mode: ON');
		this.extended = true;		
	}

	OpcodeFX30() { //FX30 - Sets Addr Reg = Location of Sprite in Reg X
		this.counters[2] = (this.reg[this.x] * 10);
	}

	OpcodeFX75() { //FX75 - Stores Reg 0 to Reg X in  HP48 0 to HP48 X
		for (var i = 0; i <= this.x; i++) {
			this.hp48[i] = this.reg[i];
		}
	}

	OpcodeFX85() { //FX85 - Stores HP48 0 to HP48 X in Reg 0 to Reg X
		for (var i = 0; i <= this.x; i++) {
			this.reg[i] = this.hp48[i];
		}		
	}
}