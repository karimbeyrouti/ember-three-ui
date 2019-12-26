import THREE from 'three';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

class ParticleData {
  @tracked geometry;
  @tracked material;
  @tracked rotation;
  @tracked scale;

  constructor({ geometry, material, rotation, scale }) {
    this.geometry = geometry;
    this.material = material;
    this.rotation = rotation;
    this.scale = scale;
  }
}

export default class DemoComponent extends Component {
  @service('ember-three/scene-manager') sceneManager;
  emberScene = undefined;
  @tracked rotations = [];
  @tracked _particlesData = [];

  vertices = [];
  materials = [];
  textureLoader;
  sprite1;
  sprite2;
  sprite3;
  sprite4;
  sprite5;
  geometry;

  constructor() {
    super(...arguments);

    this.emberScene = this.sceneManager.get(this.args.sceneId);
    this.emberScene.addRafCallback(this.render, this);

    this.textureLoader = new THREE.TextureLoader();
    this.sprite1 = this.textureLoader.load('images/sprites/snowflake1.png');
    this.sprite2 = this.textureLoader.load('images/sprites/snowflake2.png');
    this.sprite3 = this.textureLoader.load('images/sprites/snowflake3.png');
    this.sprite4 = this.textureLoader.load('images/sprites/snowflake4.png');
    this.sprite5 = this.textureLoader.load('images/sprites/snowflake5.png');
    this.geometry = new THREE.BufferGeometry();

    for (let i = 0; i < 12000; i++) {
      let max = 70;
      let min = 35;
      let x = Math.random() * max - min;
      let y = Math.random() * max - min;
      let z = Math.random() * max - min;
      this.vertices.push(x, y, z);
    }

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
    this._particlesData = this.initParticles();
  }

  initParticles() {
    let particlesData = [];
    let sizeScalar = 110;
    let parameters = [
      [[0.2, 0.2, 0.5], this.sprite2, 20 / sizeScalar],
      [[0.3, 0.1, 0.5], this.sprite3, 15 / sizeScalar],
      [[0.1, 0.05, 0.5], this.sprite1, 10 / sizeScalar],
      [[0.2, 0, 0.5], this.sprite5, 8 / sizeScalar],
      [[0.28, 0, 0.5], this.sprite4, 5 / sizeScalar],
    ];

    for (let i = 0; i < parameters.length; i++) {
      let color = parameters[i][0];
      let sprite = parameters[i][1];
      let size = parameters[i][2];

      this.materials[i] = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true,
      });
      this.materials[i].color.setHSL(color[0], color[1], color[2]);

      this.rotations[i] = new THREE.Vector3(0, Math.random() * 6, 0);
      particlesData.push(
        new ParticleData({
          geometry: this.geometry,
          material: this.materials[i],
          rotation: this.rotations[i],
          scale: new THREE.Vector3(1, 1, 1),
        })
      );
    }

    return particlesData;
  }

  get particles() {
    this._particlesData.forEach((particleData, counter) => {
      particleData.rotation = this.rotations[counter];
    });

    return this._particlesData;
  }

  render(dt) {
    let time = dt / 10000; // / 10;
    for (let i = 0; i < this.rotations.length; i++) {
      let rotation = this.rotations[i];
      rotation.y -= time * (i + 1);
    }

    this.rotations = this.rotations;
  }
}
