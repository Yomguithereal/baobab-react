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
import PropTypes from '../src/utils/prop-types';

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

    it('both root & branch should throw if the target is not a valid React component.', function() {
      assert.throws(function() {
        root(new Baobab(), null);
      }, /component/);

      assert.throws(function() {
        branch({}, null);
      }, /component/);
    });
  });

  describe('context', function() {
    it('the tree should be propagated through context.', function() {
      const tree = new Baobab({name: 'John'}, {asynchronous: false});

      const Root = root(tree, BasicRoot);

      class Child extends Component {
        render() {
          return <span>Hello {this.context.tree.get('name')}</span>;
        }
      }

      Child.contextTypes = {
        tree: PropTypes.baobab
      };

      const wrapper = mount(<Root tree={tree}><Child /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John');
    });

    it('should fail if the tree is not passed through context.', function() {
      class Child extends Component {
        render() {
          return <span>Hello John</span>;
        }
      }

      const BranchedChild = branch({}, Child);

      assert.throws(function() {
        mount(<BranchedChild />);
      }, /Baobab/);
    });
  });

  describe('binding', function() {

  });

  describe('actions', function() {

  });
});
