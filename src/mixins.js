/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
var React = require('react'),
    type = require('./utils/type.js'),
    PropTypes = require('./utils/prop-types.js'),
    abstract = require('./utils/abstract.js');

/**
 * Root mixin
 */
var RootMixin = {

  // Component prop Type
  propTypes: {
    tree: PropTypes.baobab
  },

  // Context prop types
  childContextTypes: {
    tree: PropTypes.baobab
  },

  // Handling child context
  getChildContext: function() {
    return {
      tree: this.props.tree
    };
  }
};

/**
 * Branch mixin
 */
var BranchMixin = {

  // Context prop types
  contextTypes: {
    tree: PropTypes.baobab
  },

  // Building initial state
  getInitialState: function() {
    var o = abstract.init.call(this, this.context.tree, this.cursors);

    // Setting properties
    this.__facet = o.facet;
    this.cursors = o.cursors;

    if (this.__facet)
      return this.__facet.get();
    return {};
  },

  // On component mount
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

    // Releasing facet
    this.__facet.release();
    this.__facet = null;

    // Releasing cursors
    for (var k in this.cursors)
      this.cursors[k].release();
    this.cursors = null;
  }
};

// Exporting
exports.root = RootMixin;
exports.branch = BranchMixin;
