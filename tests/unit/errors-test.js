import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import EmberObject, { set, get } from '@ember/object';
import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Mixin from 'ember-validations/mixin';

let user, User;

module('Errors test', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    User = EmberObject.extend(Mixin, {
      validations: {
        name: {
          presence: true
        },
        age: {
          presence: true,
          numericality: true
        }
      }
    });

    this.owner.register('object:user', User);
  });

  hooks.afterEach(function() {
    /* eslint-disable */
    /* jscs:disable */
    delete Ember.I18n;
    /* jscs:enable */
    /* eslint-enable */
  });

  test('validations are run on instantiation - invalid', function(assert) {
    run(() => user = this.owner.lookup('object:user'));
    assert.equal(get(user, 'isValid'), false);
    assert.deepEqual(get(user, 'errors.name'), ["can't be blank"]);
    assert.deepEqual(get(user, 'errors.age'), ["can't be blank", 'is not a number']);
  });

  test('validations are run on instantiation - valid', function(assert) {
    run(() => user = this.owner.factoryFor('object:user').create({ name: 'Brian', age: 33 }));
    assert.ok(get(user, 'isValid'));
    assert.ok(isEmpty(get(user, 'errors.name')));
    assert.ok(isEmpty(get(user, 'errors.age')));
  });

  test('when errors are resolved', function(assert) {
    run(() => user = this.owner.lookup('object:user'));
    assert.equal(get(user, 'isValid'), false);
    assert.deepEqual(get(user, 'errors.name'), ["can't be blank"]);
    assert.deepEqual(get(user, 'errors.age'), ["can't be blank", 'is not a number']);

    run(() => set(user, 'name', 'Brian'));
    assert.equal(get(user, 'isValid'), false);
    assert.ok(isEmpty(get(user, 'errors.name')));
    assert.deepEqual(get(user, 'errors.age'), ["can't be blank", 'is not a number']);

    run(() => set(user, 'age', 'thirty three'));
    assert.equal(get(user, 'isValid'), false);
    assert.ok(isEmpty(get(user, 'errors.name')));
    assert.deepEqual(get(user, 'errors.age'), ['is not a number']);

    run(() => set(user, 'age', 33));
    assert.ok(get(user, 'isValid'));
    assert.ok(isEmpty(get(user, 'errors.name')));
    assert.ok(isEmpty(get(user, 'errors.age')));
  });
});
