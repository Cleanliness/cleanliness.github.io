backgrounds = [
	{
		setup_function: ptax_setup,
	 	draw_function: ptax_draw
	},
	{
		setup_function: boid_setup,
	 	draw_function: boid_draw
	}
];

function setup() {
	// choose random item from background list
	bg = backgrounds[Math.floor(Math.random()*backgrounds.length)];
	bg.setup_function();
}

function draw() {
	bg.draw_function();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}