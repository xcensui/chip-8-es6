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
		this.stack = new Array(16);
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
	}

	getKeyPressed() {
		var key = null;

		return key;
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

	handleTimers() {
		if (this.counters[3] > 0) {
			this.counters[3]--;
		}

		this.sound.handleTimers();
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
				this.Opcode1NNN();
				break;
			case 0x2000:
				this.Opcode2NNN();
				break;
			case 0x3000:
				this.Opcode3XNN();
				break;
			case 0x4000:
				this.Opcode4XNN();
				break;
			case 0x5000:
				this.Opcode5XY0();
				break;
			case 0x6000:
				this.Opcode6XNN();
				break;
			case 0x7000:
				this.Opcode7XNN();
				break;
			case 0x8000:
				this.handleOpcode8();
				break;
			case 0x9000:
				this.Opcode9XY0();
				break;
			case 0xA000:
				this.OpcodeANNN();
				break;
			case 0xB000:
				this.OpcodeBNNN();
				break;
			case 0xC000:
				this.OpcodeCXNN();
				break;
			case 0xD000:
				this.OpcodeDXYN();
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
				this.Opcode00E0();
				break;
			case 0x00EE:
				this.Opcode00EE();
				break;
			default:
				this.opcodeNoSupport('Opcode0');
		}
	}

	handleOpcode8() {
		switch(this.counter[0] & 0x000F) {
			case 0x0000:
				this.Opcode8XY0();
				break;
			case 0x0001:
				this.Opcode8XY1();
				break;
			case 0x0002:
				this.Opcode8XY2();
				break;
			case 0x0003:
				this.Opcode8XY3();
				break;
			case 0x0004:
				this.Opcode8XY4();
				break;
			case 0x0005:
				this.Opcode8XY5();
				break;
			case 0x0006:
				this.Opcode8XY6();
				break;
			case 0x0007:
				this.Opcode8XY7();
				break;
			case 0x000E:
				this.Opcode8XYE();
				break;
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}

	handleOpcodeE() {
		switch(this.counter[0] & 0x000F) {
			case 0x0001:
				this.OpcodeEXA1();
				break;
			case 0x000E:
				this.OpcodeEX9E();
				break;
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}

	handleOpcodeF() {
		switch(this.counter[0] & 0x00FF) {
			case 0x0007:
				this.OpcodeFX07();
				break;
			case 0x000A:
				this.OpcodeFX0A();
				break;
			case 0x0015:
				this.OpcodeFX15();
				break;
			case 0x0018:
				this.OpcodeFX18();
				break;
			case 0x001E:
				this.OpcodeFX1E();
				break;
			case 0x0029:
				this.OpcodeFX29();
				break;
			case 0x0033:
				this.OpcodeFX33();
				break;
			case 0x0055:
				this.OpcodeFX55();
				break;
			case 0x0065:
				this.OpcodeFX65();
				break;
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}

	Opcode00E0() { //00E0 - Clear Screen
		this.display.clearScreen();
	}

	Opcode00EE() { //00EE - Return From Sub
		var counter = this.stack.pop();

		if (counter !== undefined) {
			this.counters[1] = counter;
		}
	}

	Opcode1NNN() { //1NNN - Jump To
		this.counters[1] = (this.counters[0] & 0x0FFF);
	}

	Opcode2NNN() { //2NNN Save Position and Jump To
		this.stack.push(this.counters[1]);
		this.counters[1] = (this.counters[0] & 0x0FFF);		
	}

	Opcode3XNN() { //3XNN - Skip Next Instruction if Reg X = NN
		var x = (this.counters[0] & 0x0F00) >> 8;
		var nn = this.counters[0] & 0x00FF;

		if (this.reg[x] == nn) {
			this.counters[1] += 2;
		}
	}

	Opcode4XNN() { //4XNN - Skip Next Instruction if Reg X != NN
		var x = (this.counters[0] & 0x0F00) >> 8;
		var nn = this.counters[0] & 0x00FF;

		if (this.reg[x] != nn) {
			this.counters[1] += 2;
		}
	}

	Opcode5XY0() { //5XY0 - Skip Next Instruction if Reg X = Reg Y
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x00F0) >> 4;

		if (this.reg[x] == this.reg[y]) {
			this.counters[1] += 2;
		}
	}

	Opcode6XNN() { //6XNN - Set Reg X = NN
		var x = (this.counters[0] & 0x0F00) >> 8;
		var nn = this.counters[0] & 0x00FF;

		this.reg[x] = nn;
	}

	Opcode7XNN() { //7XNN - Add NN to Reg X
		var x = (this.counters[0] & 0x0F00) >> 8;
		var nn = this.counters[0] & 0x00FF;

		this.reg[x] += nn;
	}

	Opcode8XY0() { //8XY0 - Set Reg X = Reg Y
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x00F0) >> 4;

		this.reg[x] = this.reg[y];
	}

	Opcode8XY1() { //8XY1 - Set Reg X = (Reg X OR Reg Y)
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x00F0) >> 4;

		this.reg[x] |= this.reg[y];
	}

	Opcode8XY2() { //8XY2 - Set Reg X = (Reg X AND Reg Y)
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x00F0) >> 4;

		this.reg[x] &= this.reg[y];
	}

	Opcode8XY3() { //8XY3 - Set Reg X = (Reg X XOR Reg Y)
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x00F0) >> 4;

		this.reg[x] ^= this.reg[y];
	}

	Opcode8XY4() { //8XY4 - Set Reg X = Reg X + Reg Y with Carry
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x00F0) >> 4;
		this.reg[0xF] = 0;

		if ((this.reg[x] + this.reg[y]) > 255) {
			this.reg[0xF] = 1;
		}

		this.reg[x] += this.reg[y];
	}

	Opcode8XY5() { //8XY5 - Set Reg X = Reg X - Reg Y with Carry
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x00F0) >> 4;
		this.reg[0xF] = 1;

		if (this.reg[x] < this.reg[y]) {
			this.reg[0xF] = 0;
		}

		this.reg[x] -= this.reg[y];
	}

	Opcode8XY6() { //8XY6 - Divide Reg X by 2 with Carry on LSB = 1
		var x = (this.counters[0] & 0x0F00) >> 8;
		this.reg[0xF] = (this.reg[x] & 0x1);
		this.reg[x] >>= 1;
	}

	Opcode8XY7() { //8XY7 - Set Reg X = (Reg Y - Reg X) with Carry on Not Borrow
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x00F0) >> 4;
		this.reg[0xF] = 1;

		if (this.reg[y] < this.reg[x]) {
			this.reg[0xF] = 0;
		}

		this.reg[x] = (this.reg[y] - this.reg[x]);
	}

	Opcode8XYE() { //8XYE - Multiply Reg X by 2 with Carry on MSB = 1
		var x = (this.counters[0] & 0x0F00) >> 8;
		this.reg[0xF] = (this.reg[x] >> 7);
		this.reg[x] <<= 1;
	}

	Opcode9XY0() { //9XY0 - Skip Next Instruction if Reg X != Reg Y
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x0F00) >> 4;

		if (this.reg[x] != this.reg[y]) {
			this.counters[1] += 2;
		}
	}

	OpcodeANNN() { //ANNN - Sets Addr Register to NNN
		this.counters[2] = (this.counters[0] & 0x0FFF);
	}

	OpcodeBNNN() { //BNNN - Set Prog Counter = (NNN + Reg 0)
		this.counters[1] = (this.reg[0] + (this.counters[0] & 0x0FFF));
	}

	OpcodeCXNN() { //CXNN - Set Reg X = (Random(0-255) AND NN)
		var nn = this.counters[0] & 0x00FF;

		this.reg[x] = (Math.floor(Math.random() * 0xFF) & nn);
	}

	OpcodeDXYN() { //DXYN - Draws an 8x8 Sprite at Location Reg X/Reg Y set Carry on Collision - This one is a bastard of a function.
		var x = (this.counters[0] & 0x0F00) >> 8;
		var y = (this.counters[0] & 0x00F0) >> 4;
		var n = (this.counters[0] & 0x000F);
		var collision = false;
		this.reg[0xF] = 0;

		for (var lineY = 0; lineY < n; lineY++) {
			var data = this.memory[(this.counters[3] + lineY)];

			for (var lineX = 0; lineX < 8; lineX++, lineXInv--) {
				var mask = 0x80;
				var posX = (this.reg[x] + lineX);
				var posY = (this.reg[y] + lineY);

				if ((data & mask) > 0) {
					collision = this.display.toggleXYValue(posX, posY);

					if (collision) {
						this.reg[0xF] = 1;
					}
				}
			}
		}
	}

	OpcodeEXA1() { //EXA1 - Skips Next Instruction if Key in Reg X is Pressed
		var x = (this.counters[0] & 0x0F00) >> 8;

		if (this.keyState[this.reg[x]] == 1) {
			$this.counters[1] += 2;
		}
	}

	OpcodeEX9E() { //EX9E - Skips Next Instruction if Key in Reg X is Not Pressed
		var x = (this.counters[0] & 0x0F00) >> 8;

		if (this.keyState[this.reg[x]] == 0) {
			$this.counters[1] += 2;
		}
	}

	OpcodeFX07() { //FX07 - Sets Reg X = Delay Timer
		var x = (this.counters[0] & 0x0F00) >> 8;
		this.reg[x] = this.counters[3];
	}

	OpcodeFX0A() { //FX0A - Waits for a Key Press then stores the Key in Reg X
		var x = (this.counters[0] & 0x0F00) >> 8;
		var key = this.getKeyPressed();

		if (key !== null) {
			this.reg[x] = key;
		}
		else {
			this.counters[1] -= 2;
		}
	}

	OpcodeFX15() { //FX15 - Sets Delay Timer = Reg X
		var x = (this.counters[0] & 0x0F00) >> 8;
		this.counters[3] = this.reg[x];
	}

	OpcodeFX18() { //FX18 - Sets Sound Timer = Reg X
		var x = (this.counters[0] & 0x0F00) >> 8;
		this.sound.updateTimer(this.reg[x]);
	}

	OpcodeFX1E() { //FX1E - Sets Addr Reg = (Addr Reg + Reg X) sets Carry
		var x = (this.counters[0] & 0x0F00) >> 8;
		this.reg[0xF] = 0;

		if ((this.counters[2] + this.reg[x]) > 0xFFF) {
			this.reg[0xF] = 1;
		}

		this.counters[2] = this.reg[x];
	}

	OpcodeFX29() { //FX29 - Sets Addr Reg = Location of Font in Reg X
		var x = (this.counters[0] & 0x0F00) >> 8;
		this.counters[2] = (this.reg[x] * 5);
	}

	OpcodeFX33() { //FX33 - Stores BCD Representation of Reg X in Memory starting at Addr Reg
		var x = (this.counters[0] & 0x0F00) >> 8;

		var units = (this.reg[x] % 10);
		var tens = ((this.reg[x] / 10) % 10);
		var hundreds = (this.reg[x] / 100);

		this.memory[this.counters[2] + 2] = units;
		this.memory[this.counters[2] + 1] = tens;
		this.memory[this.counters[2]] = hundreds;
	}

	OpcodeFX55() { //FX55 - Stores Registers From Reg 0 to Reg X into Memory starting at Addr Reg
		var x = (this.counters[0] & 0x0F00) >> 8;

		for(var i = 0; i < x; i++) {
			this.memory[this.counters[2] + i] = this.reg[i];
		}
	}

	OpcodeFX65() { //FX65 - Reads Registers From Reg 0 to Reg X from Memory starting at Addr Reg
		var x = (this.counters[0] & 0x0F00) >> 8;

		for(var i = 0; i < x; i++) {
			this.reg[i] = this.memory[this.counters[2] + i];
		}
	}
}