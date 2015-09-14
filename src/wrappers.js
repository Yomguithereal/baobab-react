/**
 * Baobab-React Wrapper Component
 * ===============================
 *
 * ES6 wrapper component.
 */
import React from 'react';
import Baobab from 'baobab';
import PropTypes from './utils/prop-types.js';
import {solveMapping} from './utils/helpers.js';

const makeError = Baobab.helpers.makeError;

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
    ...otherProps
  } = props;

  return {...otherProps, ...state};
}

function renderChildren(children, props) {
  if (!children)
    return null;

  if (!Array.isArray(children)) {
    return React.cloneElement(children, props);
  }
  else {
    const group = React.Children.map(children, function(child) {
      return React.cloneElement(child, props);
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

  static childContextTypes = {
    cursors: PropTypes.cursors
  };

  // Passing the component's cursors through context
  getChildContext() {
    return {
      cursors: this.cursors
    };
  }

  // Building initial state
  constructor(props, context) {
    super(props, context);

    if (props.cursors) {
      const solvedMapping = solveMapping(props.cursors, props, context);

      if (!solvedMapping)
        throw makeError(
          'baobab-react:wrappers.branch: given mapping is invalid.',
          {mapping: solvedMapping}
        );

      // Creating the watcher
      this.watcher = this.context.tree.watch(solvedMapping);
      this.cursors = this.watcher.getCursors();
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

    const solvedMapping = solveMapping(props.cursors, props, this.context);

    if (!solvedMapping)
      throw makeError(
        'baobab-react:wrappers.branch: given mapping is invalid.',
        {mapping: solvedMapping}
      );

    // Refreshing the watcher
    this.watcher.refresh(solvedMapping);
    this.cursors = this.watcher.getCursors();
    this.setState(this.watcher.get());
  }
}
