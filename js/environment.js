var colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};

var gradients = {
	night: [0x0F2027, 0x2C5364],
	dawn: [0xF3904F, 0x3B4371],
	morning: [0xFF5F6D, 0xFFC371],
	noon: [0xE0EAFC, 0xCFDEF3],
	evening: [0x005AA7, 0xFFFDE4],
	dusk: [0x2C3E50, 0xFD746C]
}

window.addEventListener('load', init, false);

function init() {
	createScene();
	createLights();
	createSea();
	createSky();

	loop();
}

var scene, renderer, camera, HEIGHT, WIDTH;

function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	console.log(THREE);
	scene = new THREE.Scene();

	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

	let aspectRatio = WIDTH / HEIGHT;
	let fieldOfView = 60;
	let nearPlane = 1;
	let farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 90;

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});

	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;

	var container = document.getElementById("world");
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

	shadowLight = new THREE.DirectionalLight(0xffffff, .9);
	shadowLight.position.set(150, 350, 350);
	shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	ambientLight = new THREE.AmbientLight(0xffffff, .5);

	scene.add(hemisphereLight);  
	scene.add(shadowLight);
	// scene.add(ambientLight);
}

Sea = function() {
	var geom = new THREE.BoxGeometry(1000, 500, 600, 10, 10, 1);
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

	geom.mergeVertices();

	var l = geom.vertices.length;

	this.waves = [];

	for (var i = 0; i < l; i++) {
		var v = geom.vertices[i];

		this.waves.push({
			y: v.y,
			x: v.x,
			z: v.z,
			ang: Math.random() * Math.PI * 2,
			amp: 5 + Math.random() * 15,
			speed: 0.016 + Math.random() * 0.032
		})
	}


	var mat = new THREE.MeshPhongMaterial({
		color: colors.blue,
		transparent: true,
		opacity: 0.8,
		flatShading: true
	});

	this.mesh = new THREE.Mesh(geom, mat);
	this.mesh.receiveShadow = true;
};

Sea.prototype.movewaves = function() {
	var vertices = this.mesh.geometry.vertices;

	var l = vertices.length;

	for (var i = 0; i < l; i++) {
		var v = vertices[i];

		var vprops = this.waves[i];

		v.x = vprops.x + Math.sin(vprops.ang) * vprops.amp;
		v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

		vprops.ang += vprops.speed;
	}

	this.mesh.geometry.verticesNeedUpdate = true;
}

var sea;
function createSea() {
	sea = new Sea();

	sea.mesh.position.y = -325;
	scene.add(sea.mesh);
}

Cloud = function() {
	this.mesh = new THREE.Object3D();

	var geom = new THREE.BoxGeometry(20, 20, 20);

	var mat = new THREE.MeshPhongMaterial({
		color: colors.white
	});

	var nBlocks = 4 + Math.floor(Math.random()*3);

	for (var i = 0; i < nBlocks; i++) {
		var m = new THREE.Mesh(geom, mat);

		m.position.x = i * 10;
		m.position.y = Math.random() * 10;
		m.position.z = Math.random() * 10;
		m.rotation.z = Math.random() * Math.PI * 2;
		m.rotation.y = Math.random() * Math.PI * 2;

		var s = 0.1 + Math.random() * 0.9;
		m.scale.set(s, s, s);

		m.castSahdow = true;
		m.receiveShadow = true;

		this.mesh.add(m);
	}
};

Sky = function() {
	this.mesh = new THREE.Object3D();

	this.nClouds = 60;

	var stepAngle = Math.PI * 2 / this.nClouds;

	for (var i = 0; i < this.nClouds; i++) {
		var c = new Cloud();

		var a = stepAngle * i;
		var h = WIDTH*1.2 + Math.random() * 150;

		c.mesh.position.x = Math.cos(a) * h;
		c.mesh.position.y = Math.sin(a) * h + (-75 + Math.random() * 150);

		c.mesh.rotation.z = a + Math.PI / 2;

		c.mesh.position.z = -400 - Math.random() * 400;


		var s = 1 + Math.random() * 2;
		c.mesh.scale.set(s, s, s);

		this.mesh.add(c.mesh);
	}

};

var sky;
function createSky() {
	sky = new Sky();
	sky.mesh.position.y = -1400;
	scene.add(sky.mesh);
}

function loop() {
	sky.mesh.rotation.z += 0.0001;
	sea.movewaves();

	renderer.render(scene, camera);
	requestAnimationFrame(loop);
}


