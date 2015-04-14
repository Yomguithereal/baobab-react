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
var Root = React.createClass({
  mixins: [mixin.root],
  render: function() {
    var Component = this.props.component;

    return <Component />;
  }
});

describe('Mixin', function() {

  it('the tree should be propagated through context.', function() {
    var tree = new Baobab({name: 'John'}, {asynchronous: false});

    var Child = React.createClass({
      mixins: [mixin],
      render: function() {
        assert(typeof this.context.tree === 'object');

        return <span id="test">Hello {this.context.tree.get('name')}</span>;
      }
    });

    React.render(<Root tree={tree} component={Child} />, mount);

    assert.selectorText('#test', 'Hello John');
  });
});
