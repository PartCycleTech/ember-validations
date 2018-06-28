import { isPresent } from '@ember/utils';
import { set, get } from '@ember/object';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

export default Base.extend({
  init() {
    this._super(...arguments);
    if (this.options === true) {
      set(this, 'options', {});
    }

    if (this.options.message === undefined) {
      set(this, 'options.message', Messages.render('present', this.options));
    }
  },
  call() {
    if (isPresent(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
