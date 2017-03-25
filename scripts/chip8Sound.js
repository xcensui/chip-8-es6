class Chip8Sound {
	constructor() {
		this.reset();
	}

	handleTimers() {
		if (this.timer[0] > 0) {
			console.log('Sound Timer');
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
		console.warn('Sound playing...Well not yet, no implementation. :D')
	}
}