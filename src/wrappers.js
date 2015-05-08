/**
 * Baobab-React Wrapper Component
 * ===============================
 *
 * ES6 wrapper component.
 */
import React from 'react/addons';
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
    cursors: PropTypes.cursors,
    facets: PropTypes.facets
  };

  // Child context
  getChildContext() {
    return {
      cursors: this.facet.cursors,
      facets: this.facet.facets
    };
  }

  // Building initial state
  constructor(props, context) {
    super(props, context);

    var facet = context.tree.createFacet({
      cursors: props.cursors,
      facets: props.facets
    }, [props, context]);

    if (facet)
      this.state = facet.get();

    this.facet = facet;
  }

  // On component mount
  componentWillMount() {
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
  }

  // On new props
  componentWillReceiveProps(props) {
    if (!this.facet)
      return;

    this.facet.refresh([props, this.context]);
    this.setState(this.facet.get());
  }
}
