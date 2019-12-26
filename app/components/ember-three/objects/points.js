import THREE from 'three';
import ObjectProxy from '../utils/object-proxy';

export default class SceneMeshComponent extends ObjectProxy {
  constructor(owner, args) {
    super(owner, args);
    let { geometry, material } = this.args;
    this.object3D = new THREE.Points(geometry, material);
    this.init();
  }
  //
  // didReceiveArgs() {
  //   super.didReceiveArgs();
  //   if (!this.object3D) {
  //     return;
  //   }
  //
  //   let { receiveShadow, castShadow } = this.args;
  //
  //   if (receiveShadow) {
  //     this.object3D.receiveShadow = receiveShadow;
  //   }
  //
  //   if (castShadow) {
  //     this.object3D.castShadow = castShadow;
  //   }
  // }
}
