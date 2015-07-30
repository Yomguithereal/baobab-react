/**
 * Baobab-React Wrapper Component
 * ===============================
 *
 * ES6 wrapper component.
 */
import React from 'react/addons';
import PropTypes from './utils/prop-types.js';
import helpers from './utils/helpers.js';
import type from './utils/type.js';

/**
 * Helpers
 */
function rootPass(props) {
  const {
    children,
    tree,
    ...otherProps
  } = props;

  return {...otherProps};
}

function branchPass(props, state) {
  const {
    children,
    cursors,
    facets,
    ...otherProps
  } = props;

  return {...otherProps, ...state};
}

function renderChildren(children, props) {
  if (!children)
    return null;

  if (!Array.isArray(children)) {
    return React.addons.cloneWithProps(children, props);
  }
  else {
    const group = React.Children.map(children, function(child) {
      return React.addons.cloneWithProps(child, props);
    });

    return <span>{group}</span>;
  }
}

/**
 * Root wrapper
 */
export class Root extends React.Component {
  static propTypes = {
    tree: PropTypes.baobab
  };

  static childContextTypes = {
    tree: PropTypes.baobab
  };

  // Handling child context
  getChildContext() {
    return {
      tree: this.props.tree
    };
  }

  // Rendering children
  render() {
    return renderChildren(this.props.children, rootPass(this.props));
  }
}

/**
 * Branch wrapper
 */
export class Branch extends React.Component {
  static contextTypes = {
    tree: PropTypes.baobab
  };

  // Building initial state
  constructor(props, context) {
    super(props, context);

    if (props.cursors) {
      const solvedMapping = helpers.solveMapping(props.cursors, props, context);

      if (!solvedMapping)
        throw helpers.makeError(
          'baobab-react:higher-order.branch: given mapping is invalid.',
          {mapping: solvedMapping}
        );

      // Creating the watcher
      this.watcher = this.context.tree.watch(solvedMapping);
      this.state = this.watcher.get();
    }
  }

  // On component mount
  componentWillMount() {
    if (!this.watcher)
      return;

    const handler = (function() {
      if (this.watcher)
        this.setState(this.watcher.get());
    }).bind(this);

    this.watcher.on('update', handler);
  }

  // Render shim
  render() {
    return renderChildren(this.props.children, branchPass(this.props, this.state));
  }

  // On component unmount
  componentWillUnmount() {
    if (!this.watcher)
      return;

    // Releasing watcher
    this.watcher.release();
    this.watcher = null;
  }

  // On new props
  componentWillReceiveProps(props) {
    if (!this.watcher)
      return;

    const solvedMapping = helpers.solveMapping(props.cursors, props, this.context);

    if (!solvedMapping)
      throw helpers.makeError(
        'baobab-react:higher-order.branch: given mapping is invalid.',
        {mapping: solvedMapping}
      );

    // Refreshing the watcher
    this.watcher.refresh(solvedMapping);
    this.setState(this.watcher.get());
  }
}
