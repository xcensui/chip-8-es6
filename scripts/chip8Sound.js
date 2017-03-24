class Chip8Sound {
	constructor() {
		this.reset();
	}

	handleTimers() {
		if (this.timer[0] > 0) {
			this.playSound();
			this.timer[0]--;
		}
	}

	updateTimer(newTimer) {
		this.timer[0] = newTimer;
	}

	reset() {
		console.log('Chip 8 Sound reset');
		this.timer = new Uint16Array(1);
	}

	playSound() {
		console.log('Sound playing...Well not yet, no implementation. :D')
	}
}