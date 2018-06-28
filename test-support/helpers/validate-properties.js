import { run } from '@ember/runloop';
import { test, dump } from 'qunit';

function validateValues(object, propertyName, values, isTestForValid) {
  let promise = null;
  let validatedValues = [];

  values.forEach(function(value) {
    function handleValidation() {
      let hasErrors = object.get(`errors.${propertyName}.firstObject`);
      if ((hasErrors && !isTestForValid) || (!hasErrors && isTestForValid)) {
        validatedValues.push(value);
      }
    }

    run(object, 'set', propertyName, value);

    let objectPromise = null;
    run(function() {
      objectPromise = object.validate().then(handleValidation, handleValidation);
    });

    // Since we are setting the values in a different run loop as we are validating them,
    // we need to chain the promises so that they run sequentially. The wrong value will
    // be validated if the promises execute concurrently
    promise = promise ? promise.then(objectPromise) : objectPromise;
  });

  return promise.then(function() {
    return validatedValues;
  });
}

function testPropertyValues(propertyName, values, isTestForValid, context) {
  let validOrInvalid = (isTestForValid ? 'Valid' : 'Invalid');
  let testName = `${validOrInvalid} ${propertyName}`;

  test(testName, function(assert) {
    let object = this.subject();

    if (context && typeof context === 'function') {
      context(object);
    }

    // Use QUnit.dump.parse so null and undefined can be printed as literal 'null' and
    // 'undefined' strings in the assert message.
    let valuesString = dump.parse(values).replace(/\n(\s+)?/g, '').replace(/,/g, ', ');
    let assertMessage = `Expected ${propertyName} to have ${validOrInvalid.toLowerCase()} values: ${valuesString}`;

    return validateValues(object, propertyName, values, isTestForValid)
      .then(function(validatedValues) {
        assert.deepEqual(validatedValues, values, assertMessage);
      });
  });
}

export function testValidPropertyValues(propertyName, values, context) {
  testPropertyValues(propertyName, values, true, context);
}

export function testInvalidPropertyValues(propertyName, values, context) {
  testPropertyValues(propertyName, values, false, context);
}
