class Chip8Sound {
	constructor() {
		this.reset();
	}

	timerEvent() {
		if (this.timer[0] > 0) {
			this.timer[0]--;
		}

		if (this.timer[0] > 0) {
			this.playSound();
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

	}
}