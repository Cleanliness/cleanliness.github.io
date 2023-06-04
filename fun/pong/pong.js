//small pong project, control left paddle with up/down arrows, control right paddle by moving mouse

function setup() {
	createCanvas(windowWidth*0.99, windowHeight*0.98);
	background(100);
	frameRate(60);
}

//paddles i.e the players
class paddle{
	constructor(id){
		this.y = 200;
		this.speed = 12;
		this.width = 14;
		this.height = 150;
		this.id = id;
		this.score = 0;
		
		if (this.id === 2){
			this.score = -1;
		}
	}
	
	//control movement of paddles
	move(){	
		//player 1 controls
		if (this.id === 1){
			if (keyCode === UP_ARROW & keyIsDown(UP_ARROW)){
				this.y = this.y - this.speed;
				}
		
			else if(keyCode === DOWN_ARROW & keyIsDown(DOWN_ARROW)){
				this.y = this.y + this.speed;
			}
		}
		
		//player 2 controls
		else{
			if (this.y + this.height/2 < mouseY){
				this.y = this.y + this.speed;
				}
			
			else if(this.y + this.height/2 + 20 > mouseY && this.y + this.height/2 - 20 < mouseY){
			}
			
			else{
				this.y = this.y - this.speed;
			}
		}
	}
	
}

// the ball bounced around by players
class ball{
	constructor(){
		this.xspeed = -8;
		this.yspeed = 6;
		this.xpos = 0;
		this.ypos = 16;
		this.r = 14;
		this.bounces = 0;
	}
	
	//handles movement behaviour of ball
	move(p,p2, h){
		// bouncing off vertical surfaces (players)
		if ((this.xpos <= p.width + 30 + this.r) &&(this.xpos >= 30 + this.r) && (this.ypos >= p.y && this.ypos <= p.y + p.height)){
			this.xspeed = -this.xspeed;
			this.bounces = this.bounces + 1;
			this.speedup();
		}
		
		else if ((this.xpos >= windowWidth - (p.width + 30 + this.r)) && (this.xpos <= windowWidth - (30 + this.r)) && (this.ypos >= p2.y && this.ypos <= p2.y + p2.height)){
			this.xspeed = -this.xspeed;
			this.bounces = this.bounces + 1;
			this.speedup();
			
		}
		
		//bouncing off horizontal surfaces (top + bottom walls)
		else if(this.ypos <= this.r || this.ypos > windowHeight*0.98 - this.r){
			this.yspeed = -this.yspeed;
		}
		
		//restart game when out of bounds
		else if(this.xpos < 0 - this.r || this.xpos > windowWidth + this.r){
			this.start(p,p2);
		}
		
		//update ball position
		this.xpos = this.xpos + this.xspeed;
		this.ypos = this.ypos + this.yspeed;
	}
	
	//speedup ball after successful hit by a player
	speedup(){
		let increment = (2/exp(this.bounces/7));
		
		if (this.xspeed < 0){
			this.xspeed = this.xspeed - increment;
		}
		else{
			this.xspeed = this.xspeed + increment;
		}

		if (this.yspeed < 0){
			this.yspeed = this.yspeed - increment;
		}
		else{
			this.yspeed = this.yspeed + increment;
		}
	}
	
	//game start/restart method
	start(p,p2){
		this.bounces = 0;
		
		//update scores
		if (this.xpos < windowWidth/2){
			p2.score = p2.score + 1;
		}
		else{
			p.score = p.score + 1;
		}
		
		//serve to whoever has lower score
		let i = 1;
		if (p.score < p2.score){
			i = -1;
		}
		
		//reset speed and position
		this.xspeed = 0;
		this.yspeed = 0;
		this.xpos = windowWidth/2;
		this.ypos = windowHeight/2;
		
		//wait 3 seconds
		//TODO fix this
		let start = frameCount;
		while ((frameCount - start) % 60 > 3){
			textSize(60);
			text(str((frameCount - start) % 60), windowWidth/2, windowHeight/2);
		}
		
		// randomize angle each new game
		let angle = random(3.14 / 4, -3.14/4);
		this.xspeed = i*6 * cos(angle);
		this.yspeed = i*6 * sin(angle);
	}
}

//setting up paddles and ball
let p = new paddle(1);
let p2 = new paddle(2);
let b = new ball();


function draw() {
	//drawing environment (background, divider)
	background(51);
	rect(windowWidth/2, 0, 14, windowHeight)
	noStroke();
	
	//drawing players and ball
	rect(p.width/2 + 30, p.y, p.width, p.height);
	noStroke();
	rect(windowWidth - (p2.width/2 + 30), p2.y, p2.width, p2.height);
	noStroke();
	fill(color(64, 235, 52))
	ellipse(b.xpos, b.ypos, b.r*2);
	noStroke();
	
	//drawing score
	fill(color(255));
	textSize(60);
	text(str(p.score), windowWidth / 4, windowHeight/8);
	fill(color(255));
	textSize(60);
	text(str(p2.score), windowWidth/2 + windowWidth / 4, windowHeight/8);
	
	//update position of ball and paddle
	p.move();
	p2.move();
	b.move(p, p2, windowHeight);
}