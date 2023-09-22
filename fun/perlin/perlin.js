function hsetup() {
	grid_space = floor(windowHeight/20);
	grid_dim_x = 42;
	grid_dim_y = 15;
	
	xoff = 0;
	yoff = 0;
	
	dx = 0;
	dy = 0.2;
	
	smoothing = 5;
	
	canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.position(0,0);
	canvas.style('z-index', '-1');
	background(0);
}

function hdraw() {
	grid_space = floor(windowHeight/20);
	background(255);
	noFill();
	
	xoff += dx;
	yoff += dy;
	
	rotateX(-71.1);
	translate(-grid_dim_x*grid_space/2 + 2, -windowHeight/2);
	
	// draw grid
	for (let y = 0; y < grid_dim_y; y++){
		beginShape(TRIANGLE_STRIP);
		stroke((y*18));
		for (let x = 0; x < grid_dim_x; x++){
			
			vertex(x*grid_space, y*grid_space, noise((x+xoff)/smoothing, (y+yoff)/smoothing)*300);
			vertex(x*grid_space, (y+1)*grid_space, noise((x+xoff)/smoothing, (y+1+yoff)/smoothing)*300);
		}
		endShape();
	}
	
	
}