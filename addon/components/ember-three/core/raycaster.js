import { LifeCycleComponent } from 'ember-lifecycle-component';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

import THREE from 'three';

export default class RaycasterComponent extends LifeCycleComponent {
  @service('ember-three/scene-manager')
  sceneManager;

  camera = undefined;
  scene = undefined;
  onRaycast = undefined;
  isRecursive = false;

  constructor() {
    super(...arguments);
    this.raycaster = new THREE.Raycaster();
    this.scene = this.sceneManager.getDefaultScene();
    this.scene.addRafCallback(this.render, this);
    this.camera = this.scene.camera;
    this.didReceiveArgs();
  }

  didReceiveArgs() {
    let { camera, parent, onRaycast, isRecursive } = this.args;
    if (camera) {
      this.camera = camera;
    } else {
      this.camera = this.scene.camera;
    }

    if (parent) {
      this.parent = parent;
    }

    if (onRaycast) {
      this.onRaycast = onRaycast;
    }

    if (isPresent(isRecursive)) {
      this.isRecursive = isRecursive;
    }
  }

  render() {
    if (this.camera && this.parent && this.onRaycast) {
      this.camera.updateMatrixWorld();
      this.raycaster.setFromCamera(this.scene.mouse, this.camera);
      let intersects = this.raycaster.intersectObjects(this.parent.children, this.isRecursive);
      this.onRaycast(intersects);
    }
  }

  willDestroy() {
    this.camera = undefined;
    this.scene = undefined;
    this.onRaycast = undefined;
    this.isRecursive = undefined;
  }
}
