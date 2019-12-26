import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class Controls extends Component {
  @service cubesAppState;

  @action
  updateCount(changeEvent) {
    let value = changeEvent.target.value;
    let newCount = parseInt(value);

    this.cubesAppState.updateCount(newCount);

    if (this.args.onUpdate) {
      this.args.onUpdate(newCount);
    }
  }
}
