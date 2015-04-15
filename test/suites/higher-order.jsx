/**
 * Baobab-React Higher Order Component Test Suite
 * ===============================================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import Baobab from 'baobab';
import {Root, Branch} from '../../higher-order.js';

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

  it('should fail if passing a wrong tree to the root mixin.', function() {
    var RootComponent = Root(DummyRoot, {hello: 'world'});

    assert.throws(function() {
      React.render(<RootComponent />, document.mount);
    }, /Baobab/);
  });

  it('should be possible to bind several cursors to a component.', function() {
    var tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false}),
        RootComponent = Root(BasicRoot, tree);

    class Child extends Component {
      render() {
        return (
          <span id="test">
            Hello {this.props.name} {this.props.surname}
          </span>
        );
      }
    }

    var ComposedComponent = Branch(Child, {
      cursors: {
        name: ['name'],
        surname: ['surname']
      }
    });

    React.render(<RootComponent component={ComposedComponent} />, document.mount);

    // console.log(document.querySelector('#test').textContent);
  });
});
