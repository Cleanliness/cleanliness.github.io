backgrounds = [
	{
		main: "fun/hopfield/hopnet.js",
	 	dep: ["fun/hopfield/math.min.js"]
	},
	{
		main: "fun/phyllotaxis/phyllotaxis.js",
	 	dep: []
	},
	{
		main: "fun/boids/boid.js",
	 	dep: []
	},
	{
		main: "fun/perlin/perlin.js",
	 	dep: []
	}
];

hbb = null;

// load main script when its dependencies are all loaded
d_loaded = 0;
function check_deps(bg){
	d_loaded += 1;
	if (d_loaded == bg.dep.length){
		let scriptEle = document.createElement("script");
		scriptEle.setAttribute("src", bg.main);
		document.head.appendChild(scriptEle);

		scriptEle.addEventListener("load", () => {
			hsetup();
			hbb = hdraw;
		});
	}
}

function setup() {
	// choose random item from background scripts
	let bg = backgrounds[Math.floor(Math.random()*backgrounds.length)];

	if (bg.dep.length == 0){
		let scriptEle = document.createElement("script");
		scriptEle.setAttribute("src", bg.main);
		document.head.appendChild(scriptEle);

		scriptEle.addEventListener("load", () => {
			hsetup();
			hbb = hdraw;
		});

		return;
	}

	for (let i of bg.dep){
		let curr_dep = document.createElement("script");
		curr_dep.setAttribute("src", i);
		document.head.appendChild(curr_dep);

		curr_dep.addEventListener("load", () => {
			console.log("checking dependencies");
			check_deps(bg);
		});
	}
	
}

function draw() {

	if (hbb != null){
		hbb();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}