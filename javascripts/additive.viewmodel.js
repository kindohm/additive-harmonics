var additive = (function(module){
	
	module.startHz = 5;

	var oscillators = [],
		playing = false,
		dev;

	// this is a boilerplate audiolib.js callback
	var audioCallback = function (buffer, channelCount){

		if (!playing || oscillators.length === 0) return;

		var length = buffer.length,
			oscLength = oscillators.length,
			sample, 
			note, 
			channel, 
			current, 
			oscIndex, 
			oscillator;

		// loop through the buffer length. skip every other sample
		// if this is two channels (stereo);
		for (current = 0; current < length; current += channelCount){
						
			sample = 0;
			
			// loop through oscillators
			for (oscIndex = 0; oscIndex < oscLength; oscIndex++){
				oscillator = oscillators[oscIndex];

				// generate oscillator sample and add it to the current
				// sample value.
				oscillator.generate();
				sample += oscillator.getMix() * oscillator.amplitude;
			}

			// Fill buffer for each channel
			for (channel = 0; channel < channelCount; channel++){
				buffer[current + channel] = sample;
			}		

		}	

	};

	dev = audioLib.AudioDevice(audioCallback, 1);

	var viewModel = {
		harmonics: []
	};

	viewModel.draw = function (canvas) {
		var plotter = Object.create(module.Plotter);
		var width = canvas.width;
		var height = canvas.height;
		var calculators = [];

		for (var i = 0; i < this.harmonics.length; i++){
			var harmonic = this.harmonics[i];

			// create an audiolib.js oscillator. set its
			// sample rate equal to the canvas width so that
			// it starts and ends at the canvas bounds.
			var osc = audioLib.Oscillator(width, harmonic.frequency);

			// create a calculator object with a custom calculation
			// function for this specific oscillator.
			var calc = Object.create(module.Calculator, 
			{ 
				calculate: 
				{ 
					value: function (x) 
					{ 
						this.oscillator.generate();
						var sample = this.oscillator.getMix() * this.amplitude;
						return sample;
					} 
				},
				oscillator:
				{
					value: osc
				},
				amplitude:
				{
					value: harmonic.amplitude
				}
			});

			calculators.push(calc);
		}

		var result = plotter.generatePlots(calculators, width, height);
		plotter.draw(result, canvas, width, height);

		result = null;
		plotter = null;
		calculators = null;
	};

	viewModel.updateAudio = function (){
		
		var createOscillators = oscillators.length === 0;
		var i, oscillator, harmonic;

		// The UI is showing a low-frequency fundamental (see first few 
		// lines above to see what the value is set at - probably around 5Hz). 
		// It is a low-frequency value so that the graph can be comprehended 
		// easily (imagine viewing a sine wave on the canvas at 500 Hz - you'd 
		// see nothing but a dense mess of lines).
		// However, we cannot hear a low-frequency sine wave, so this frequency
		// constant is calculated so that our first audible frequency equals 400 Hz.
		var frequencyConstant = 400 / module.startHz;

		for (i = 0; i < this.harmonics.length; i++){
			harmonic = this.harmonics[i];
			if (createOscillators) {
				oscillator = audioLib.Oscillator(44100, harmonic.frequency * frequencyConstant);
				oscillators.push(oscillator);
			} 
			else {
				oscillator = oscillators[i];
			}
			oscillator.amplitude = harmonic.amplitude / module.amplitudeScale;
		}
	};

	viewModel.playText = 'Play';

	viewModel.togglePlay = function () {
		playing = !playing;
		viewModel.playText = playing ? 'Stop' : 'Play';
	};

	module.ViewModel = viewModel;
	return module;

})(additive || {});