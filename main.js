/*
	Quite simple. A guideline with a disappearing tracing. (It's simple they said, aaaanyways)

	Also why am I using canvas?
	
	Using lazy-brush by dulnan.
 */
 
import { LazyBrush } from "./lazy-brush/lazy-brush.js"

const DEFAULT_LAZY_BRUSH_RADIUS = 5;
const DEFAULT_BRUSH_RADIUS = 30;

var init = function()
{
	/* setup the target guideline */
	var renderCanvas = document.createElement("canvas");
	renderCanvas.classList.add("no-pointer-events"); // this isn't the draw context; we do this to save rendering cycles and to simplify things.
	renderCanvas.classList.add("z-20"); // be on top! 
	makeCanvasDimensionsToWindowDimensions(renderCanvas);
	document.body.appendChild(renderCanvas);
	
	// now draw! 
	var renderContext = renderCanvas.getContext("2d");
	renderContext.setLineDash([10,15]);
	renderContext.beginPath();
	renderContext.arc(renderCanvas.width/2, renderCanvas.height/2, 200, 0, Math.PI * 2);
	renderContext.stroke();
	
	/* setup the fading trail effects */
	var drawCanvas = document.createElement("canvas");
	drawCanvas.classList.add("z-10"); // be on top! 
	makeCanvasDimensionsToWindowDimensions(drawCanvas);
	document.body.appendChild(drawCanvas);
	
	var drawContext = drawCanvas.getContext("2d");
	drawContext.lineJoin = "round";
	drawContext.lineCap = "round";
	drawContext.lineWidth = DEFAULT_BRUSH_RADIUS;
	
	var currentPressure = 0;
	
	var lastPoint;
	
	function tick()
	{
		window.requestAnimationFrame(tick);
		
		var canvas = drawCanvas;
		var context = drawContext;
		
		// fade alpha white 
		context.globalAlpha = 0.05;
		context.fillStyle = "#ffffff";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.globalAlpha = 1;
		
		// draw 
		if(brush.brushHasMoved())
		{
			var currentPoint = brush.getBrushCoordinates();
			// Clear entire canvaas.
			// context.clearRect(0, 0, drawCanvas.width, drawCanvas.height)

			// pressure 0 means that it's a special case, probably a mouse or other non-pressure device instead.
			var radius = DEFAULT_BRUSH_RADIUS;
			if(currentPressure !== 0) radius = Math.round(currentPressure * radius);
			
			drawContext.lineWidth = radius;
			
			if(lastPoint)
			{
				var midPoint = calculateMidpoint(lastPoint, currentPoint);
				context.moveTo(currentPoint.x, currentPoint.y);
				context.beginPath();
				context.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
				
				context.lineTo(currentPoint.x, currentPoint.y);
			}
			context.stroke();
			
			lastPoint = currentPoint;
		}
	}
	
	var brush = new LazyBrush({
		enabled: true,
		radius: DEFAULT_LAZY_BRUSH_RADIUS
	})
	
	// receive pointer events 
	drawCanvas.addEventListener("pointermove", function(event) {
		var x = event.clientX;
		var y = event.clientY;
		
		currentPressure = event.pressure;
		console.log(currentPressure);
		brush.update({x: x, y: y});
	});
	
	// inject the needed styles 
	injectStyle(RULES);
	
	// start the canvas ticking 
	window.requestAnimationFrame(tick);
};

function makeCanvasDimensionsToWindowDimensions(canvas)
{	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function calculateMidpoint(a, b)
{
	return {
		x: a.x + (b.x - a.x) / 2,
		y: a.y + (b.y - a.y) / 2
	}
}

/**
	@param rules a string consisting of a valid set of CSS rules; ie, pretend you paste it into a .css file or a <style> element cuz that's what this thing does
 */
function injectStyle(rules)
{
	let style = document.createElement("style");
	style.innerHTML = rules;
	document.head.appendChild(style)
}

// the CSS rules needed to make this thing work, placed in JS for easy injection.
const RULES = 
`
canvas {
	position: absolute;
	top: 0;
	left: 0;
}

.no-pointer-events {
	pointer-events: none;
}

.z-10 
{
	z-index: 10;
}

.z-20 
{
	z-index: 20;
}


`;

window.addEventListener("load", init);