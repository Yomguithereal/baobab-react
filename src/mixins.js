/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
var PropTypes = require('./utils/prop-types.js'),
    type = require('./utils/type.js'),
    helpers = require('./utils/helpers.js');

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

    if (!this.cursors)
      return {};

    this.__cursors = this.cursors;

    var cursors = helpers.solveMapping(this.cursors, this.props, this.context);

    // The given cursors should be an object
    if (!cursors)
      throw helpers.makeError(
        'baobab-react:mixins.branch: `cursors` property is not a valid object or function.',
        {cursors: cursors}
      );

    // Creating the watcher
    this.__watcher = this.context.tree.watch(cursors);

    // Instantiating cursors
    this.cursors = {};

    var k;
    for (k in cursors)
      if (type.cursor(cursors[k]))
        this.cursors[k] = cursors[k];
      else
        this.cursors[k] = this.context.tree.select(cursors[k]);

    // Setting initial state
    if (this.__watcher)
      return this.__watcher.get();
  },

  // On component mount
  componentWillMount: function() {
    if (!this.__watcher)
      return;

    var handler = (function() {
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

    // Refreshing watcher
    this.__watcher.release();
    var cursors = helpers.solveMapping(this.__cursors, props, this.context);
    this.__watcher = this.context.tree.watch(cursors);

    // Refreshing cursors
    this.cursors = {};

    var k;
    for (k in cursors)
      if (type.cursor(cursors[k]))
        this.cursors[k] = cursors[k];
      else
        this.cursors[k] = this.context.tree.select(cursors[k]);

    this.setState(this.__watcher.get());
  }
};

// Exporting
exports.root = RootMixin;
exports.branch = BranchMixin;
