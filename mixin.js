/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
var React = require('react'),
    PropTypes = React.PropTypes,
    Baobab = require('baobab'),
    type = require('./type.js');

/**
 * Root mixin
 */
var RootMixin = {

  // Context prop types
  childContextTypes: {
    tree: function(props, propName, componentName) {
      if (!(props[propName] instanceof Baobab))
        return new Error('baobab-react.mixin.root: the given tree is not a Baobab instance.');
    }
  },

  // Handling child context
  getChildContext: function() {
    return {
      tree: this.props.tree
    };
  }
};

/**
 * Child mixin
 */
var ChildMixin = {

  // Context prop types
  contextTypes: {
    tree: PropTypes.object
  },

  // Building initial state
  getInitialState: function() {
    var map = this.cursors;

    // No map, we return an empty object
    if (!map)
      return {};

    if (!type.Map(map))
      throw Error('baobab-react.mixin: wrong "cursors" property (should be object or function).');
  }
};

// Exporting
ChildMixin.root = RootMixin;

module.exports = ChildMixin;
