/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
'use strict';

var PropTypes = require('./utils/prop-types.js');

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
  getChildContext: function getChildContext() {
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
  getInitialState: function getInitialState() {

    // Setting properties
    this.__facet = this.context.tree.createFacet({
      cursors: this.cursors,
      facets: this.facets
    }, this);
    this.cursors = this.__facet.cursors;

    if (this.__facet) {
      return this.__facet.get();
    }return {};
  },

  // On component mount
  componentDidMount: function componentDidMount() {
    if (!this.__facet) {
      return;
    }var handler = (function () {
      this.setState(this.__facet.get());
    }).bind(this);

    this.__facet.on('update', handler);
  },

  // On component unmount
  componentWillUnmount: function componentWillUnmount() {
    if (!this.__facet) {
      return;
    } // Releasing facet
    this.__facet.release();
    this.__facet = null;
  }
};

// Exporting
exports.root = RootMixin;
exports.branch = BranchMixin;