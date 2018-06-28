import Controller from '@ember/controller';
import EmberValidations from 'ember-validations';

export default Controller.extend(EmberValidations, {
  validations: {
    foo: {
      presence: true
    },

    bar: {
      presence: true,
      length: { minimum: 5 }
    },

    baz: {
      presence: {
        if: 'isBaz'
      }
    }
  }
});
