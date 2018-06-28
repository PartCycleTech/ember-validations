import { A as emberArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import EmberObject, { set, get } from '@ember/object';
import { setOwner } from '@ember/application';
import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberValidations, { validator } from 'ember-validations';
import Base from 'ember-validations/validators/base';

let Profile, profile, user, User, promise;

const {
  ArrayController,
  K,
  ObjectController
} = Ember;

module('Validate test', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    User = EmberObject.extend(EmberValidations, {
      validations: {
        firstName: {
          presence: true,
          length: 5
        },
        lastName: {
          format: { with: /\w+/ }
        }
      }
    });

    this.owner.register('object:user', User);

    run(() => user = this.owner.lookup('object:user'));
  });

  test('returns a promise', function(assert) {
    run(() => {
      promise = user.validate()
        .then(() => assert.ok(false, 'expected validation failed'))
        .catch(() => assert.equal(get(user, 'isValid'), false));
    });

    return promise;
  });

  test('isInvalid tracks isValid', function(assert) {
    assert.equal(get(user, 'isInvalid'), true);
    run(() => user.setProperties({ firstName: 'Brian', lastName: 'Cardarella' }));
    assert.equal(get(user, 'isInvalid'), false);
  });

  test('runs all validations', function(assert) {
    run(() => {
      promise = user.validate().catch(function(errors) {
        assert.deepEqual(get(errors, 'firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
        assert.deepEqual(get(errors, 'lastName'), ['is invalid']);
        assert.equal(get(user, 'isValid'), false);
        set(user, 'firstName', 'Bob');
        user.validate('firstName').catch(function(errors) {
          assert.deepEqual(get(errors, 'firstName'), ['is the wrong length (should be 5 characters)']);
          assert.equal(get(user, 'isValid'), false);
          set(user, 'firstName', 'Brian');
          set(user, 'lastName', 'Cardarella');
          user.validate().then(function(errors) {
            assert.ok(isEmpty(get(errors, 'firstName')));
            assert.ok(isEmpty(get(errors, 'lastName')));
            assert.equal(get(user, 'isValid'), true);
          });
        });
      });
    });

    return promise;
  });

  test('it can be mixed into an Ember Object', function(assert) {
    let defaults = {
      validations: {
        soul: { presence: true }
      }
    };

    setOwner(defaults, this.owner);
    let Being = EmberObject.extend(EmberValidations, defaults);
    let being = Being.create({ soul: null });
    assert.equal(get(being, 'isValid'), false);
  });

  if (ObjectController) {
    test('can be mixed into an controller', function(assert) {
      let Controller, controller, user;

      Controller = ObjectController.extend(EmberValidations, {
        validations: {
          name: {
            presence: true
          }
        }
      });

      this.registry.register('controller:user', Controller);

      run(() => controller = this.container.lookupFactory('controller:user').create());
      assert.equal(get(controller, 'isValid'), false);

      user = EmberObject.create();
      run(() => set(controller, 'model', user));
      assert.equal(get(controller, 'isValid'), false);

      run(() => set(user, 'name', 'Brian'));
      assert.equal(get(controller, 'isValid'), true);
    });
  }
});

if (ObjectController && ArrayController) {
  module('Array controller', function(hooks) {
    setupTest(hooks);

    test('can be mixed into an array controller', function(assert) {
      let Controller, controller, user, UserController;

      UserController = ObjectController.extend(EmberValidations, {
        validations: {
          name: {
            presence: true
          }
        }
      });

      this.owner.register('controller:user', UserController);

      Controller = ArrayController.extend(EmberValidations, {
        itemController: 'User',
        validations: {
          '[]': true
        }
      });

      this.owner.register('controller:list', Controller);

      run(() => controller = this.container.lookupFactory('controller:list').create());

      assert.equal(get(controller, 'isValid'), true);

      user = EmberObject.create();

      run(() => controller.pushObject(user));

      assert.equal(get(controller, 'isValid'), false);
      run(() => set(user, 'name', 'Brian'));
      assert.equal(get(controller, 'isValid'), true);
      run(() => set(user, 'name', undefined));
      assert.equal(get(controller, 'isValid'), false);
      run(() => get(controller, 'content').removeObject(user));
      assert.equal(get(controller, 'isValid'), true);
    });
  });
}

