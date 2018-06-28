import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit - Foo Controller Test', function(hooks) {
  setupTest(hooks);

  testValidPropertyValues('bar', ['Winston', '12345']);

  testInvalidPropertyValues('bar', ['', null, undefined, 'abc']);

  testValidPropertyValues('baz', ['Winston', '12345'], function(subject) {
    subject.set('isBaz', true);
  });

  testInvalidPropertyValues('baz', ['', null, undefined], function(subject) {
    subject.set('isBaz', true);
  });

  testValidPropertyValues('baz', ['Winston', '12345', null, undefined, ''], function(subject) {
    subject.set('isBaz', false);
  });
});

module('Unit - Ensure validate properties test helpers fail when invalid', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function(assert) {
    // use inverse of deepEqual to ensure the test helpers fail when invalid
    assert.deepEqual = assert.notDeepEqual;
  });

  testValidPropertyValues('bar', [undefined, 'Winston', '12345']);
  testValidPropertyValues('bar', ['Winston', undefined, '12345']);
  testValidPropertyValues('bar', ['Winston', '12345', undefined]);

  testInvalidPropertyValues('bar', ['', null, undefined, 'abc', 'Winston']);
  testInvalidPropertyValues('bar', ['Winston', null, undefined, 'abc']);
  testInvalidPropertyValues('bar', [null, 'Winston', undefined, 'abc']);

  testInvalidPropertyValues('baz', ['Winston', '12345'], function(subject) {
    subject.set('isBaz', true);
  });

  testValidPropertyValues('baz', [undefined, 'Winston', '12345'], function(subject) {
    subject.set('isBaz', true);
  });
  testValidPropertyValues('baz', ['Winston', '12345', undefined], function(subject) {
    subject.set('isBaz', true);
  });
  testValidPropertyValues('baz', ['Winston', undefined, '12345'], function(subject) {
    subject.set('isBaz', true);
  });

  testInvalidPropertyValues('baz', ['', null, undefined, 'Winston'], function(subject) {
    subject.set('isBaz', true);
  });
  testInvalidPropertyValues('baz', ['Winston', null, undefined], function(subject) {
    subject.set('isBaz', true);
  });
  testInvalidPropertyValues('baz', ['', null, 'Winston', undefined], function(subject) {
    subject.set('isBaz', true);
  });

  testInvalidPropertyValues('baz', ['Winston', '12345', null, undefined, ''], function(subject) {
    subject.set('isBaz', false);
  });
});
