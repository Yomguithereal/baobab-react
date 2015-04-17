/**
 * Baobab-React Higher Order Component Test Suite
 * ===============================================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import Baobab from 'baobab';
import {root, branch} from '../../src/higher-order.js';
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

  it('should fail if passing a wrong tree to the root mixin.', function() {
    var RootComponent = root(DummyRoot, {hello: 'world'});

    assert.throws(function() {
      React.render(<RootComponent />, document.mount);
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

    React.render(<RootComponent tree={tree} component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John');
  });
});