module('Relationship validators', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    Profile = EmberObject.extend(EmberValidations, {
      validations: {
        title: {
          presence: true
        }
      }
    });

    User = EmberObject.extend(EmberValidations);

    this.owner.register('object:profile', Profile);
    this.owner.register('object:user', User);

    run(() => profile = this.owner.factoryFor('object:profile').create({ hey: 'yo' }));
  });

  test('validates other validatable property', function(assert) {
    run(() => {
      user = this.owner.factoryFor('object:user').create({
        validations: {
          profile: true
        }
      });
    });

    assert.equal(get(user, 'isValid'), true);

    run(function() {
      set(user, 'profile', profile);
    });
    assert.equal(get(user, 'isValid'), false);
    run(function() {
      set(profile, 'title', 'Developer');
    });
    assert.equal(get(user, 'isValid'), true);
  });

  test('validates array of validable objects', function(assert) {
    let friend1, friend2;

    run(() => {
      user = this.owner.factoryFor('object:user').create({
        validations: {
          friends: true
        }
      });
    });

    assert.equal(get(user, 'isValid'), true);

    run(function() {
      set(user, 'friends', emberArray());
    });

    assert.equal(get(user, 'isValid'), true);

    run(() => {
      friend1 = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            presence: true
          }
        }
      });
    });

    run(function() {
      user.friends.pushObject(friend1);
    });

    assert.equal(get(user, 'isValid'), false);

    run(function() {
      set(friend1, 'name', 'Stephanie');
    });

    assert.equal(get(user, 'isValid'), true);

    run(() => {
      friend2 = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            presence: true
          }
        }
      });

      user.friends.pushObject(friend2);
    });

    assert.equal(get(user, 'isValid'), false);

    run(function() {
      user.friends.removeObject(friend2);
    });

    assert.equal(get(user, 'isValid'), true);
  });

  test('revalidates arrays when they are replaced', function(assert) {
    let friend1, friend2;

    run(() => {
      user = this.owner.factoryFor('object:user').create({
        validations: {
          friends: true
        }
      });
    });

    assert.equal(get(user, 'isValid'), true);

    run(function() {
      set(user, 'friends', emberArray());
    });

    assert.equal(get(user, 'isValid'), true);

    run(() => {
      friend1 = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            presence: true
          }
        }
      });
    });

    run(function() {
      set(user, 'friends', emberArray([friend1]));
    });

    assert.equal(get(user, 'isValid'), false);

    run(function() {
      set(friend1, 'name', 'Stephanie');
    });

    assert.equal(get(user, 'isValid'), true);

    run(() => {
      friend2 = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            presence: true
          }
        }
      });

      set(user, 'friends', emberArray([friend1, friend2]));
    });

    assert.equal(get(user, 'isValid'), false);

    run(function() {
      user.friends.removeObject(friend2);
    });

    assert.equal(get(user, 'isValid'), true);
  });
});

module('validator class lookup order', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    User = EmberObject.extend(EmberValidations);
    this.owner.register('object:user', User);
  });

  test('should lookup in project namespace first', function(assert) {
    let dummyValidatorCalled = false;
    let nativeValidatorCalled = false;

    this.owner.register('ember-validations@validator:local/presence', Base.extend({
      init() {
        this._super(...arguments);
        nativeValidatorCalled = true;
      },
      call: K
    }));

    this.owner.register('validator:local/presence', Base.extend({
      init() {
        this._super(...arguments);
        dummyValidatorCalled = true;
      },
      call: K
    }));

    run(() => {
      user = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            presence: true
          }
        }
      });
    });

    assert.ok(!nativeValidatorCalled, 'should not have preferred ember-validation\'s presence validator');
    assert.ok(dummyValidatorCalled, 'should have preferred my applications presence validator');
  });

  test('will lookup both local and remote validators of similar name', function(assert) {
    let localValidatorCalled = false;
    let remoteValidatorCalled = false;

    this.owner.register('validator:local/uniqueness', Base.extend({
      init() {
        this._super(...arguments);
        localValidatorCalled = true;
      },
      call: K
    }));

    this.owner.register('validator:remote/uniqueness', Base.extend({
      init() {
        this._super(...arguments);
        remoteValidatorCalled = true;
      },
      call: K
    }));

    run(() => {
      user = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            uniqueness: true
          }
        }
      });
    });

    assert.ok(localValidatorCalled, 'should call local uniqueness validator');
    assert.ok(remoteValidatorCalled, 'should call remote uniqueness validator');
  });

  test('should prefer lookup in just "validators" before "native"', function(assert) {
    let dummyValidatorCalled = false;
    let nativeValidatorCalled = false;

    this.owner.register('ember-validations@validator:remote/uniqueness', Base.extend({
      init() {
        this._super(...arguments);
        nativeValidatorCalled = true;
      },
      call: K
    }));

    this.owner.register('validator:presence', Base.extend({
      init() {
        this._super(...arguments);
        dummyValidatorCalled = true;
      },
      call: K
    }));

    run(() => {
      user = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            presence: true
          }
        }
      });
    });

    assert.ok(!nativeValidatorCalled, 'should not have preferred ember-validation\'s presence validator');
    assert.ok(dummyValidatorCalled, 'should have preferred my applications presence validator');
  });

  test('should store validators in cache for faster lookup', function(assert) {
    let validatorResolvedCount = 0;
    let oldResolveRegistration = this.owner.resolveRegistration;

    this.owner.resolveRegistration = (fullName) => {
      validatorResolvedCount += 1;
      return oldResolveRegistration.call(this.owner, fullName);
    };

    let user2;

    run(() => {
      user = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            presence: true
          }
        }
      });

      validatorResolvedCount = 0;

      user2 = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            presence: true
          }
        }
      });
    });

    this.owner.resolveRegistration = oldResolveRegistration;

    assert.ok(!get(user, 'isValid'));
    assert.ok(!get(user2, 'isValid'));
    assert.equal(0, validatorResolvedCount);
  });
});

module('inline validations', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    User = EmberObject.extend(EmberValidations);
    this.owner.register('object:user', User);
  });

  test('mixed validation syntax', function(assert) {
    run(() => {
      user = this.owner.factoryFor('object:user').create({
        validations: {
          name: {
            inline: validator(function() {
              return 'it failed';
            })
          }
        }
      });
    });

    assert.deepEqual(['it failed'], get(user, 'errors.name'));
  });

  test('concise validation syntax', function(assert) {
    run(() => {
      user = this.owner.factoryFor('object:user').create({
        validations: {
          name: validator(function() {
            return 'it failed';
          })
        }
      });
    });

    assert.deepEqual(['it failed'], get(user, 'errors.name'));
  });
});
