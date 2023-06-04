class Boid{
	constructor(x, y, id){
		this.x = x;
		this.y = y;
		
		var angle = random(360)*Math.PI / 180;
		this.dx = Math.cos(angle)*1.7;
		this.dy = Math.sin(angle)*1.7;
		
		console.log(180*angle/Math.PI);
		
		this.id = id;
		this.speedlim = 6;
	}
	
	// ---- some helper methods ----
	dist(boid2){
		var xcomp = (this.x - boid2.x)*(this.x - boid2.x);
		var ycomp = (this.y - boid2.y)*(this.y - boid2.y);
		
		return Math.sqrt(xcomp + ycomp);
	}
	
	getAngle(){
		if (this.dx == 0){
			if (this.dy >= 0){
				return Math.PI/2
			}
			else{
				return 3*Math.PI/2
			}
		}
		
		if (this.dx*this.dy < 0){
			if (this.dx < 0){
				return Math.PI + Math.atan(this.dy/this.dx);
			}
			else{
				return (2*Math.PI) + Math.atan(this.dy/this.dx);
			}
		}
		else{
			if (this.dx > 0){
				return Math.atan(this.dy/this.dx);
			}
			
			else{
				return Math.PI + Math.atan(this.dy/this.dx);
			}
		}
	}
	
	// ---- MAIN METHODS ----
	// separation of boids
	separate(nearby, separation, turnrate){
		if (nearby.length != 0){
			var closex = 0;
			var closey = 0;
			var closec = 1;
			for (var i in nearby){
				if (this.dist(nearby[i]) <= separation && !(nearby[i] instanceof Predator)){
					closex += this.x - nearby[i].x;
					closey -= this.y - nearby[i].y;
					closec += 1
				}
				
				else if (nearby[i] instanceof Predator){
					var x = this.x - nearby[i].x;
					var y = (this.y - nearby[i].y);

					closex += 0.3*(x);
					closey -= 0.3*(y);
				}
			}
			
			this.dx += 0.25*closex / closec;
			this.dy += 0.25*closey / closec;

		}
		
	}
	
	// align boids
	align(nearby, turnrate){
		if (nearby.length != 0){
			var dxsum = 0;
			var dysum = 0;
			for (var i in nearby){
				dxsum += nearby[i].dx;
				dysum += nearby[i].dy;
			}
			
			var dxoff = (dxsum / nearby.length) - this.dx;
			var dyoff = (dysum / nearby.length) - this.dy;
			
			this.dx += 0.05*dxoff;
			this.dy += 0.05*dyoff;
		}
	}
	
	// cohesion of boids
	flock(nearby, turnrate){
		if (nearby.length != 0){
			var xsum = 0;
			var ysum = 0;
			for (var i in nearby){
				xsum += nearby[i].x;
				ysum += nearby[i].y;
			}
			
			var xoff = (xsum / nearby.length) - this.x;
			var yoff = (ysum / nearby.length) - this.y;
			
			this.dx += turnrate*xoff;
			this.dy -= turnrate*yoff;
		}
	}
	
	move(){
		if (this.x < -10){
			this.x = windowWidth + 10;
		}
		
		else if (this.x > windowWidth + 10){
			this.x = -10;
		}
		
		if (this.y < - 10){
			this.y = windowHeight + 10;
		}
		
		else if (this.y > windowHeight + 10){
			this.y = -10;
		}
		
		var spd = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
		if (spd > this.speedlim){
			var scale = this.speedlim / spd;
			this.dx *= scale;
			this.dy *= scale;
		}
		
		this.x += this.dx;
		this.y -= this.dy;
	}
	
	avoidWall(){
		var closex = 0;
		var closey = 0;
		
		// checking hitting walls
		if (this.x <= 40){
			closex += 20;
		}
		else if (windowWidth - this.x <= 40){
			closex -= 20;
		}

		if (this.y <= 40){
			closey -= 20;
		}

		else if (windowHeight - this.y <= 40){
			closey += 20;
		}
		this.dx += closex
		this.dy += closey
	}
	
	// draw boid
	draw(){
		push();
		noStroke();
		translate(this.x, this.y);
		rotate(2*Math.PI - this.getAngle());
		translate(-this.x, -this.y);
		beginShape();
		vertex(this.x - 5, this.y + 5);
		vertex(this.x + 10, this.y);
		vertex(this.x - 5, this.y - 5);
		vertex(this.x, this.y);
		endShape(CLOSE);
		pop();
	}
}

class Predator extends Boid{
	constructor(x, y, id){
		super(x, y, id);
		this.speedlim = 8;
	}
	
	draw(){
		push();
		fill('red');
		noStroke();
		translate(this.x, this.y);
		rotate(2*Math.PI - this.getAngle());
		translate(-this.x, -this.y);
		beginShape();
		vertex(this.x - 10, this.y + 10);
		vertex(this.x + 20, this.y);
		vertex(this.x - 10, this.y - 10);
		vertex(this.x, this.y);
		endShape(CLOSE);
		pop();
	}
	
}

// handles boid rules
class BoidManager{
	constructor(boids){
		this.boids = boids;
		this.separation = 20;
		this.turnrate = 0.004;
		this.detection_r = 100;
	}
	
	// get boids in detection radius of <boid>
	getNearby(boid){
		var res = [];
		for (var i in this.boids){
			if (boid.dist(this.boids[i]) <= this.detection_r && this.boids[i].id != boid.id){
				res.push(this.boids[i]);
			}
		}
		
		return res;
	}
	
	// update all boids
	update(){
		for (var i in this.boids){
			var nearby = this.getNearby(this.boids[i]);
			if (this.boids[i] instanceof Predator){
				this.boids[i].flock(this.boids, this.turnrate);
			}
			
			else{
				this.boids[i].separate(nearby, this.separation, this.turnrate);
				this.boids[i].align(nearby, this.turnrate);
				this.boids[i].flock(nearby, this.turnrate);
			}

			this.boids[i].draw();
			this.boids[i].move();
		}
		
	}
	
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	
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
	background(0);
	bmanager.update();
}