/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
var React = require('react'),
    PropTypes = React.PropTypes;

/**
 * Root mixin
 */
var RootMixin = {

  // Context prop types
  childContextTypes: {
    tree: PropTypes.object
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
  }
};

// Exporting
ChildMixin.root = RootMixin;

module.exports = ChildMixin;
