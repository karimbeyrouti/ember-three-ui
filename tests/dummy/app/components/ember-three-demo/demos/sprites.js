import THREE from 'three';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Stats from 'stats.js';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InteractiveCubeDemoComponent extends Component {
  @service('ember-three/scene-manager') sceneManager;

  rendererParams = {
    clearColor: 0x000000,
    shadowMapType: THREE.PCFSoftShadowMap,
    shadowMapEnabled: true,
  };

  @tracked cameraPosition = new THREE.Vector3(0, 0, 1000);

  emberScene = undefined;

  @tracked textureLoader;
  @tracked sprite1;
  @tracked sprite2;
  @tracked sprite3;
  @tracked sprite4;
  @tracked sprite5;
  @tracked vertices = [];
  materials = [];

  constructor() {
    super(...arguments);

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    this.emberScene = this.sceneManager.get(this.sceneId);
    this.emberScene.addRafCallback(this.render, this);
    this.emberScene.setStats(this.stats);
    this.emberScene.scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    this.textureLoader = new THREE.TextureLoader();
    this.sprite1 = this.textureLoader.load('images/sprites/snowflake1.png');
    this.sprite2 = this.textureLoader.load('images/sprites/snowflake2.png');
    this.sprite3 = this.textureLoader.load('images/sprites/snowflake3.png');
    this.sprite4 = this.textureLoader.load('images/sprites/snowflake4.png');
    this.sprite5 = this.textureLoader.load('images/sprites/snowflake5.png');

    this.geometry = new THREE.BufferGeometry();

    for (let i = 0; i < 10000; i++) {
      let x = Math.random() * 2000 - 1000;
      let y = Math.random() * 2000 - 1000;
      let z = Math.random() * 2000 - 1000;

      this.vertices.push(x, y, z);
    }

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
  }

  get particles() {
    let particlesData = [];
    let parameters = [
      [[1.0, 0.2, 0.5], this.sprite2, 20],
      [[0.95, 0.1, 0.5], this.sprite3, 15],
      [[0.9, 0.05, 0.5], this.sprite1, 10],
      [[0.85, 0, 0.5], this.sprite5, 8],
      [[0.8, 0, 0.5], this.sprite4, 5],
    ];

    for (let i = 0; i < parameters.length; i++) {
      let color = parameters[i][0];
      let sprite = parameters[i][1];
      let size = parameters[i][2];

      this.materials[i] = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      });
      this.materials[i].color.setHSL(color[0], color[1], color[2]);

      particlesData.push({
        geometry: this.geometry,
        material: this.materials[i],
        rotation: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      });
    }

    return particlesData;
  }
  render() {
    let time = Date.now() * 0.00005;
    let { scene } = this.emberScene;

    for (let i = 0; i < scene.children.length; i++) {
      let object = scene.children[i];
      if (object instanceof THREE.Points) {
        object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
      }
    }
  }

  @action
  destroyElement() {
    document.body.removeChild(this.stats.dom);
  }
}
