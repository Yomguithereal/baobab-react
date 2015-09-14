/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
var PropTypes = require('./utils/prop-types.js'),
    helpers = require('./utils/helpers.js'),
    makeError = require('baobab').helpers.makeError;

/**
 * Helpers
 */
function displayName(instance) {
  return (instance.constructor || {}).displayName || 'Component';
}

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
    var name = displayName(this);

    if (this.cursors) {
      this.__cursorsMapping = this.cursors;

      var solvedMapping = helpers.solveMapping(this.__cursorsMapping, this.props, this.context);

      // The given cursors property should be valid
      if (!solvedMapping)
        throw makeError(
          'baobab-react:mixins.branch: given mapping is invalid (check the "' + name + '" component).',
          {mapping: solvedMapping}
        );

      // Creating the watcher
      this.__watcher = this.context.tree.watch(solvedMapping);

      // Binding cursors
      this.cursors = this.__watcher.getCursors();

      // Setting initial state
      return this.__watcher.get();
    }

    return null;
  },

  // On component mount
  componentWillMount: function() {
    if (!this.__watcher)
      return;

    var handler = (function() {
      if (this.__watcher)
        this.setState(this.__watcher.get());
    }).bind(this);

    this.__watcher.on('update', handler);
  },

  // On component unmount
  componentWillUnmount: function() {
    if (!this.__watcher)
      return;

    // Releasing facet
    this.__watcher.release();
    this.__watcher = null;
  },

  // On new props
  componentWillReceiveProps: function(props) {
    if (!this.__watcher)
      return;

    // Refreshing the watcher
    var solvedMapping = helpers.solveMapping(this.__cursorsMapping, props, this.context);

    if (!solvedMapping)
      throw makeError(
        'baobab-react:mixins.branch: given mapping is invalid (check the "' + displayName(this) + '" component).',
        {mapping: solvedMapping}
      );

    this.__watcher.refresh(solvedMapping);
    this.cursors = this.__watcher.getCursors();
    this.setState(this.__watcher.get());
  }
};

// Exporting
exports.root = RootMixin;
exports.branch = BranchMixin;
