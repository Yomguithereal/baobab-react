/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
var PropTypes = require('./utils/prop-types.js');
var mixin = require('./utils/mixin.js');

/**
 * Hot flag
 */
var isHot = false;

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
    return mixin.createFacetAndReturnState.call(this, {
      cursors: this.cursors,
      facets: this.facets
    });
  },

  componentWillUpdate: function() {
    if (isHot) {
      mixin.resetCursorsAndFacets.call(this, {
        cursors: this.cursors,
        facets: this.facets
      });
    }
  },

  // On component mount
  componentWillMount: function() {
    mixin.registerListener.call(this);
  },

  // On component unmount
  componentWillUnmount: function() {
    mixin.releaseFacet.call(this);
  }
};

// Exporting
exports.root = RootMixin;
exports.branch = BranchMixin;
exports.makeHot = function () {
  isHot = true;
};
