import { module } from 'qunit';
import { resolve } from 'rsvp';
import destroyApp from '../helpers/destroy-app';
import { setupApplicationTest } from 'ember-qunit';

export default function(name, options = {}) {
  module(name, function(hooks) {
    setupApplicationTest();
    hooks.beforeEach(function() {
      if (options.beforeEach) {
        return options.beforeEach.call(this, ...arguments);
      }
    });

    hooks.afterEach(function() {
      let afterEach = options.afterEach && options.afterEach(...arguments);
      return resolve(afterEach).then(() => destroyApp(this.application));
    });
  });
}
