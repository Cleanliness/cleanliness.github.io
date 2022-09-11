

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	canvas.style('z-index', '-1');
	background('rgb(255,255,255)');
	
	var i = 0;
	var boids = [];
	while (i < 200){
		
		xpos = random(0, windowWidth);
		ypos = random(0, windowHeight);
		boids.push(new Boid(xpos, ypos, i));
		i += 1;
	}
	boids.push(new Predator(xpos, ypos, -1));
	
	bmanager = new BoidManager(boids);
}

function draw() {
	background('rgb(255,255,255)');
	bmanager.update();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

console.log("bground loaded");