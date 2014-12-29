var pondWidth = 50000;
var Pond = function() {

  G.pondParams = {

    normalScale: {
      type: "f",
      value: .3
    },
    texScale: {
      type: "f",
      value: 111
    },
    bumpHeight: {
      type: 'f',
      value: 60
    },
    bumpSize: {
      type: 'f',
      value: 0.01
    },
    bumpSpeed: {
      type: 'f',
      value: .06
    },
    bumpCutoff: {
      type: 'f',
      value: 0.5
    },
    brightness: {
      type: 'f',
      value: 0.5
    }
  }
  var pondGui = gui.addFolder('Pond Params');
  var pp = G.pondParams;
  pondGui.add(pp.bumpHeight, 'value').name('bumpHeight');
  pondGui.add(pp.bumpSize, 'value').name('bumpSize');
  pondGui.add(pp.bumpSpeed, 'value').name('bumpSpeed');
  pondGui.add(pp.bumpCutoff, 'value').name('bumpCutoff');
  pondGui.add(pp.texScale, 'value').name('texScale');
  pondGui.add(pp.normalScale, 'value').name('normalScale');
  pondGui.add(pp.brightness, 'value').name('brightness');

  var pondGeo = new THREE.PlaneGeometry(pondWidth, pondWidth, 3, 3);

  G.pondMaterial = new THREE.ShaderMaterial({
    uniforms: {
      timer: timer,
      t_normal: {
        type: "t",
        value: TEXTURES.moss
      },
      t_iri: {
        type: "t",
        value: TEXTURES.iriTurq
      },
      normalScale: G.pondParams.normalScale,
      texScale: G.pondParams.texScale,
      bumpHeight: G.pondParams.bumpHeight,
      bumpSize: G.pondParams.bumpSize,
      bumpSpeed: G.pondParams.bumpSpeed,
      bumpCutoff: G.pondParams.bumpCutoff,
      brightness: G.pondParams.brightness,
      lightCutoff: lightParams.cutoff,
      lightPower: lightParams.power,
      lightPositions: lightParams.positions,
      lightTextures: lightParams.textures,
      lightColors: lightParams.colors,
      cameraPos: {
        type: "v3",
        value: camera.position
      }
    },
    vertexShader: shaders.vs.pond,
    fragmentShader: shaders.fs.pond,
    transparent: true,
    opacity: 0.2
  });
  var pond = new THREE.Mesh(pondGeo, G.pondMaterial);
  pond.rotation.x = -Math.PI / 2;
  scene.add(pond);

}