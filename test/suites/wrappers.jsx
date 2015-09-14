/**
 * Baobab-React Higher Order Component Test Suite
 * ===============================================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import {render} from 'react-dom';
import Baobab, {monkey} from 'baobab';
import {Root, Branch} from '../../src/wrappers.js';
import PropTypes from '../../src/utils/prop-types.js';

describe('Wrapper', function() {

  it('should fail if passing a wrong tree to the root wrapper', function() {

    assert.throws(function() {
      const group = (
        <Root tree={{hello: 'world'}}>
          <div />
        </Root>
      );

      render(group, document.mount);
    }, /Baobab/);
  });

  it('the tree should be propagated through context.', function() {
    const tree = new Baobab({name: 'John'}, {asynchronous: false});

    class Child extends Component {
      static contextTypes = {
        tree: PropTypes.baobab
      }

      render() {
        return <span id="test">Hello {this.context.tree.get('name')}</span>;
      }
    }

    const group = (
      <Root tree={tree}>
        <Child />
      </Root>
    );

    render(group, document.mount);

    assert.selectorText('#test', 'Hello John');
  });

  it('the should be propagated to nested components.', function() {
    const tree = new Baobab({name: 'John'}, {asynchronous: false});

    class Child extends Component {
      static contextTypes = {
        tree: PropTypes.baobab
      }

      render() {
        return <span id="test">Hello {this.context.tree.get('name')}</span>;
      }
    }

    class UpperChild extends Component {
      render() {
        return <Child />;
      }
    }

    const group = (
      <Root tree={tree}>
        <UpperChild />
      </Root>
    );

    render(group, document.mount);

    assert.selectorText('#test', 'Hello John');
  });

  it('should fail if the tree is not passed through context.', function() {
    class Child extends Component {
      static contextTypes = {
        tree: PropTypes.baobab
      }

      render() {
        return <span id="test">Hello {this.context.tree.get('name')}</span>;
      }
    }

    assert.throws(function() {
      render(<Child />, document.mount);
    }, /Baobab/);
  });

  it('should be possible to bind several cursors to a component.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    const group = (
      <Root tree={tree}>
        <Branch cursors={{
          name: ['name'],
          surname: ['surname']
        }}>
          <Child />
        </Branch>
      </Root>
    );

    render(group, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('bound components should update along with the cursor.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    const group = (
      <Root tree={tree}>
        <Branch cursors={{
          name: ['name'],
          surname: ['surname']
        }}>
          <Child />
        </Branch>
      </Root>
    );

    render(group, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');

    tree.set('surname', 'the Third');

    assert.selectorText('#test', 'Hello John the Third');
  });

  it('should be possible to pass cursors directly.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
        cursor = tree.select('name');

    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    const group = (
      <Root tree={tree}>
        <Branch cursors={{
          name: cursor,
          surname: ['surname']
        }}>
          <Child />
        </Branch>
      </Root>
    );

    render(group, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('should be possible to use monkeys.', function() {
    const tree = new Baobab(
      {
        name: 'John',
        surname: 'Talbot',
        $name: monkey({
          cursors: {
            value: ['name']
          },
          get: function(data) {
            return data.value;
          }
        })
      },
      {asynchronous: false}
    );

    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    const group = (
      <Root tree={tree}>
        <Branch
          cursors={{
            surname: ['surname'],
            name: ['$name']
          }}>
          <Child />
        </Branch>
      </Root>
    );

    render(group, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('should be possible to pass props directly to the nested component.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname} {this.props.title}
          </span>
        );
      }
    }

    const firstGroup = (
      <Root tree={tree}>
        <Branch cursors={{
          name: ['name'],
          surname: ['surname']
        }}>
          <Child title="the third" />
        </Branch>
      </Root>
    );

    render(firstGroup, document.mount);

    assert.selectorText('#test', 'Hello John Talbot the third');

    const secondGroup = (
      <Root tree={tree}>
        <Branch cursors={{
          name: ['name'],
          surname: ['surname']
        }} title="the second">
          <Child />
        </Branch>
      </Root>
    );

    render(secondGroup, document.mount);

    assert.selectorText('#test', 'Hello John Talbot the second');
  });

  it('should be possible to propagate data to several children.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

    class Child extends Component {
      render() {
        return (
          <span id={this.props.id}>
            Hello {this.props.name} {this.props.surname} {this.props.title}
          </span>
        );
      }
    }

    const group = (
      <Root tree={tree}>
        <Branch cursors={{
          name: ['name'],
          surname: ['surname']
        }}>
          <Child title="the first" id="one" />
          <Child title="the second" id="two" />
        </Branch>
      </Root>
    );

    render(group, document.mount);

    assert.selectorText('#one', 'Hello John Talbot the first');
    assert.selectorText('#two', 'Hello John Talbot the second');
  });
});
