/**
 * Baobab-React Mixins Unit Tests
 * ===============================
 *
 */
import assert from 'assert';
import React from 'react';
import {mount, shallow} from 'enzyme';
import Baobab from 'baobab';
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

  describe('context', function() {
    it('should fail if passing a wrong tree to the root mixin.', function() {

      assert.throws(function() {
        mount(<DummyRoot tree={{hello: 'world'}} />);
      }, /Baobab/);
    });

    it('the tree should be propagated through context.', function() {
      const tree = new Baobab({name: 'John'}, {asynchronous: false});

      const Child = React.createClass({
        mixins: [mixins.branch],
        render() {
          return <span>Hello {this.context.tree.get('name')}</span>;
        }
      });

      const wrapper = mount(<Root tree={tree}><Child /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John');
    });

    it('should fail if the tree is not passed through context.', function() {
      const Child = React.createClass({
        mixins: [mixins.branch],
        render() {
          return <span>Hello John</span>;
        }
      });

      assert.throws(function() {
        mount(<Child />);
      }, /Baobab/);
    });
  });

  describe('binding', function() {
    it('should be possible to bind several cursors to a component.', function() {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      const Child = React.createClass({
        mixins: [mixins.branch],
        cursors: {
          name: ['name'],
          surname: ['surname']
        },
        render: function() {

          return (
            <span>
              Hello {this.state.name} {this.state.surname}
            </span>
          );
        }
      });

      const wrapper = mount(<Root tree={tree}><Child /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John Talbot');
    });

    it('should be possible to register paths using typical Baobab polymorphisms.', function() {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      const Child = React.createClass({
        mixins: [mixins.branch],
        cursors: {
          name: 'name',
          surname: 'surname'
        },
        render: function() {

          return (
            <span>
              Hello {this.state.name} {this.state.surname}
            </span>
          );
        }
      });

      const wrapper = mount(<Root tree={tree}><Child /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John Talbot');
    });

    it('bound components should update along with the cursor.', function(done) {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      const Child = React.createClass({
        mixins: [mixins.branch],
        cursors: {
          name: ['name'],
          surname: ['surname']
        },
        render: function() {

          return (
            <span>
              Hello {this.state.name} {this.state.surname}
            </span>
          );
        }
      });

      const wrapper = mount(<Root tree={tree}><Child /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John Talbot');

      tree.set('surname', 'the Third');

      setTimeout(() => {
        assert.strictEqual(wrapper.text(), 'Hello John the Third');
        done();
      }, 50);
    });

    it('should be possible to set cursors with a function.', function(done) {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      const Child = React.createClass({
        mixins: [mixins.branch],
        cursors(props) {
          return {
            name: ['name'],
            surname: props.path
          };
        },
        render: function() {

          return (
            <span>
              Hello {this.state.name} {this.state.surname}
            </span>
          );
        }
      });

      const wrapper = mount(<Root tree={tree}><Child path={['surname']} /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John Talbot');

      tree.set('surname', 'the Third');

      setTimeout(() => {
        assert.strictEqual(wrapper.text(), 'Hello John the Third');
        done();
      }, 50);
    });
  });
});
