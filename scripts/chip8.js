class Chip8 {

	constructor(renderer) {
		this.perFrame = Math.floor(400 / 60); //400 opcodes per second at 60Hz
		this.renderer = renderer;
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
			this.handleTimers();

			for (var i = 0; i < this.perFrame; i++) {
				this.doCycle();
			}

			if (this.frameChanged) {
				this.renderer.frame(this.display.getScreen());
				this.frameChanged = false;
			}
		
			window.requestAnimationFrame(() => this.run());
		}
	}

	load(program) {
		console.log('Loading ROM');

		for (var i = 0; i < program.length; i++) {
			this.memory[i + 0x200] = program[i];
		}
	}

	stop() {
		this.running = false;
	}

	reset() {
		console.log('Resetting Chip8');

		this.frameChanged = false;
		this.memory = new Uint8Array(new ArrayBuffer(0xfff));
		this.stack = new Array(16);
		this.reg = new Uint8Array(new ArrayBuffer(0x10));
		this.keyState = new Uint8Array(new ArrayBuffer(0x10));
		this.counters = new Uint16Array(new ArrayBuffer(0x8)); //Holds opcode, progCounter, addrReg, and timer.
		this.sound = new Chip8Sound();
		this.display = new Chip8Display();
		this.running = false;
		var font = this.systemFont();

		for (var i = 0; i < font.length; i++) {
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
			console.log('Delay Timer');
			this.counters[3]--;
		}

		this.sound.handleTimers();
	}

	opcodeNoSupport(source) {
		console.warn('['+source+'] Opcode '+this.counters[0].toString(16)+' is not supported.');
	}

	handleOpcode() {
		this.o = (this.counters[0] & 0xF000);
		this.x = (this.counters[0] & 0x0F00) >> 8;
		this.y = (this.counters[0] & 0x00F0) >> 4;
		this.n = (this.counters[0] & 0x000F);
		this.nn = (this.counters[0] & 0x00FF);
		this.nnn = (this.counters[0] & 0x0FFF);

		switch(this.o) {
			case 0x0000:
				console.log('Opcode0');
				this.handleOpcode0();
				break;
			case 0x1000:
				console.log('Opcode1NNN');
				this.Opcode1NNN();
				break;
			case 0x2000:
				console.log('Opcode2NNN');			
				this.Opcode2NNN();
				break;
			case 0x3000:
				console.log('Opcode3XNN');			
				this.Opcode3XNN();
				break;
			case 0x4000:
				console.log('Opcode4XNN');			
				this.Opcode4XNN();
				break;
			case 0x5000:
				console.log('Opcode5XY0');
				this.Opcode5XY0();
				break;
			case 0x6000:
				console.log('Opcode6XNN');
				this.Opcode6XNN();
				break;
			case 0x7000:
				console.log('Opcode7XNN');
				this.Opcode7XNN();
				break;
			case 0x8000:
				console.log('Opcode8');
				this.handleOpcode8();
				break;
			case 0x9000:
				console.log('Opcode9XY0');
				this.Opcode9XY0();
				break;
			case 0xA000:
				console.log('OpcodeANNN');
				this.OpcodeANNN();
				break;
			case 0xB000:
				console.log('OpcodeBNNN');
				this.OpcodeBNNN();
				break;
			case 0xC000:
				console.log('OpcodeCXNN');
				this.OpcodeCXNN();
				break;
			case 0xD000:
				console.log('OpcodeDXYN');
				this.OpcodeDXYN();
				break;
			case 0xE000:
				console.log('OpcodeE');
				this.handleOpcodeE();
				break;
			case 0xF000:
				console.log('OpcodeF');
				this.handleOpcodeF();
				break;
			default:
				this.opcodeNoSupport('Opcode');
		}
	}

	handleOpcode0() {
		switch(this.nn) {
			case 0x00E0:
				console.log('Opcode00E0');
				this.Opcode00E0();
				break;
			case 0x00EE:
				console.log('Opcode00EE');
				this.Opcode00EE();
				break;
			default:
				this.opcodeNoSupport('Opcode0');
		}
	}

	handleOpcode8() {
		switch(this.n) {
			case 0x0000:
				console.log('Opcode8XY0');
				this.Opcode8XY0();
				break;
			case 0x0001:
				console.log('Opcode8XY1');
				this.Opcode8XY1();
				break;
			case 0x0002:
				console.log('Opcode8XY2');
				this.Opcode8XY2();
				break;
			case 0x0003:
				console.log('Opcode8XY3');
				this.Opcode8XY3();
				break;
			case 0x0004:
				console.log('Opcode8XY4');
				this.Opcode8XY4();
				break;
			case 0x0005:
				console.log('Opcode8XY5');
				this.Opcode8XY5();
				break;
			case 0x0006:
				console.log('Opcode8XY6');
				this.Opcode8XY6();
				break;
			case 0x0007:
				console.log('Opcode8XY7');
				this.Opcode8XY7();
				break;
			case 0x000E:
				console.log('Opcode8XYE');
				this.Opcode8XYE();
				break;
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}

	handleOpcodeE() {
		switch(this.n) {
			case 0x0001:
				console.log('OpcodeEXA1');
				this.OpcodeEXA1();
				break;
			case 0x000E:
				console.log('OpcodeEX9E');
				this.OpcodeEX9E();
				break;
			default:
				this.opcodeNoSupport('Opcode8');
		}
	}

	handleOpcodeF() {
		switch(this.nn) {
			case 0x0007:
				console.log('OpcodeFX07');
				this.OpcodeFX07();
				break;
			case 0x000A:
				console.log('OpcodeFX0A');
				this.OpcodeFX0A();
				break;
			case 0x0015:
				console.log('OpcodeFX15');
				this.OpcodeFX15();
				break;
			case 0x0018:
				console.log('OpcodeFX18');
				this.OpcodeFX18();
				break;
			case 0x001E:
				console.log('OpcodeFX1E');
				this.OpcodeFX1E();
				break;
			case 0x0029:
				console.log('OpcodeFX29');
				this.OpcodeFX29();
				break;
			case 0x0033:
				console.log('OpcodeFX33');
				this.OpcodeFX33();
				break;
			case 0x0055:
				console.log('OpcodeFX55');
				this.OpcodeFX55();
				break;
			case 0x0065:
				console.log('OpcodeFX65');
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
		if (this.reg[this.x] == this.nn) {
			this.counters[1] += 2;
		}
	}

	Opcode4XNN() { //4XNN - Skip Next Instruction if Reg X != NN
		if (this.reg[this.x] != this.nn) {
			this.counters[1] += 2;
		}
	}

	Opcode5XY0() { //5XY0 - Skip Next Instruction if Reg X = Reg Y
		if (this.reg[this.x] == this.reg[this.y]) {
			this.counters[1] += 2;
		}
	}

	Opcode6XNN() { //6XNN - Set Reg X = NN
		this.reg[this.x] = this.nn;
	}

	Opcode7XNN() { //7XNN - Add NN to Reg X
		this.reg[this.x] += this.nn;
	}

	Opcode8XY0() { //8XY0 - Set Reg X = Reg Y
		this.reg[this.x] = this.reg[this.y];
	}

	Opcode8XY1() { //8XY1 - Set Reg X = (Reg X OR Reg Y)
		this.reg[this.x] |= this.reg[this.y];
	}

	Opcode8XY2() { //8XY2 - Set Reg X = (Reg X AND Reg Y)
		this.reg[this.x] &= this.reg[this.y];
	}

	Opcode8XY3() { //8XY3 - Set Reg X = (Reg X XOR Reg Y)
		this.reg[this.x] ^= this.reg[this.y];
	}

	Opcode8XY4() { //8XY4 - Set Reg X = Reg X + Reg Y with Carry
		this.reg[0xF] = 0;

		if ((this.reg[this.x] + this.reg[this.y]) > 255) {
			this.reg[0xF] = 1;
		}

		this.reg[this.x] += this.reg[this.y];
	}

	Opcode8XY5() { //8XY5 - Set Reg X = Reg X - Reg Y with Carry
		this.reg[0xF] = 1;

		if (this.reg[this.x] < this.reg[this.y]) {
			this.reg[0xF] = 0;
		}

		this.reg[this.x] -= this.reg[this.y];
	}

	Opcode8XY6() { //8XY6 - Divide Reg X by 2 with Carry on LSB = 1
		this.reg[0xF] = (this.reg[this.x] & 0x1);
		this.reg[this.x] >>= 1;
	}

	Opcode8XY7() { //8XY7 - Set Reg X = (Reg Y - Reg X) with Carry on Not Borrow
		this.reg[0xF] = 1;

		if (this.reg[this.y] < this.reg[this.x]) {
			this.reg[0xF] = 0;
		}

		this.reg[this.x] = (this.reg[this.y] - this.reg[this.x]);
	}

	Opcode8XYE() { //8XYE - Multiply Reg X by 2 with Carry on MSB = 1
		this.reg[0xF] = (this.reg[this.x] >> 7);
		this.reg[this.x] <<= 1;
	}

	Opcode9XY0() { //9XY0 - Skip Next Instruction if Reg X != Reg Y
		if (this.reg[this.x] != this.reg[this.y]) {
			this.counters[1] += 2;
		}
	}

	OpcodeANNN() { //ANNN - Sets Addr Register to NNN
		this.counters[2] = this.nnn;
	}

	OpcodeBNNN() { //BNNN - Set Prog Counter = (NNN + Reg 0)
		this.counters[1] = (this.reg[0] + this.nnn);
	}

	OpcodeCXNN() { //CXNN - Set Reg X = (Random(0-255) AND NN)
		this.reg[this.x] = (Math.floor(Math.random() * 0xFF) & this.nn);
	}

	OpcodeDXYN() { //DXYN - Draws an 8x8 Sprite at Location Reg X/Reg Y set Carry on Collision - This one is a bastard of a function.
		var collision = false;
		this.reg[0xF] = 0;

		for (var lineY = 0; lineY < this.n; lineY++) {
			var data = this.memory[(this.counters[2] + lineY)];

			for (var lineX = 0; lineX < 8; lineX++) {
				var mask = 0x80;
				var posX = (this.reg[this.x] + lineX);
				var posY = (this.reg[this.y] + lineY);

				if ((data & mask) > 0) {
					collision = this.display.toggleXYValue(posX, posY);

					if (collision) {
						this.reg[0xF] = 1;
					}
				}

				data <<= 1;
			}
		}

		this.frameChanged = true;
	}

	OpcodeEXA1() { //EXA1 - Skips Next Instruction if Key in Reg X is Pressed
		if (this.keyState[this.reg[this.x]] == 1) {
			this.counters[1] += 2;
		}
	}

	OpcodeEX9E() { //EX9E - Skips Next Instruction if Key in Reg X is Not Pressed
		if (this.keyState[this.reg[this.x]] == 0) {
			this.counters[1] += 2;
		}
	}

	OpcodeFX07() { //FX07 - Sets Reg X = Delay Timer
		this.reg[this.x] = this.counters[3];
	}

	OpcodeFX0A() { //FX0A - Waits for a Key Press then stores the Key in Reg X
		var key = this.getKeyPressed();

		if (key !== null) {
			this.reg[this.x] = key;
		}
		else {
			this.counters[1] -= 2;
		}
	}

	OpcodeFX15() { //FX15 - Sets Delay Timer = Reg X
		this.counters[3] = this.reg[this.x];
	}

	OpcodeFX18() { //FX18 - Sets Sound Timer = Reg X
		this.sound.updateTimer(this.reg[this.x]);
	}

	OpcodeFX1E() { //FX1E - Sets Addr Reg = (Addr Reg + Reg X) sets Carry
		this.reg[0xF] = 0;

		if ((this.counters[2] + this.reg[this.x]) > 0xFFF) {
			this.reg[0xF] = 1;
		}

		this.counters[2] = this.reg[this.x];
	}

	OpcodeFX29() { //FX29 - Sets Addr Reg = Location of Font in Reg X
		this.counters[2] = (this.reg[this.x] * 5);
	}

	OpcodeFX33() { //FX33 - Stores BCD Representation of Reg X in Memory starting at Addr Reg
		var units = (this.reg[this.x] % 10);
		var tens = ((this.reg[this.x] / 10) % 10);
		var hundreds = (this.reg[this.x] / 100);

		this.memory[this.counters[2] + 2] = units;
		this.memory[this.counters[2] + 1] = tens;
		this.memory[this.counters[2]] = hundreds;
	}

	OpcodeFX55() { //FX55 - Stores Registers From Reg 0 to Reg X into Memory starting at Addr Reg
		for(var i = 0; i < this.x; i++) {
			this.memory[this.counters[2] + i] = this.reg[i];
		}
	}

	OpcodeFX65() { //FX65 - Reads Registers From Reg 0 to Reg X from Memory starting at Addr Reg
		for(var i = 0; i < this.x; i++) {
			this.reg[i] = this.memory[this.counters[2] + i];
		}
	}
}