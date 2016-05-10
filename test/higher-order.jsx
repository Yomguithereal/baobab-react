/**
 * Baobab-React Mixins Unit Tests
 * ===============================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import {mount} from 'enzyme';
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

      const rootWithComponentTest = root(new Baobab(), DummyRoot),
            branchWithComponentTest = branch({}, DummyRoot);

      assert(typeof rootWithComponentTest === 'function');
      assert(typeof branchWithComponentTest === 'function');

      const rootThenComponentTest = root(new Baobab())(DummyRoot),
            branchThenComponentTest = branch({})(DummyRoot);

      assert(typeof rootThenComponentTest === 'function');
      assert(typeof branchThenComponentTest === 'function');
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
    it('should be possible to bind several cursors to a component.', function() {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      class Child extends Component {
        render() {
          return (
            <span>
              Hello {this.props.name} {this.props.surname}
            </span>
          );
        }
      }

      const Root = root(tree, BasicRoot);

      const BranchedChild = branch({
        name: ['name'],
        surname: ['surname']
      }, Child);

      const wrapper = mount(<Root tree={tree}><BranchedChild /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John Talbot');
    });

    it('should be possible to register paths using typical Baobab polymorphisms.', function() {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      class Child extends Component {
        render() {
          return (
            <span>
              Hello {this.props.name} {this.props.surname}
            </span>
          );
        }
      }

      const Root = root(tree, BasicRoot);

      const BranchedChild = branch({
        name: 'name',
        surname: 'surname'
      }, Child);

      const wrapper = mount(<Root tree={tree}><BranchedChild /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John Talbot');
    });

    it('bound components should update along with the cursor.', function(done) {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      class Child extends Component {
        render() {
          return (
            <span>
              Hello {this.props.name} {this.props.surname}
            </span>
          );
        }
      }

      const Root = root(tree, BasicRoot);

      const BranchedChild = branch({
        name: 'name',
        surname: 'surname'
      }, Child);

      const wrapper = mount(<Root tree={tree}><BranchedChild /></Root>);

      tree.set('surname', 'the Third');

      setTimeout(() => {
        assert.strictEqual(wrapper.text(), 'Hello John the Third');
        done();
      }, 50);
    });

    it('should be possible to set cursors with a function.', function(done) {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      class Child extends Component {
        render() {
          return (
            <span>
              Hello {this.props.name} {this.props.surname}
            </span>
          );
        }
      }

      const Root = root(tree, BasicRoot);

      const BranchedChild = branch(props => {
        return {
          name: ['name'],
          surname: props.path
        };
      }, Child);

      const wrapper = mount(<Root tree={tree}><BranchedChild path={['surname']}/></Root>);

      tree.set('surname', 'the Third');

      setTimeout(() => {
        assert.strictEqual(wrapper.text(), 'Hello John the Third');
        done();
      }, 50);
    });

    it('wrapper component should return wrapping component instance by getDecoratedComponentInstance.', function() {
      const tree = new Baobab({counter: 0}, {asynchronous: false});

      class Counter extends Component {
        render() {
          return (
            <span>
              Counter: {this.props.counter}
            </span>
          );
        }
      }

      const Root = root(tree, BasicRoot);

      const BranchedCounter = branch({counter: 'counter'}, Counter);

      const wrapper = mount(<Root tree={tree}><BranchedCounter /></Root>);
      const decoratedComponentInstance = wrapper.find(BranchedCounter).get(0).getDecoratedComponentInstance();

      assert(decoratedComponentInstance instanceof Counter);
    });
  });

  describe('actions', function() {
    it('should be possible to dispatch actions.', function() {
      const tree = new Baobab({counter: 0}, {asynchronous: false});

      const inc = function(state, by = 1) {
        state.apply('counter', nb => nb + by);
      };

      class Counter extends Component {
        render() {
          const dispatch = this.props.dispatch;

          return (
            <span onClick={() => dispatch(inc)}
                  onChange={() => dispatch(inc, 2)}>
              Counter: {this.props.counter}
            </span>
          );
        }
      }

      const Root = root(tree, BasicRoot);

      const BranchedCounter = branch({counter: 'counter'}, Counter);

      const wrapper = mount(<Root tree={tree}><BranchedCounter /></Root>);

      assert.strictEqual(wrapper.text(), 'Counter: 0');
      wrapper.find('span').simulate('click');
      assert.strictEqual(wrapper.text(), 'Counter: 1');
      wrapper.find('span').simulate('change');
      assert.strictEqual(wrapper.text(), 'Counter: 3');
    });
  });
});
