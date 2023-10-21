t = -0.5;
coefs = new Array(20); // coefficients of the polynomial
iters = 3000; // number of iterations
x_i = t;
y_i = t;

x_old = t;
y_old = t;

// some cool presets
p1 = [-0.5085847104375514, 0.6726764693740546, 0.29099199977009094, -0.5382348479195445, 0.4950409403551248, -0.799979816453247, -0.8392354771102346, -0.016823001051705866, -0.7203090562806307, 0.736127335695173, 0.27030773920491313, 0.40350093802192744, 0.7473608895174193, -0.34330844756578016, 0.4640525229752006, -0.26181353668393803, 0.9688673761733984, -0.6223388740919549, 0.05679449836821626, 0.45343279733408237];
p2 = [
  -0.4680345067902165,
  0.9276445452909661,
  0.3862097807588438,
  -0.23733233319088276,
  0.9150193796194359,
  0.23841304270498442,
  0.9672783899797261,
  0.2831897724385797,
  0.5614798116135438,
  -0.7120853529610889,
  -0.2182946679847142,
  0.6237268361317414,
  -0.760202470666203,
  -0.2896937728782736,
  -0.9390718110571792,
  -0.16473089804876495,
  -0.28371582357630354,
  -0.05918684506255767,
  0.4483480470040575,
  -0.7367844929312053
];

function init_coefs(){
  for (let i = 0; i < 20; i++){
    coefs[i] = random(-1, 1);
  }
}

function update(){
  noStroke(); 
  fill(255, 6);
  rect(-width/2, -height/2, width, height); 
  // stroke(0);
  
  if (t > 1.0){
    init_coefs();
    t = -0.5;
    y_i = t;
    x_i = t;
  }
  let y = y_i;
  let x = x_i;
  
  fill(0);
  for (let i = 0; i < iters; i++){
    let new_x = coefs[0]*x*x + coefs[1]*y*y + coefs[2]*x*y + coefs[3]*t*t + coefs[4]*x*t + coefs[5]*y*t + coefs[6]*t + coefs[7]*x + coefs[8]*y + coefs[9];
    let new_y = coefs[10]*x*x + coefs[11]*y*y + coefs[12]*x*y + coefs[13]*t*t + coefs[14]*x*t + coefs[15]*y*t + coefs[16]*t + coefs[17]*x + coefs[18]*y + coefs[19];

    if (isNaN(new_x) || isNaN(new_y) || new_x > width/2 || new_x < -width/2 || new_y > height/2 || new_y < -height/2){
      break;
    }
    x_old = x;
    y_old = y;
    x = new_x;
    y = new_y;

    circle(300*x, 300*y, 2);

    // line(300*x_old, 300*y_old, 300*x, 300*y);
  }

  t += 0.003;
  x_i = t;
  y_i = t;
  
}

// setup
function hsetup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
	canvas.position(0,0);
	canvas.style('z-index', '-1');
	background(255);
  stroke(0);
  strokeWeight(2); 
  // init chaos
  init_coefs();
}

// draw
function hdraw() {
	// background(0);
  update();

}
