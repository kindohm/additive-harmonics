describe("plotter", function () {

	it("can plot two functions with sum", function() {

		var calculator1 = Object.create(additive.Calculator);
		calculator1.calculate = function (x) {
			return 3 * x + 2;
		};

		var calculator2 = Object.create(additive.Calculator);
		calculator2.calculate = function (x) {
			return -2 * x;
		};

		var plotter = Object.create(additive.Plotter);
		var width = 400;
		var height = 300;
		var result = plotter.generatePlots([calculator1, calculator2], width, height);

		expect(result.plots.length).toBe(2);

		var plot1 = result.plots[0];
		expect(plot1.points[0]).toBe(2);
		expect(plot1.points[1]).toBe(5);
		expect(plot1.translatedPoints[0]).toBe(148);
		expect(plot1.translatedPoints[1]).toBe(145);

		var plot2 = result.plots[1];
		expect(plot2.points[0]).toBe(0);
		expect(plot2.points[1]).toBe(-2);
		expect(plot2.translatedPoints[0]).toBe(150);
		expect(plot2.translatedPoints[1]).toBe(152);

		expect(result.sum.length).toBe(width);
		expect(result.sum[0]).toBe(2);
		expect(result.sum[1]).toBe(3);

		expect(result.translatedSum.length).toBe(width);
		expect(result.translatedSum[0]).toBe(148);
		expect(result.translatedSum[1]).toBe(147);

	});

	it ("can draw results", function () {

		var twoPi = Math.PI;
		var calcs = [];
		var fundamentalHz = 100.01;
		var twoPiHz = twoPi * fundamentalHz;
		var calcCount = 5;
		var amplitude = 50;
		for (var i = 1; i <= calcCount; i++){
			var hz = fundamentalHz * i;
			var calc = Object.create(additive.Calculator, 
			{ 
				calculate: 
				{ 
					value: function (x) 
					{ 
						var f = this.factor; 
						var t = twoPiHz * x;
						return Math.sin(f*(t))/f * amplitude; 
					} 
				} 
				, factor: { value: i }
			});

			calcs.push(calc);
		}

		var plotter = Object.create(additive.Plotter);
		var width = 700;
		var height = 400;
		var result = plotter.generatePlots(calcs, width, height);
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		document.body.appendChild(document.createElement('div'));
		document.body.appendChild(canvas);
		plotter.draw(result, canvas, width, height);
		expect(canvas != null).toBe(true);

	});

});
