var additiveBootstrapper = (function(){

	var module = {}, 
		viewModel,
		canvas;

	var setUpViewModel = function (){
		viewModel = Object.create(additive.ViewModel);

		// show a graph starting with a fundamental frequency 
		// specified by the additive module.
		var startHz = additive.startHz;

		// show ten total harmonics
		var harmonicCount = 10;

		for (var i = 1; i <= harmonicCount; i++){
			var harmonic = Object.create(additive.Harmonic);
			harmonic.frequency = startHz * i;

			// make all amplitudes zero except for the first one.
			// this is just a UI default.
			harmonic.amplitude = i === 1 ? additive.amplitudeScale : 0;
			viewModel.harmonics.push(harmonic);
		}

		canvas = document.getElementById('canvas');
		viewModel.draw(canvas);
		viewModel.updateAudio();
	};

	var setUpUI = function (){

		var target = $('#controlsContainer'),
			text,
			count = 0,
			slider,
			containerDiv,
			label,
			i;

		// set up sliders and labels for each harmonic amplitude.
		// could get mileage out of a template here...
		$(viewModel.harmonics).each(function (index){
			var harmonic = this;

			containerDiv = $('<div>').attr('class', 'sliderContainer');

			label = $('<div>').attr('class', 'label');

			text = count === 0 ? 'Fundamental' : 'Harmonic #' + count.toString();
			label.text(text);
			slider = $('<div>').attr('class', 'slider');
			slider = slider.slider({ 
				min: 0,
				max: additive.amplitudeScale,
				step: 1,
				value: harmonic.amplitude,
				slide: function(event, ui) {
					harmonic.amplitude = ui.value;
  					viewModel.draw(canvas);
  					viewModel.updateAudio();
				}
			});

			containerDiv.append(label);
			containerDiv.append(slider);
			target.append(containerDiv);
			count++;
		});

		$('#playButton').click(function (){

			viewModel.togglePlay();
			$('#playButtonSpan').text(viewModel.playText);

		});
	};

	module.exec = function() {
		setUpViewModel();
		setUpUI();
	};

	return module;

})();

var currentWindowOnload = window.onload;

window.onload = function() {
	if (currentWindowOnload) {
	  currentWindowOnload();
	}
	additiveBootstrapper.exec();
};

