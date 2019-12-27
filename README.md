ember-three-ui
==============================================================================

This addon enables three.js scene hierarchy to be composed in templates. 
For example, this is the handlebars template for a simple scene:

```handlebars
<main>
  <EmberThree
    @id='cube-demo'
    @rendererParams={{this.rendererParams}}
    as |emberThree|
  >
    <EmberThree::Cameras::PerspectiveCamera
      @position={{this.cameraPosition}}
    />
    <EmberThree::Objects::Mesh
      @rotation={{this.rotation}}
      @parent={{emberThree.scene}}
      @material={{this.material}}
      @geometry={{this.geometry}}
    />
  </EmberThree>
</main>
```

and the corresponding JavaScript:

```javascript
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
```


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-three-ui
```


Demo
------------------------------------------------------------------------------
https://karimbeyrouti.github.io/ember-three-ui/

Usage
------------------------------------------------------------------------------

...


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
