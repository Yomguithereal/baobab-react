/**
 * Baobab-React Mixins Unit Tests
 * ===============================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import {mount, shallow} from 'enzyme';
import Baobab from 'baobab';
import {root, branch} from '../src/higher-order';

/**
 * Components.
 */
class DummyRoot extends Component {
  render() {
    return <div />;
  }
}

class BasicRoot extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

/**
 * Test suite.
 */
describe('Higher Order', function() {

  describe('api', function() {
    it('both root & branch should be curried.', function() {
      const rootTest = root(new Baobab()),
            branchTest = branch({});

      assert(typeof rootTest === 'function');
      assert(typeof branchTest === 'function');
    });

    it('root should throw an error if the passed argument is not a tree.', function() {
      assert.throws(function() {
        root(null, DummyRoot);
      }, /Baobab/);
    });

    it('branch should throw an error if the passed argument is not valid.', function() {
      assert.throws(function() {
        branch(null, DummyRoot);
      }, /invalid/);
    });
  });

  describe('context', function() {

  });

  describe('binding', function() {

  });

  describe('actions', function() {

  });
});
