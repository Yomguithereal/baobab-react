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

    this.__mapping = this.cursors;

    var solvedMapping = helpers.solveMapping(this.__mapping, this.props, this.context);

    // The given cursors property should be valid
    if (!solvedMapping)
      throw helpers.makeError(
        'baobab-react:mixins.branch: given mapping is invalid.',
        {mapping: solvedMapping}
      );

    // Creating the watcher
    this.__watcher = this.context.tree.watch(solvedMapping);

    // Instantiating cursors
    this.cursors = {};

    var k;
    for (k in solvedMapping)
      if (type.cursor(solvedMapping[k]))
        this.cursors[k] = solvedMapping[k];
      else
        this.cursors[k] = this.context.tree.select(solvedMapping[k]);

    // Setting initial state
    if (this.__watcher)
      return this.__watcher.get();
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

    // Refreshing watcher
    this.__watcher.release();
    var solvedMapping = helpers.solveMapping(this.__mapping, props, this.context);

    if (!solvedMapping)
      throw helpers.makeError(
        'baobab-react:mixins.branch: `cursors` property is not a valid object or function.',
        {mapping: solvedMapping}
      );

    this.__watcher = this.context.tree.watch(solvedMapping);

    // Refreshing cursors
    this.cursors = {};

    var k;
    for (k in solvedMapping)
      if (type.cursor(solvedMapping[k]))
        this.cursors[k] = solvedMapping[k];
      else
        this.cursors[k] = this.context.tree.select(solvedMapping[k]);

    this.setState(this.__watcher.get());
  }
};

// Exporting
exports.root = RootMixin;
exports.branch = BranchMixin;
