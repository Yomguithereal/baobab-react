/**
 * Baobab-React Wrapper Component
 * ===============================
 *
 * ES6 wrapper component.
 */
import React from 'react/addons';
import abstract from './utils/abstract.js';
import PropTypes from './utils/prop-types.js';

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
    var group = React.Children.map(children, function(child) {
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

  static childContextTypes = {
    cursors: PropTypes.cursors
  };

  // Child context
  getChildContext() {
    return {
      cursors: this.cursors
    };
  }

  // Building initial state
  constructor(props, context) {
    super(props, context);

    var {facet, cursors} = abstract.init.call(
      this,
      context.tree,
      props.cursors
    );

    if (facet)
      this.state = facet.get();

    this.facet = facet;
    this.cursors = cursors;
  }

  // On component mount
  componentDidMount() {
    if (!this.facet)
      return;

    var handler = (function() {
      this.setState(this.facet.get());
    }).bind(this);

    this.facet.on('update', handler);
  }

  // Render shim
  render() {
    return renderChildren(this.props.children, branchPass(this.props, this.state));
  }

  // On component unmount
  componentWillUnmount() {
    if (!this.facet)
      return;

    // Releasing facet
    this.facet.release();
    this.facet = null;

    // Releasing cursors
    this.cursors = null;
  }
}
