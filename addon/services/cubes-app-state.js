import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { newProperties } from '../utils/utils';

export default class AppStateService extends Service {
  @tracked count = 100;
  @tracked objectProperties = [];

  constructor() {
    super(...arguments);
    this.updateProperties();
  }

  updateCount(newCount) {
    this.count = newCount;
    this.updateProperties();
  }

  updateProperties() {
    this.objectProperties = newProperties(this.count);
  }
}
