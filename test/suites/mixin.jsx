/**
 * Baobab-React Mixin Test Suite
 * ==============================
 *
 */
var assert = require('assert'),
    React = require('react'),
    Baobab = require('baobab'),
    mixin = require('../../mixin.js');

// Components
var DummyRoot = React.createClass({
  mixins: [mixin.root],
  render: function() {
    return <div />;
  }
});

var Root = React.createClass({
  mixins: [mixin.root],
  render: function() {
    var Component = this.props.component;

    return <Component />;
  }
});

describe('Mixin', function() {

  it('should fail if passing a wrong tree to the root mixin.', function() {

    assert.throws(function() {
      React.render(<DummyRoot tree={{hello: 'world'}} />, document.mount);
    }, /Baobab/);
  });

  it('the tree should be propagated through context.', function() {
    var tree = new Baobab({name: 'John'}, {asynchronous: false});

    var Child = React.createClass({
      mixins: [mixin],
      render: function() {
        assert(typeof this.context.tree === 'object');

        return <span id="test">Hello {this.context.tree.get('name')}</span>;
      }
    });

    React.render(<Root tree={tree} component={Child} />, document.mount);

    assert.selectorText('#test', 'Hello John');
  });

  it('the should be propagated to nested components.', function() {
    var tree = new Baobab({name: 'John'}, {asynchronous: false});

    var UpperChild = React.createClass({
      render: function() {
        return <Child />;
      }
    });

    var Child = React.createClass({
      mixins: [mixin],
      render: function() {
        assert(typeof this.context.tree === 'object');

        return <span id="test">Hello {this.context.tree.get('name')}</span>;
      }
    });

    React.render(<Root tree={tree} component={UpperChild} />, document.mount);

    assert.selectorText('#test', 'Hello John');
  });
});
