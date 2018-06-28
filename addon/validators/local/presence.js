import { get } from '@ember/object';
import { isBlank } from '@ember/utils';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

export default Base.extend({
  init() {
    this._super(...arguments);
    if (this.options === true) {
      this.options = {};
    }

    if (this.options.message === undefined) {
      this.options.message = Messages.render('blank', this.options);
    }
  },
  call() {
    if (isBlank(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
