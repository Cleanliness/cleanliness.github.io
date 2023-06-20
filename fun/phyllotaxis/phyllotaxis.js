class Floret{
	constructor(r, angle){
		this.r = r;           // radius for polar coords
		this.angle = angle;   // angle for polar coords
		this.size = 18;       // radius of the floret
		
		this.age = 0;
		this.age_lim = 500;
		this.decaying = false;
		
		// drawing + animation attributes
		this.curr_size = 0;
		this.growth_rate = 0.14
		this.alpha = 0;
		this.color = color(0, 0, 0);
	}
	
	draw(){
		// convert polar to cartesian
		let x = this.r * Math.cos(this.angle) + windowWidth/2;
		let y = this.r * Math.sin(this.angle) + windowHeight/2;
		
		// draw floret on screen
		fill(this.color);
		noStroke();        // makes this less laggy
		circle(x, y, this.curr_size);
	}
	
	step(){
		if (this.curr_size < this.size && !this.decaying) {
			this.curr_size += this.growth_rate;
		}
		else{
			this.age += 1;
			if (this.age >= this.age_lim){
				this.decaying = true;
				this.curr_size -= this.growth_rate;
			}
		}
		
		// check for decayed floret
		if (this.curr_size < 0){
			this.curr_size = 0;
			this.growth_rate = 0;
		}
		
		// true if floret is done decaying
		return this.curr_size == 0 && this.age > 0;
	}
	
}

class FloretManager{
	constructor(){
		let deg = 137.508 
		this.florets = [];
		this.angle = deg * (Math.PI/180)
		this.radius = 0;
		
		this.n = 0;
		this.scale = 16;
		this.scale_dx = 0;
		this.floret_lim = 400;
		
		this.sleep_lim = 100;
		this.sleep_counter = 0;
	}
	
	// reset all florets, and add variation to angle
	reset(){
		let deg = 137.508 + (Math.random()-0.5)
		this.florets = [];
		this.angle = deg * (Math.PI/180)
		this.radius = 0;
		this.sleep_counter = 0;
		this.n = 0;
	}
	
	step(){ // growth step
		
		for (let i = 0; i < this.florets.length; i++){
			let f = this.florets[i];
			let decayed = f.step();
			
			if (decayed){
				this.florets.splice(i, 1);
			}
		}
		
		if (this.n <= this.floret_lim){
			// update parameters
			let curr_angle = this.n * this.angle;
			let curr_r = this.scale * Math.sqrt(this.n);
			this.n += 1;
			this.scale += this.scale_dx;

			// add new floret for this position
			let f = new Floret(curr_r, curr_angle);
			this.florets.push(f);
		}
		
		// reset after all florets decay
		if (this.florets.length == 0){
			this.reset();
		}
		
		// debug
		// print(this.angle)
	}
	
	draw(){
		for (let i = 0; i < this.florets.length; i++){
			let f = this.florets[i]
			f.draw();
		}
	}
}

// setup
function hsetup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	canvas.style('z-index', '-1');
	background(255);
	
	f = new FloretManager()
}

// draw
function hdraw() {
	background(255);
	f.step();
	f.draw();
}