import ObjectProxy from '../utils/object-proxy';
import THREE from 'three';

export default class SpotLightComponent extends ObjectProxy {
  constructor(owner, args) {
    super(owner, args);
    let { light } = this.args;
    if (light) {
      this.object3D = new THREE.SpotLightHelper(light);
    }

    this.init();
  }

  didReceiveArgs() {
    let { light, parent } = this.args;

    if (light && !this.object3D) {
      this.object3D = new THREE.SpotLightHelper(light);
    }

    if (this._object3D && light) {
      this._object3D.light = light;
    }

    if (parent !== this._parent) {
      this.remove(this._parent, this._object3D);
      this.add(parent, this._object3D);
      this._parent = parent;
    }
  }
}
