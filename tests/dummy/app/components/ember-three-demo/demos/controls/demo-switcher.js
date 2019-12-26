import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { DEFAULT_DEMO } from '../../index';
import { isPresent } from '@ember/utils';

export default class Controls extends Component {
  @tracked demoList = ['cubes', 'lines', 'interactive-cubes', 'shadow-cubes', 'sprites'];
  @tracked selectedDemoListItem = DEFAULT_DEMO;

  constructor() {
    super(...arguments);
    let { demoId } = this.args;
    if (isPresent(demoId)) {
      this.selectedDemoListItem = demoId;
    }
  }

  get selectedDemo() {
    let { demoId } = this.args;
    return isPresent(demoId) ? demoId : this.selectedDemoListItem;
  }
}
