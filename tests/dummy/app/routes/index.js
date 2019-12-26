import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class IndexRoute extends Route {
  queryParams = {
    id: {
      refreshModel: true,
    },
  };

  model({ id }) {
    return {
      id,
      onSelectDemo: this.onSelectDemo,
    };
  }

  @action
  onSelectDemo(id) {
    this.transitionTo({ queryParams: { id } });
  }
}
