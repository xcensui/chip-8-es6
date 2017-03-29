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
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.timer = new Uint16Array(1);
	}

	playSound() {
		var osc = this.context.createOscillator();
		osc.connect(this.context.destination);
		osc.type = 'sine';
		osc.frequency.value = 440;
		osc.start();
		osc.stop(this.context.currentTime + 0.1);
	}
}