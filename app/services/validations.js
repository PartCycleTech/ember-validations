import Service from '@ember/service';
import { set } from '@ember/object';

export default Service.extend({
  init() {
    set(this, 'cache', {});
  }
});
