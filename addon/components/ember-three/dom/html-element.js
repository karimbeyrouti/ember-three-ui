import ObjectProxy from '../utils/object-proxy';
import Component from '@glimmer/component';

export default class HtmlElementDomComponent extends Component {

  htmlElement = undefined;

  constructor() {
    super(...arguments);
  }
  //
  // didReceiveArgs() {
  //   let { parent } = this.args;
  //   if (!this._object3D) {
  //     return;
  //   }
  //
  //   if (parent !== this._parent) {
  //     this._parent = parent;
  //   }
  // }
}
