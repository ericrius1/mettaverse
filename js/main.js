//imagine a hurt you have held. Now hold down on the container
//to fill it up with the hurt. now let it go

//Now imagine filling up the container with love for the world
//charge it up. And let it go into the world

var scene, camera, renderer, clock, objectControls;
var pond, petalObject, pond, lotusfield;
var rf = THREE.randFloat;
var timer = {
  type: 'f',
  value: 0
};
var dT = {
  type: "f",
  value: 0
};
var loader = new Loader();
loader.onStart = function() {
  init();
  animate();
}


function init() {
  var stream = new Stream('audio/pond.mp3', audioController);
  stream.play();
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 200000);
  camera.position.set(99, 465, 581)
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.createElement('div');
  container.id = "container";
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  objectControls = new ObjectControls(camera);

  pond = new Pond();
  lotusfield = new LotusField();

}

function animate() {
  dT.value = clock.getDelta();
  timer.value += dT.value;
  requestAnimationFrame(animate);
  controls.update();
  objectControls.update();
  audioController.update();
  renderer.render(scene, camera);
  TWEEN.update();
}


var TEXTURES = {};
var normals = [];
loadTexture('moss', 'assets/normals/sand.png', normals)
loadTexture('flower', 'assets/normals/other.jpg', normals)

var shaders = new ShaderLoader('shaders');

loader.beginLoading();
shaders.load('vs-pond', 'pond', 'vertex');
shaders.load('fs-pond', 'pond', 'fragment');
shaders.load('vs-lotus', 'lotus', 'vertex');
shaders.load('fs-lotus', 'lotus', 'fragment');

shaders.shaderSetLoaded = function() {
  loader.endLoading();
}

var gui = new dat.GUI({
  autoplace: false
});
gui.close();

var guiContainer = document.getElementById('GUI');
guiContainer.appendChild(gui.domElement)


//*****************AUDIO***************
var audioController = new AudioController();
var AUDIO = {};



var lightParams = {

  cutoff: {
    type: "f",
    value: 1000
  },
  power: {
    type: "f",
    value: 1
  },
  positions: {
    type: "v3v",
    value: []
  },
  textures: {
    type: "tv",
    value: []
  },
  colors: {
    type: "v3v",
    value: []
  },
  normalScale: {
    type: "f",
    value: 3
  },
  texScale: {
    type: "f",
    value: 0.011
  },

}

var lightGui = gui.addFolder('Light Params');

lightGui.add(lightParams.cutoff, 'value').name('cutoff');
lightGui.add(lightParams.power, 'value').name('power');
lightGui.add(lightParams.normalScale, 'value').name('normalScale');
lightGui.add(lightParams.texScale, 'value').name('texScale');



function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadTexture(name, file, array) {
  this.loader.beginLoading();
  var cb = function() {
    loader.endLoading();
  };

  var m = THREE.UVMapping;

  var l = THREE.ImageUtils.loadTexture;

  TEXTURES[name] = l(file, m, cb);
  TEXTURES[name].wrapS = THREE.RepeatWrapping;
  TEXTURES[name].wrapT = THREE.RepeatWrapping;
  array.push(TEXTURES[name]);
}

window.addEventListener('resize', onResize, false);

function map(value, min1, max1, min2, max2) {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}