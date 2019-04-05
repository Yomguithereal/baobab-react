/**
 * Baobab-React Mixins Unit Tests
 * ===============================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import enzyme, {mount} from 'enzyme';
import Baobab from 'baobab';
import {root} from '../src/higher-order';
import {useBranch} from '../src/useBranch';
import Adapter from 'enzyme-adapter-react-16';
 
enzyme.configure({ adapter: new Adapter() });

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
describe('Hook', function() {

  describe('api', function() {
    it('hook should throw an error if the passed argument is not valid.', function() {
      const tree = new Baobab({name: 'John'}, {asynchronous: false});

      const Root = root(tree, BasicRoot);

      const Child = () => {
        const data = useBranch();
        return <span>Hello {data.name}</span>;
      }

      assert.throws(() => {
        mount(<Root><Child /></Root>);
      }, /baobab-react/);
    });
  });

  describe('context', function() {
    it('the tree should be propagated through context.', function() {
      const tree = new Baobab({path: ['name'], name: 'John'}, {asynchronous: false});

      const Root = root(tree, BasicRoot);

      const Child = () => {
        const data = useBranch(context => ({
            name: context.tree.get('path'),
        }));
        return <span>Hello {data.name}</span>;
      }

      const wrapper = mount(<Root tree={tree}><Child /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John');
    });

    it('should fail if the tree is not passed through context.', function() {
      const Child = () => {
        const data = useBranch({name: ['name']});
        return <span>Hello John</span>;
      }

      assert.throws(function() {
        mount(<Child />);
      }, /baobab-react/);
    });
  });

  describe('binding', function() {
    it('should be possible to bind several cursors to a component.', function() {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      const Child = () => {
        const data = useBranch({
          name: ['name'],
          surname: ['surname']
        });
        return (
          <span>
            Hello {data.name} {data.surname}
          </span>
        );
      }

      const Root = root(tree, BasicRoot);

      const wrapper = mount(<Root tree={tree}><Child /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John Talbot');
    });

    it('should be possible to register paths using typical Baobab polymorphisms.', function() {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      const Child = () => {
        const data = useBranch({
          name: 'name',
          surname: 'surname'
        });
        return (
          <span>
            Hello {data.name} {data.surname}
          </span>
        );
      }

      const Root = root(tree, BasicRoot);

      const wrapper = mount(<Root><Child /></Root>);

      assert.strictEqual(wrapper.text(), 'Hello John Talbot');
    });

    it('bound components should update along with the cursor.', function(done) {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      const Child = () => {
        const data = useBranch({
          name: 'name',
          surname: 'surname'
        });
        return (
          <span>
            Hello {data.name} {data.surname}
          </span>
        );
      }

      const Root = root(tree, BasicRoot);

      const wrapper = mount(<Root tree={tree}><Child /></Root>);

      tree.set('surname', 'the Third');

      setTimeout(() => {
        assert.strictEqual(wrapper.text(), 'Hello John the Third');
        done();
      }, 50);
    });

    it('should be possible to set cursors with a function.', function(done) {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      const Child = props => {
        const data = useBranch(() => {
          return {
            name: ['name'],
            surname: props.path
          };
        });
        return (
          <span>
            Hello {data.name} {data.surname}
          </span>
        );
      }

      const Root = root(tree, BasicRoot);

      const wrapper = mount(<Root><Child path={['surname']}/></Root>);

      tree.set('surname', 'the Third');

      setTimeout(() => {
        assert.strictEqual(wrapper.text(), 'Hello John the Third');
        done();
      }, 50);
    });
  });
});
