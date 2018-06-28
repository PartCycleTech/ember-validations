import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import EmberObject, { set, get } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Confirmation from 'ember-validations/validators/local/confirmation';
import Mixin from 'ember-validations/mixin';

let model, Model, options, validator;

module('Confirmation Validator', function(hooks) {
  setupTest(hooks);

  Model = EmberObject.extend(Mixin);
  this.registry.register('object:model', Model);
  run(() => model = this.owner.lookup('object:model'));

  test('when values match', function(assert) {
    options = { message: 'failed validation' };
    run(function() {
      validator = Confirmation.create({ model, property: 'attribute', options });
      set(model, 'attribute', 'test');
      set(model, 'attributeConfirmation', 'test');
    });
    assert.deepEqual(validator.errors, []);
    run(function() {
      set(model, 'attributeConfirmation', 'newTest');
    });
    assert.deepEqual(validator.errors, ['failed validation']);
    run(function() {
      set(model, 'attribute', 'newTest');
    });
    assert.deepEqual(validator.errors, []);
  });

  test('when values do not match', function(assert) {
    options = { message: 'failed validation' };
    run(function() {
      validator = Confirmation.create({ model, property: 'attribute', options });
      set(model, 'attribute', 'test');
    });
    assert.deepEqual(validator.errors, ['failed validation']);
  });

  test('when original is null', function(assert) {
    run(function() {
      validator = Confirmation.create({ model, property: 'attribute' });
      model.set('attribute', null);
    });
    assert.ok(isEmpty(validator.errors));
  });

  test('when confirmation is null', function(assert) {
    run(function() {
      validator = Confirmation.create({ model, property: 'attribute' });
      model.set('attributeConfirmation', null);
    });
    assert.ok(isEmpty(validator.errors));
  });

  test('when options is true', function(assert) {
    options = true;
    run(function() {
      validator = Confirmation.create({ model, property: 'attribute', options });
      set(model, 'attribute', 'test');
    });
    assert.deepEqual(validator.errors, ["doesn't match attribute"]);
  });

  test('message integration on model, prints message on Confirmation property', function(assert) {
    let otherModel;
    let OtherModel = this.container.lookupFactory('object:model').extend({
      validations: {
        attribute: {
          confirmation: true
        }
      }
    });

    this.registry.register('model:other', OtherModel);

    run(() => otherModel = this.container.lookupFactory('model:other').create());
    run(() => set(otherModel, 'attribute', 'test'));

    assert.deepEqual(get(otherModel, 'errors.attributeConfirmation'), ["doesn't match attribute"]);
    assert.deepEqual(get(otherModel, 'errors.attribute'), []);
  });
});