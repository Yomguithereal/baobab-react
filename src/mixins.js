/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
import PropTypes from './utils/prop-types';
import {solveMapping} from './utils/helpers';
import Baobab from 'baobab';

const makeError = Baobab.helpers.makeError;

/**
 * Helpers
 */
function displayName(instance) {
  return (instance.constructor || {}).displayName || 'Component';
}

/**
 * Root mixin
 */
const RootMixin = {

  // Component prop types
  propTypes: {
    tree: PropTypes.baobab
  },

  // Context prop types
  childContextTypes: {
    tree: PropTypes.baobab
  },

  // Handling child context
  getChildContext() {
    return {
      tree: this.props.tree
    };
  }
};

/**
 * Branch mixin
 */
const BranchMixin = {

  // Retrieving the tree from context
  contextTypes: {
    tree: PropTypes.baobab
  },

  // Building initial state
  getInitialState() {
    const name = displayName(this);

    if (this.cursors) {
      this.__cursorsMapping = this.cursors;

      const mapping = solveMapping(
        this.__cursorsMapping,
        this.props,
        this.context
      );

      // If the solved mapping is not valid, we throw
      if (!mapping)
        throw makeError(
          'baobab-react:mixins.branch: given mapping is invalid (check the "' + name + '" component).',
          {mapping}
        );

      // Creating the watcher
      this.__watcher = this.context.tree.watch(mapping);

      // Building initial state
      return this.__watcher.get();
    }

    return null;
  },

  // On component mount
  componentWillMount() {

    // Creating dispatcher
    this.dispatch = (fn, ...args) => fn(this.context.tree, ...args);

    if (!this.__watcher)
      return;

    const handler = () => {
      if (this.__watcher)
        this.setState(this.__watcher.get());
    };

    this.__watcher.on('update', handler);
  },

  // On component unmount
  componentWillUnmount() {
    if (!this.__watcher)
      return;

    // Releasing facet
    this.__watcher.release();
    this.__watcher = null;
  },

  // On new props
  componentWillReceiveProps(props) {
    if (!this.__watcher)
      return;

    const name = displayName(this);

    // Refreshing the watcher
    const mapping = solveMapping(this.__cursorsMapping, props, this.context);

    if (!mapping)
      throw makeError(
        'baobab-react:mixins.branch: given mapping is invalid (check the "' + name + '" component).',
        {mapping}
      );

    this.__watcher.refresh(mapping);
    this.setState(this.__watcher.get());
  }
};

export {RootMixin as root, BranchMixin as branch};
