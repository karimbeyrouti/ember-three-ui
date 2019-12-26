import THREE from 'three';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Stats from 'stats.js';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InteractiveCubeDemoComponent extends Component {
  @service('ember-three/scene-manager') sceneManager;

  @tracked cameraPosition = new THREE.Vector3(0, 0, 6.2);
  @tracked cameraTarget = new THREE.Vector3(0, 0, 0);

  emberScene = undefined;
  boxBufferGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  spotLightPosition = new THREE.Vector3(
    getRandomInt(20, 40),
    getRandomInt(10, 30),
    getRandomInt(10, 30)
  );
  spotLightTarget = new THREE.Object3D(0, 0, 0);
  spotLightDistance = 100;
  spotLightAngle = 0.7853;
  spotLightShadow = {
    mapSize: {
      width: 1024,
      height: 1024,
    },
    camera: {
      near: 10,
      far: 600,
    },
  };
  planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 40, 40);
  planeMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true });
  planeRotation = new THREE.Vector3(-Math.PI / 2, 0, 0);
  radius = 50;
  rendererParams = {
    clearColor: 0x000000,
    shadowMapType: THREE.PCFSoftShadowMap,
    shadowMapEnabled: true,
  };
  sceneId = 'ember-threejs-shadow-cubes-demo';
  theta = 0;

  constructor() {
    super(...arguments);

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    this.emberScene = this.sceneManager.get(this.sceneId);
    this.emberScene.addRafCallback(this.render, this);
    this.emberScene.setStats(this.stats);
  }

  get cubes() {
    let cubeProperties = [];
    let material = new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true });
    for (let i = 0; i < 200; i++) {
      let rotation = new THREE.Vector3();
      rotation.y = Math.random() * 2 * Math.PI;
      rotation.x = rotation.y = 0;

      let scale = new THREE.Vector3();
      scale.x = getRandomInt(2, 5);
      scale.y = getRandomInt(2, 15);
      scale.z = getRandomInt(2, 5);

      let position = new THREE.Vector3();
      position.x = Math.random() * 200 - 100;
      position.y = scale.y / 2;
      position.z = Math.random() * 200 - 100;

      cubeProperties.push({
        material,
        position,
        scale,
        rotation,
      });
    }

    return cubeProperties;
  }
  render() {
    this.theta += 0.05;
    let xMousePosition = this.emberScene.mouse.x * 30;
    let yMousePosition = this.emberScene.mouse.y * 30 + 40;
    let xMouseIncrement = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
    this.cameraPosition.x = xMousePosition + xMouseIncrement;
    this.cameraPosition.y = yMousePosition;
    this.cameraPosition.z = this.radius * Math.cos(THREE.Math.degToRad(this.theta));
    this.cameraPosition = this.cameraPosition; // flag as dirty so glimmer can update args
  }

  @action
  destroyElement() {
    document.body.removeChild(this.stats.dom);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
