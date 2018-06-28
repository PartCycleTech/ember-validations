import { isEmpty } from '@ember/utils';
import { set, get } from '@ember/object';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

export default Base.extend({
  init() {
    this._super(...arguments);
    if (this.options.constructor === RegExp) {
      set(this, 'options', { 'with': this.options });
    }

    if (this.options.message === undefined) {
      set(this, 'options.message',  Messages.render('invalid', this.options));
    }
  },

  call() {
    if (isEmpty(get(this.model, this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options.with && !new RegExp(this.options.with).test(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    } else if (this.options.without && new RegExp(this.options.without).test(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
