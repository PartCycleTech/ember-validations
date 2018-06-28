import { A as emberArray } from '@ember/array';
import EmberObject, { set, get } from '@ember/object';

export default EmberObject.extend({
  unknownProperty(property) {
    set(this, property, emberArray());
    return get(this, property);
  }
});
