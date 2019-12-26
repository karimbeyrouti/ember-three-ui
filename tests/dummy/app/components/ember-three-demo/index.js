import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';

export const DEFAULT_DEMO = 'shadow-cubes';

export default class DemoComponent extends Component {
  @tracked selectedDemo = DEFAULT_DEMO;

  constructor() {
    super(...arguments);
    let { demoId } = this.args;
    if (isPresent(demoId)) {
      this.selectedDemo = demoId;
    }
  }

  @action
  onSelectDemo(event) {
    let { value } = event.target;
    this.selectedDemo = value;
    this.args.onSelectDemo(value);
  }
}
