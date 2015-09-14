/**
 * Baobab-React Higher Order Component Test Suite
 * ===============================================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import Baobab, {monkey} from 'baobab';
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
    const Component = this.props.component;

    return <Component arg={this.props.arg || null} />;
  }
}

describe('Higher Order Component', function() {

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(document.mount);
  });

  it('should fail if passing a wrong tree to the root component.', function() {
    assert.throws(function() {
      const RootComponent = root(DummyRoot, {hello: 'world'});
    }, /Baobab/);
  });

  it('the tree should be propagated through context.', function() {
    const tree = new Baobab({name: 'John'}, {asynchronous: false}),
        RootComponent = root(BasicRoot, tree);

    class Child extends Component {
      static contextTypes = {
        tree: PropTypes.baobab
      };

      render() {
        const name = this.context.tree.get('name');

        return <span id="test">Hello {name}</span>;
      }
    }

    render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John');
  });

  it('should fail if the tree is not passed through context.', function() {

    @branchDecorator()
    class Child extends Component {
      render() {
        return <span id="test">Hello John</span>;
      }
    }

    assert.throws(function() {
      render(<Child />, document.mount);
    }, /Baobab/);
  });

  it('should be possible to bind several cursors to a component.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
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

    render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('should work with a decorated root.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

    @rootDecorator(tree)
    class DecoratedRoot extends Component {
      render() {
        const Component = this.props.component;

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

    render(<DecoratedRoot component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('bound components should update along with the cursor.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
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

    render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');

    tree.set('surname', 'the Third');

    assert.selectorText('#test', 'Hello John the Third');
  });

  it('should be possible to set cursors with a function.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
          RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: function(props, context) {
        return {
          name: props.arg,
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

    render(<RootComponent component={Child} arg={['name']} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('should be possible to pass cursors directly.', function() {
    const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
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

    render(<RootComponent component={Child} />, document.mount);

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

    const RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: {
        surname: ['surname'],
        name: ['$name']
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

    render(<RootComponent component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John Talbot');
  });

  it('should be possible to update the component\'s internal watcher.', function(done) {
    const tree = new Baobab({value1: 'John', value2: 'Jack'}, {asynchronous: false}),
          RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: function(props) {
        return {
          value: props.path
        };
      }
    })
    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.value}
          </span>
        );
      }
    }

    class Wrapper extends Component {
      constructor(props) {
        super(props);

        const self = this;

        setTimeout(function() {
          self.setState({path: ['value2']});
        }, 50);

        this.state = {
          path: ['value1']
        };
      }
      render() {
        return <Child path={this.state.path} />;
      }
    }

    render(<RootComponent tree={tree} component={Wrapper} />, document.mount);

    assert.selectorText('#test', 'Hello John');

    setTimeout(function() {
      assert.selectorText('#test', 'Hello Jack');
      done();
    }, 100);
  });

  it('should be possible to access the component\'s cursors through context.', function(done) {
    const tree = new Baobab({value1: 'John', value2: 'Jack'}, {asynchronous: false}),
          RootComponent = root(BasicRoot, tree);

    @branchDecorator({
      cursors: function(props) {
        return {
          value: props.path
        };
      }
    })
    class Child extends Component {
      static contextTypes = {
        cursors: PropTypes.cursors
      };

      render() {
        return (
          <span id="test">
            Hello {this.context.cursors.value.get()}
          </span>
        );
      }
    }

    class Wrapper extends Component {
      constructor(props) {
        super(props);

        const self = this;

        setTimeout(function() {
          self.setState({path: ['value2']});
        }, 50);

        this.state = {
          path: ['value1']
        };
      }
      render() {
        return <Child path={this.state.path} />;
      }
    }

    render(<RootComponent tree={tree} component={Wrapper} />, document.mount);

    assert.selectorText('#test', 'Hello John');

    setTimeout(function() {
      assert.selectorText('#test', 'Hello Jack');
      done();
    }, 100);
  });
});
