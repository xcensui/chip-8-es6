class SuperChip8 extends Chip8 {
	constructor(renderer) {
		super(renderer);
	}

	reset() {
		super();
		this.hp48 = new Uint8Array(new ArrayBuffer(0x7));
		this.extended = false;
	}

	handleOpcode() {
		switch(this.o) {
			case: 0x0000:
				this.handleOpcode0();
				break;
			case: 0xF000:
				this.handleOpcodeF();
				break;
			default:
				super();
				break
		}
	}

	handleOpcode0() {
		switch(this.nn) {
			case 0x00FB:
				this.Opcode00FB();
				break;
			case 0x00FC:
				this.Opcode00FC();
				break;
			case 0x00FD:
				this.Opcode00FD();
				break;
			case 0x00FE:
				this.Opcode00FE();
				break;
			case 0x00FF:
				this.Opcode00FF();
				break;
			default:
				if ((this.nn >> 4) == 0x00C) {
					this.Opcode00CN();
				}
				else {
					super();
				}
				break;
		}
	}

	handleOpcodeF() {
		switch(this.nn) {
			case 0x0030:
				this.OpcodeFX30();
				break;
			case 0x0075:
				this.OpcodeFX75();
				break;
			case 0x0085:
				this.OpcodeFX85();
				break;
			default:
				super();
				break;
		}		
	}

	Opcode00CN() {

	}

	Opcode00FB() {
		
	}

	Opcode00FC() {
		
	}

	Opcode00FD() {
		
	}

	Opcode00FE() {
		
	}

	Opcode00FF() {
		
	}

	OpcodeFX30() {

	}

	OpcodeFX75() { //FX75 Stores Reg 0 to Reg X into HP48 0 to HP48 X
		for (var i = 0; i <= this.x; i++) {
			this.hp48[i] = this.reg[i];
		}
	}

	OpcodeFX85() { //FX85 Stores HP48 0 to HP48 X in Reg 0 to Reg X
		for (var i = 0; i <= this.x; i++) {
			this.reg[i] = this.hp48[i];
		}
	}
}