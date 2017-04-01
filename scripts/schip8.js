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
				this.opcode00FB();
				break;
			case 0x00FC:
				this.opcode00FC();
				break;
			case 0x00FD:
				this.opcode00FD();
				break;
			case 0x00FE:
				this.opcode00FE();
				break;
			case 0x00FF:
				this.opcode00FF();
				break;
			default:
				if ((this.nn >> 4) == 0x00C) {
					this.opcode00CN();
				}
				super();
				break;
		}
	}

	handleOpcodeF() {
		switch(this.nn) {
			case 0x0030:
				this.opcodeFX30();
				break;
			case 0x0075:
				this.opcodeFX75();
				break;
			case 0x0085:
				this.opcodeFX85();
				break;
			default:
				super();
				break;
		}		
	}

	opcode00CN() {

	}

	opcode00FB() {
		
	}

	opcode00FC() {
		
	}

	opcode00FD() {
		
	}

	opcode00FE() {
		
	}

	opcode00FF() {
		
	}

	opcodeFX30() {

	}

	opcodeFX75() {

	}

	opcodeFX85() {

	}
}