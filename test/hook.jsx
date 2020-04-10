/**
 * Baobab-React Mixins Unit Tests
 * ===============================
 *
 */
import assert from 'assert';
import React from 'react';
import enzyme, {mount} from 'enzyme';
import Baobab from 'baobab';
import {useRoot, useBranch} from '../src/hooks';
import Adapter from 'enzyme-adapter-react-16';
 
enzyme.configure({adapter: new Adapter()});

/**
 * Components.
 */
const BasicRoot = function({tree, children}) {
  const Root = useRoot(tree);
  return (
    <Root>
      <div>
        {children}
      </div>
    </Root>
  );
}

/**
 * Test suite.
 */
describe('Hook', function() {
  describe('api', function() {
    it('root should throw an error if the passed argument is not a tree.', function() {
      assert.throws(function() {
        mount(<BasicRoot />);
      }, /baobab-react/);
    });
    
    it('branch should throw an error if the passed argument is not valid.', function() {
      const tree = new Baobab({name: 'John'}, {asynchronous: false});

      const Child = () => {
        const data = useBranch();
        return <span>Hello {data.name}</span>;
      }

      assert.throws(() => {
        mount(<BasicRoot tree={tree}><Child /></BasicRoot>);
      }, /baobab-react/);
    });
  });

  describe('context', function() {
    it('the tree should be propagated through context.', function() {
      const tree = new Baobab({path: ['name'], name: 'John'}, {asynchronous: false});

      const Child = () => {
        const data = useBranch(context => ({
            name: context.tree.get('path'),
        }));
        return <span>Hello {data.name}</span>;
      }

      const wrapper = mount(<BasicRoot tree={tree}><Child /></BasicRoot>);

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

      const wrapper = mount(<BasicRoot tree={tree}><Child /></BasicRoot>);

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

      const wrapper = mount(<BasicRoot tree={tree}><Child /></BasicRoot>);

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

      const wrapper = mount(<BasicRoot tree={tree}><Child /></BasicRoot>);

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
        }, [props.path]);
        return (
          <span>
            Hello {data.name} {data.surname}
          </span>
        );
      }

      const wrapper = mount(<BasicRoot tree={tree}><Child path={['surname']}/></BasicRoot>);

      tree.set('surname', 'the Third');

      setTimeout(() => {
        assert.strictEqual(wrapper.text(), 'Hello John the Third');
        done();
      }, 50);
    });
  });

  describe('actions', function() {
    it('should be possible to dispatch actions.', function() {
      const tree = new Baobab({counter: 0}, {asynchronous: false});

      const inc = function(state, by = 1) {
        state.apply('counter', nb => nb + by);
      };

      const Counter = function() {
        const {counter, dispatch} = useBranch({counter: 'counter'});

        return (
          <span onClick={() => dispatch(inc)}
                onChange={() => dispatch(inc, 2)}>
            Counter: {counter}
          </span>
        );
      };

      const wrapper = mount(<BasicRoot tree={tree}><Counter /></BasicRoot>);

      assert.strictEqual(wrapper.text(), 'Counter: 0');
      wrapper.find('span').simulate('click');
      assert.strictEqual(wrapper.text(), 'Counter: 1');
      wrapper.find('span').simulate('change');
      assert.strictEqual(wrapper.text(), 'Counter: 3');
    });
  });
});
