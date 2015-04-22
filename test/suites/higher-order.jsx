/**
 * Baobab-React Higher Order Component Test Suite
 * ===============================================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import Baobab from 'baobab';
import {root, branch} from '../../src/higher-order.js';
import {root as rootDecorator, branch as branchDecorator} from '../../src/decorators.js';
import PropTypes from '../../src/utils/prop-types.js';

// Components
class DummyRoot extends Component {
  render() {
    return <div />;
  }
}

class BasicRoot extends Component {
  render() {
    var Component = this.props.component;

    return <Component arg={this.props.arg || null} />;
  }
}

describe('Higher Order Component', function() {

  it('should fail if passing a wrong tree to the root component.', function() {
    assert.throws(function() {
      var RootComponent = root(DummyRoot, {hello: 'world'});
    }, /Baobab/);
  });

  it('the tree should be propagated through context.', function() {
    var tree = new Baobab({name: 'John'}, {asynchronous: false}),
        RootComponent = root(BasicRoot, tree);

    class Child extends Component {
      static contextTypes = {
        tree: PropTypes.baobab
      };

      render() {
        var name = this.context.tree.get('name');

        return <span id="test">Hello {name}</span>;
      }
    }

    React.render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John');
  });

  it('should fail if the tree is not passed through context.', function() {

    @branchDecorator
    class Child extends Component {
      render() {
        return <span id="test">Hello John</span>;
      }
    }

    assert.throws(function() {
      React.render(<Child />, document.mount);
    }, /Baobab/);
  });

  it('should be possible to bind several cursors to a component.', function() {
    var tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
        RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: {
        name: ['name'],
        surname: ['surname']
      }
    })
    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    React.render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('should work with a decorated root.', function() {
    var tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

    @rootDecorator(tree)
    class DecoratedRoot extends Component {
      render() {
        var Component = this.props.component;

        return <Component arg={this.props.arg || null} />;
      }
    }

    @branchDecorator({
      cursors: {
        name: ['name'],
        surname: ['surname']
      }
    })
    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    React.render(<DecoratedRoot component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('bound components should update along with the cursor.', function() {
    var tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
        RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: {
        name: ['name'],
        surname: ['surname']
      }
    })
    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    React.render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');

    tree.set('surname', 'the Third');

    assert.selectorText('#test', 'Hello John the Third');
  });

  it('should be possible to set cursors with a function.', function() {
    var tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
        RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: function() {
        return {
          name: this.props.arg,
          surname: ['surname']
        };
      }
    })
    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    React.render(<RootComponent component={Child} arg={['name']} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('should be possible to pass cursors directly.', function() {
    var tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
        cursor = tree.select('name'),
        RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: {
        name: cursor,
        surname: ['surname']
      }
    })
    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    React.render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('should be possible to use facets.', function() {
    var tree = new Baobab(
      {
        name: 'John',
        surname: 'Talbot'
      },
      {
        asynchronous: false,
        facets: {
          name: {
            cursors: {
              value: ['name']
            },
            get: function(data) {
              return data.value;
            }
          }
        }
      }
    );

    var RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: {
        surname: ['surname']
      },
      facets: {
        name: 'name'
      }
    })
    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    React.render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('cursors should take precedence over facets.', function() {
    var tree = new Baobab(
      {
        name: 'Jack',
        surname: 'Talbot'
      },
      {
        asynchronous: false,
        facets: {
          name: {
            get: function(data) {
              return 'John'
            }
          }
        }
      }
    );

    var RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: {
        name: ['name']
      },
      facets: {
        name: 'name'
      }
    })
    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name}
          </span>
        );
      }
    }

    React.render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello Jack');
  });

  it('should be possible to access the cursors within the component.', function() {
    var tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
        RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: {
        name: ['name'],
        surname: ['surname']
      }
    })
    class Child extends Component {
      static contextTypes = {
        cursors: PropTypes.cursors
      }

      render() {
        var data = {
          name: this.context.cursors.name.get(),
          surname: this.context.cursors.surname.get()
        };

        return (
          <span id="test">
            Hello {data.name} {data.surname}
          </span>
        );
      }
    }

    React.render(<RootComponent component={Child} arg={['name']} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });
});
