import { run } from '@ember/runloop';
import EmberObject, { set } from '@ember/object';
import { module, test } from 'qunit';
import Presence from 'ember-validations/validators/local/presence';
import { setupTest } from 'ember-qunit';
import Mixin from 'ember-validations/mixin';

let model, Model, options, validator;

module('Presence Validator', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    Model = EmberObject.extend(Mixin);
    run(function() {
      model = Model.create();
    });
  });

  test('when value is not empty', function(assert) {
    options = { message: 'failed validation' };
    run(function() {
      validator = Presence.create({ model, property: 'attribute', options });
      set(model, 'attribute', 'not empty');
    });
    assert.deepEqual(validator.errors, []);
  });

  test('when value is empty', function(assert) {
    options = { message: 'failed validation' };
    run(function() {
      validator = Presence.create({ model, property: 'attribute', options });
      set(model, 'attribute', '');
    });
    assert.deepEqual(validator.errors, ['failed validation']);
  });

  test('when options is true', function(assert) {
    options = true;
    run(function() {
      validator = Presence.create({ model, property: 'attribute', options });
      set(model, 'attribute', '');
    });
    assert.deepEqual(validator.errors, ["can't be blank"]);
  });

  test('when value is blank', function(assert) {
    options = { message: 'failed validation' };
    run(function() {
      validator = Presence.create({ model, property: 'attribute', options });
      model.set('attribute', ' ');
    });
    assert.deepEqual(validator.errors, ['failed validation']);
  });

});