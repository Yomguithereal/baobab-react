/**
 * Baobab-React Higher Order Component Test Suite
 * ===============================================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import Baobab from 'baobab';
import {Root, Bind} from '../../higher-order.js';

// Components
class DummyRoot extends Component {
  render() {
    return <div />;
  }
}

DummyRoot = Root(DummyRoot);

class BasicRoot extends Component {
  render() {
    var Component = this.props.component;

    return <Component arg={this.props.arg || null}/>;
  }
}

BasicRoot = Root(BasicRoot);

describe('Higher Order Component', function() {

  it('should fail if passing a wrong tree to the root mixin.', function() {

    assert.throws(function() {
      React.render(<DummyRoot tree={{hello: 'world'}} />, document.mount);
    }, /Baobab/);
  });

  // it('the tree should be propagated through context.', function() {
  //   var tree = new Baobab({name: 'John'}, {asynchronous: false});

  //   class Child extends Component {
  //     render() {
  //       console.log(this.context);
  //       return <span id="test">Hello {this.context.tree.get('name')}</span>;
  //     }
  //   }

  //   var EnhancedChild = Bind(Child);

  //   React.render(<BasicRoot tree={tree} component={EnhancedChild} />, document.mount);

  //   assert.selectorText('#test', 'Hello John');
  // });
});
