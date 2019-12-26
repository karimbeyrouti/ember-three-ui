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
  geometry = new THREE.BoxBufferGeometry(20, 20, 20);
  intersected = undefined;
  intersects = [];
  lightPosition = new THREE.Vector3(1, 1, 1);
  radius = 50;
  rendererParams = {
    clearColor: 0x222222,
  };
  sceneId = 'ember-threejs-interactive-cubes-demo';
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

    for (let i = 0; i < 2000; i++) {
      let material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });

      let position = new THREE.Vector3();
      position.x = Math.random() * 800 - 400;
      position.y = Math.random() * 800 - 400;
      position.z = Math.random() * 800 - 400;

      let rotation = new THREE.Vector3();
      rotation.x = Math.random() * 2 * Math.PI;
      rotation.y = Math.random() * 2 * Math.PI;
      rotation.z = Math.random() * 2 * Math.PI;

      let scale = new THREE.Vector3();
      scale.x = Math.random() + 0.5;
      scale.y = Math.random() + 0.5;
      scale.z = Math.random() + 0.5;

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
    this.cameraPosition.x = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
    this.cameraPosition.y = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
    this.cameraPosition.z = this.radius * Math.cos(THREE.Math.degToRad(this.theta));
    this.cameraPosition = this.cameraPosition; // flag as dirty so glimmer can update args

    let { intersected, intersects } = this;
    if (intersects.length > 0) {
      if (intersected !== intersects[0].object) {
        if (intersected) {
          intersected.material.emissive.setHex(intersected.currentHex);
        }

        this.intersected = intersects[0].object;
        this.intersected.currentHex = this.intersected.material.emissive.getHex();
        this.intersected.material.emissive.setHex(0xff0000);
      }
    } else {
      if (this.intersected) {
        this.intersected.material.emissive.setHex(0x000000);
      }

      this.intersected = undefined;
    }
  }

  @action
  onRaycast(intersects) {
    this.intersects = intersects;
  }
  @action
  destroyElement() {
    document.body.removeChild(this.stats.dom);
  }
}
