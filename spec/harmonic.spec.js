describe("harmonic", function (){

	it("has a frequency and amplitude", function(){

		var harmonic = Object.create(additive.Harmonic);
		expect(harmonic.frequency).toBe(1);
		expect(harmonic.amplitude).toBe(1);
	});

});