import EmberObject, { get } from '@ember/object';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Base from 'ember-validations/validators/base';

let model, Model, CustomValidator, validator;

module('Base Validator', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    Model = EmberObject.extend({
      dependentValidationKeys: {}
    });
    CustomValidator = Base.extend({
      init() {
        this._super();
        this.dependentValidationKeys.pushObject('otherAttribute');
      },
      call() {
      }
    });

    this.owner.register('object:model', Model);
    run(() => model = this.owner.lookup('object:model'));
  });

  test('when value is not empty', function(assert) {
    run(() => validator = CustomValidator.create({ model, property: 'attribute' }));
    assert.equal(get(validator, 'isValid'), true);
  });

  test('validator has isInvalid flag', function(assert) {
    run(() => validator = CustomValidator.create({ model, property: 'attribute' }));
    assert.equal(get(validator, 'isInvalid'), false);
  });

  test('generates dependentValidationKeys on the model', function(assert) {
    run(() => validator = CustomValidator.create({ model, property: 'attribute' }));
    assert.deepEqual(get(model, 'dependentValidationKeys'), { attribute: ['otherAttribute'] });
  });

  test('inactive validators should be considered valid', function(assert) {
    let canValidate = true;
    run(() => {
      validator = CustomValidator.create({
        model,
        property: 'attribute',
        canValidate() {
          return canValidate;
        },
        call() {
          this.errors.pushObject('nope');
        }
      });
    });
    assert.equal(get(validator, 'isValid'), false);
    canValidate = false;
    run(validator, 'validate');
    assert.equal(get(validator, 'isValid'), true);
  });
});
