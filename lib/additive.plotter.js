var additive = (function (module){

	// calculates points for a single function
	var calculatePlot = function(calculator, width) {
		var i;
		var points = new Array(width);
		for (i = 0; i < width; i++){
			points[i] = calculator.calculate(i);
		}
		return points;
	};

	// translates an array of points from a {0, 0} coordinate
	// origin to a canvas origin halfway down its height.
	var translatePoints = function (points, height) {
		var i;
		var newPoints = new Array(points.length);
		var halfHeight = height / 2;
		for (i = 0; i < points.length; i++){
			newPoints[i] = -points[i] + halfHeight;
		}
		return newPoints;
	};

	// calculates a total sum of all points of a set of plots.
	var calculateSum = function(plots) {

		if (plots == undefined || plots.length == 0) return [];

		var i, p, plot;
		var newPoints = new Array(plots[0].points.length)
		for (i = 0; i < plots.length; i++){
			plot = plots[i];
			for (p = 0; p < plot.points.length; p++){
				if (isNaN(newPoints[p])) newPoints[p] = 0;
				newPoints[p] += plot.points[p];
			}
		}
		return newPoints;
	};

	// calculator object
	var calculator = {};
	calculator.calculate = function(x) {
		return 0;
	};

	// plot result object. basically a set of plots and a sum plot.
	var plotResult = {
		plots: [],
		sum: null,
		translatedSum: null
	};
    
    // plot object. basically a set of f(x) values along with
    // their translated values.
	var plot = {
		points: [],
		translatedPoints: []
	};

	// main plotter object for this module
	var plotter = {};

	// public plotter method that uses an array of supplied calculators
	// to calculate function values for each x value along a width. You can
	// pass in any calculator you want to calculate any kind of function
	// (not just sine waves).
	plotter.generatePlots = function(calculators, width, height) {
		var plots = [],
			calculator,
			i, 
			newPlot, 
			result;

		// loop through calculators
		for (i = 0; i < calculators.length; i++){	
			calculator = calculators[i];		

			// create a plot for each calculator
			newPlot = Object.create(plot); 

			// use the calculator to calculate points along the width
			newPlot.points = calculatePlot(calculator, width);

			// get the translated points for displaying on a canvas
			newPlot.translatedPoints = translatePoints(newPlot.points, height);

			plots.push(newPlot);
		}

		// return the final result of all the plots
		result = Object.create(plotResult);
		result.plots = plots;

		// calculate the sum of all of the plots we've calculated
		result.sum = calculateSum(result.plots);
		result.translatedSum = translatePoints(result.sum, height);

		return result;
	};

	// draws a whole plot result on a canvas
	plotter.draw = function (result, canvas, width, height) {

		var p, 
			i, 
			resultPlot, 
			context, 
			points;

		context = canvas.getContext('2d');

		// erase the canvas.
		canvas.width = width;

		// draw a background
		var background = context.createLinearGradient(0, 0, 0, height);
        background.addColorStop(0, 'rgba(198, 198, 184, 255)');
        background.addColorStop(.5, 'rgba(255, 255, 221, 255)');
        background.addColorStop(1, 'rgba(198, 198, 184, 255)');
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);

        // enumerate plots
		for (p = 0; p < result.plots.length; p++) {

			resultPlot = result.plots[p];
			points = resultPlot.translatedPoints;
			
			// set up the line 
			context.lineWidth = 1;
			context.strokeStyle = "#000";
			context.beginPath();
			context.moveTo(0, height / 2);

			// draw the function
			for (i = 0; i < points.length; i++) {
				context.lineTo(i, points[i]);
			}
			context.stroke();
		}

		// draw the sum
		points = result.translatedSum;		
		context.lineWidth = 3;
		context.strokeStyle = "#ff0000";
		context.beginPath();
		context.moveTo(0, height / 2);

		for (i = 0; i < points.length; i++) {
			context.lineTo(i, points[i]);
		}
		context.stroke();

		
	};

	module.Plotter = plotter;
	module.Calculator = calculator;

	return module;

})(additive || {});

