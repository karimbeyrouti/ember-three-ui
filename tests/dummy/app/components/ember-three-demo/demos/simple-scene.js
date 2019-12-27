import THREE from 'three';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class DemoComponent extends Component {
  @service('ember-three/scene-manager') sceneManager;
  @tracked rotation = new THREE.Vector3();

  cameraPosition = new THREE.Vector3(0, 0, 5);
  geometry = new THREE.BoxGeometry(1, 1, 1);
  material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  constructor() {
    super(...arguments);
    let emberThree = this.sceneManager.get(this.sceneId);
    emberThree.addRafCallback(this.render, this);
  }

  render() {
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
    this.rotation = this.rotation;
  }
}
