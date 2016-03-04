/**
 * Baobab-React Mixins Unit Tests
 * ===============================
 *
 */
import assert from 'assert';
import React from 'react';
import {mount, shallow} from 'enzyme';
import * as mixins from '../src/mixins';

/**
 * Components.
 */
const DummyRoot = React.createClass({
  mixins: [mixins.root],
  render() {
    return <div />;
  }
});

const Root = React.createClass({
  mixins: [mixins.root],
  render() {
    return <div>{this.props.children}</div>;
  }
});

/**
 * Test suite.
 */
describe('Mixins', function() {

    it('should fail if passing a wrong tree to the root mixin.', function() {

      assert.throws(function() {
        mount(<DummyRoot tree={{hello: 'world'}} />);
      }, /Baobab/);
    });
});
