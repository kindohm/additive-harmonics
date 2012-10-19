describe("viewmodel", function (){

	it("has harmonics", function (){
		var vm = Object.create(additive.ViewModel);
		expect(vm.harmonics.length).toBe(0);
	});

	it("does stuff", function (){

		var width = 800;
		var height = 300;

		var vm = Object.create(additive.ViewModel);
		var harmonicCount = 5;
		var amp = 20;
		var baseHz = 5;
		for (var i = 1; i <= harmonicCount; i++){
			var harmonic = Object.create(additive.Harmonic);
			harmonic.frequency = baseHz * i;
			harmonic.amplitude = amp;
			vm.harmonics.push(harmonic);
		}

		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		document.body.appendChild(document.createElement('div'));
		document.body.appendChild(canvas);

		vm.draw(canvas);

	});

});