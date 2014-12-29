var LotusField = function() {
  this.s = 11;
  this.lotuses = [];
  this.origPetalRot = 0.7;
  this.origBrightness = 0.4;
  this.origTextY = 20;
  this.origTextScale = .1;
  this.textCreator = new TextCreator(30);

  this.wrapperMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.00,
    depthTest: false

  })


  var xoff = 0,
    yoff = -100;

  var petalShape = new THREE.Shape();
  //262, 16
  var x = 262;
  petalShape.moveTo(xoff, yoff);
  //aCP1x, aCP1y,aCP2x, aCP2y,aX, aY 
  petalShape.bezierCurveTo(x - 254 + xoff, 3 + yoff, x - 258 + xoff, 49 + yoff, x - 256 + xoff, 34 + yoff);
  petalShape.bezierCurveTo(x - 254 + xoff, 19 + yoff, x - 240 + xoff, 94 + yoff, x - 240 + xoff, 114 + yoff);
  petalShape.bezierCurveTo(x - 240 + xoff, 135 + yoff, x - 228 + xoff, 175 + yoff, x - 281 + xoff, 172 + yoff);
  petalShape.bezierCurveTo(x - 296 + xoff, 171 + yoff, x - 310 + xoff, 125 + yoff, x - 302 + xoff, 106 + yoff);
  petalShape.bezierCurveTo(x - 296 + xoff, 92 + yoff, x - 283 + xoff, 48 + yoff, x - 273 + xoff, 36 + yoff);
  petalShape.bezierCurveTo(x - 263 + xoff, 24 + yoff, x - 275 + xoff, 9 + yoff, x - 266 + xoff, 21 + yoff);

  //bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5, curveSegments: 12
  var extrudeSettings = {
    amount: 1,
    bevelEnabled: false
  }

  this.petalGeo = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
  // geo.applyMatrix( new THREE.Matrix4().makeTranslation( new THREE.Vector3(0, 0, 0) ) );



  this.createLotus(new THREE.Vector3(0, -50, 0), new THREE.Vector3(0.8, 0.1, 1.0), "Relax");

}

LotusField.prototype.createLotus = function(position, color, text) {
  var lotus = new THREE.Mesh(new THREE.SphereGeometry(100), this.wrapperMaterial)
  lotus.petals = [];
  this.lotuses.push(lotus)
  scene.add(lotus)
  lotus.position.copy(position)
  lotus.translateY(100);
  lightParams.textures.value.push(audioController.texture);
  lightParams.positions.value.push(new THREE.Vector3(lotus.position.x, lotus.position.y + 100, lotus.position.z));
  lightParams.colors.value.push(color);
  var mat = createShaderMaterial(color);
  for (var i = 0; i < this.s; i++) {
    petal = new THREE.Mesh(this.petalGeo, mat);
    petal.rotation.order = "YXZ";
    petal.rotation.y = (i / this.s * (Math.PI * 2));
    petal.rotation.x = this.origPetalRot;
    lotus.add(petal);
    lotus.petals.push(petal)
  }

  lotus.text = this.textCreator.createMesh(text, {size: this.origTextScale, crispness: 1});
  lotus.text.position.y = this.origTextY;

  lotus.add(lotus.text);

  objectControls.add(lotus);
  lotus.hoverOver = function(){
    document.body.style.cursor = "pointer";
    this.bloom(lotus)
  }.bind(this);
  lotus.hoverOut = function(){
    document.body.style.cursor = "auto";
    this.unbloom(lotus)
  }.bind(this);
  // //for some reason need to set intial rotation in another loop?? WHY?
  // for (var i = 0; i < s; i++) {
  //   petals[i].rotation.x -= 0.2
  // }

  return lotus

  function createShaderMaterial(color) {

    var uniforms = {
      timer: timer,
      normalScale: lightParams.normalScale,
      texScale: lightParams.texScale,
      t_normal: {
        type: 't',
        value: TEXTURES.flower
      },
      cameraPos: {
        type: 'v3',
        value: camera.position
      },
      color: {
        type: 'v3',
        value: color
      },
      t_audio: {
        type: 't',
        value: audioController.texture
      },
      brightness: {
        type: 'f',
        value: this.origBrightness
      }
    };
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shaders.vs.lotus,
      fragmentShader: shaders.fs.lotus
    });
  }

}

LotusField.prototype.bloom = function(lotus) {
  lotus.text.lookAt(camera.position);
  if (lotus.blooming) {
    return;
  }
  lotus.blooming = true;
  var i = {
    rotX: lotus.petals[0].rotation.x,
    brightness: lotus.petals[0].material.uniforms.brightness.value,
    textY: lotus.text.position.y,
    textScale: lotus.text.scale.x
  };
  var f = {
    rotX: lotus.petals[0].rotation.x + .4,
    brightness: 1.1,
    textY: lotus.text.position.y + 70,
    textScale: 20

  }
  var bloomTween = new TWEEN.Tween(i, 2000).
  to(f).
  onUpdate(function() {
    _.each(lotus.petals, function(petal) {
      petal.rotation.x = i.rotX;
      lotus.petals[0].material.uniforms.brightness.value = i.brightness;
      lotus.text.position.y = i.textY
      lotus.text.scale.set(i.textScale, i.textScale, i.textScale);
      G.pondMaterial.uniforms.brightness.value = i.brightness
    });
  }).
  start();
  bloomTween.onComplete(function() {
    lotus.blooming = false;
  })
}

LotusField.prototype.unbloom = function(lotus) {

  var i = {
    rotX: lotus.petals[0].rotation.x,
    brightness: lotus.petals[0].material.uniforms.brightness.value,
    textY: lotus.text.position.y,
    textScale: lotus.text.scale.x
  };
  var f = {
    rotX: this.origPetalRot,
    brightness: this.origBrightness,
    textY: this.origTextY,
    textScale: this.origTextScale
  }
  var bloomTween = new TWEEN.Tween(i, 3000).
  to(f).
  onUpdate(function() {
    _.each(lotus.petals, function(petal) {
      petal.rotation.x = i.rotX;
      lotus.petals[0].material.uniforms.brightness.value = i.brightness;
      lotus.text.position.y = i.textY;
      lotus.text.scale.set(i.textScale, i.textScale, i.textScale);
      G.pondMaterial.uniforms.brightness.value = i.brightness;
    });
  }).
  start();
  bloomTween.onComplete(function() {
    lotus.blooming = false;
  })
}