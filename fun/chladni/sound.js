// 2d standing wave simulation https://paulbourke.net/geometry/chladni/ 
// i.e. sand on a plate
num_particles = 3000;
PI = Math.PI;
t_delta = 1;
zoom = 100;
swap_interval = 100;
curr_iter = 1000;

box_width = 500;

// parameters
L = 2;
m = 0.2;
n = -0.3;


class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // assume mass = 1
        this.radius = 10;
        this.a = [0, 0];
        this.v = [0, 0];
        this.color = [0, 0, 0];
    }

    update() {
        // update position
        this.x += this.v[0];
        this.y += this.v[1];
        
        // move to random position if out of centered box 
        let left = (width - box_width)/2; 
        let right = left + box_width;
        let top = (height - box_width)/2;
        let bottom = top + box_width;

        if (this.x < left || this.x > right || this.y < top || this.y > bottom) {
            this.x = random(left, right);
            this.y = random(top, bottom);
        }
        // update velocity
        this.v[0] += t_delta*this.a[0];
        this.v[1] += t_delta*this.a[1];
    }

    apply_force(force) {

        // zero out velocity if in antinode
        if (force[2] == 1) {
            this.v[0] = random(-2, 2);
            this.v[1] = random(-2, 2);
            this.a = [0, 0];
            this.color = [255, 0, 0];
        }
        this.color = [0, 0, 0];
        this.a = force;
    }

    draw() {
        stroke(this.color);
        point(this.x, this.y);
        stroke(0);
    }
}

// move points to antinodes
function get_force(x, y){
    x = x/zoom;
    y = y/zoom;
    let antinode_flag = 0;
    var x_force = 0;
    var y_force = 0; 
    // apply random force when not in antinode
    // don't bother with computing the gradient, should look visually similar
    if (cos(n*PI*x/L)*cos(m*PI*y/L) - cos(m*PI*x/L)*cos(n*PI*y/L) < 0.001) {
        antinode_flag = 1;
    }
    else {
        x_force = random(-5, 5);
        y_force = random(-5, 5);
    }

    return [x_force, y_force, antinode_flag]; 
}

function hsetup() {
	canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    canvas.style('z-index', '-1');
	background(255);
    strokeWeight(2.5);


    points = [];
    for (var i = 0; i < num_particles; i++) {
        points.push(new Particle(random(width), random(height)));
    }
}

function hdraw() {
    noStroke(); 
    fill(255, 100);
    rect(0, 0, width, height); 

    for (var i = 0; i < points.length; i++) {
        var force = get_force(points[i].x, points[i].y);
        points[i].apply_force(force);
        points[i].update();
        points[i].draw();
    }

    // update iteration
    curr_iter += 1;
    if (curr_iter >= swap_interval){
        m = random(-1, 1);
        n = random(-1, 1);
        L = random(0.0001, 1)
        curr_iter = 0;
    }
}