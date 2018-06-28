import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Controller sanity test', function(hooks) {
  setupTest(hooks);

  test('does not blow up', function(assert) {
    let controller = this.owner.lookup('controller:foo');
    assert.ok(controller);
  });
});
