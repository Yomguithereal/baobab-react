/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
var React = require('react'),
    PropTypes = React.PropTypes,
    type = require('./type.js');

/**
 * Root mixin
 */
var RootMixin = {

  // Component Prop Type
  propTypes: {
    tree: type.BaobabPropType
  },

  // Context prop types
  childContextTypes: {
    tree: type.BaobabPropType
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
    tree: type.BaobabPropType
  },

  // Building initial state
  getInitialState: function() {
    var map = this.cursors;

    // No map, we return an empty object
    if (!map)
      return {};

    if (!type.Map(map))
      throw Error('baobab-react.mixin: wrong "cursors" property (should be object or function).');

    // Creating facet
    this.__facet = this.context.tree.createFacet({cursors: map});

    return this.__facet.get();
  },

  // When component is mounted
  componentDidMount: function() {
    if (!this.__facet)
      return;

    var handler = (function() {
      this.setState(this.__facet.get());
    }).bind(this);

    this.__facet.on('update', handler);
  },

  // On component unmount
  componentWillUnmount: function() {
    if (!this.__facet)
      return;

    this.__facet.release();
    this.__facet = null;
  }
};

// Exporting
ChildMixin.root = RootMixin;

module.exports = ChildMixin;
