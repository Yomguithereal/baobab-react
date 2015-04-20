/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 higher order component to enchance one's component.
 */
import React from 'react';
import type from './utils/type.js';
import PropTypes from './utils/prop-types.js';

/**
 * Root component
 */
export function root(Component, tree) {
  if (!type.Baobab(tree))
    throw Error('baobab-react:higher-order.root: given tree is not a Baobab.');

  var ComposedComponent = class extends React.Component {
    static childContextTypes = {
      tree: PropTypes.baobab
    };

    // Handling child context
    getChildContext() {
      return {
        tree: tree
      };
    }

    // Render shim
    render() {
      return <Component {...this.props} />;
    }
  };

  return ComposedComponent;
}

/**
 * Branch component
 */
export function branch(Component, specs = {}) {
  if (!type.Object(specs))
    throw Error('baobab-react.higher-order: invalid specifications ' +
                '(should be an object with cursors and/or facets key).');

  var ComposedComponent = class extends React.Component {
    static contextTypes = {
      tree: PropTypes.baobab
    };

    static childContextTypes = {
      cursors: PropTypes.cursors
    };

    // Child context
    getChildContext() {
      return {
        cursors: this.facet.cursors
      };
    }

    // Building initial state
    constructor(props, context) {
      super(props, context);

      var facet = context.tree.createFacet(specs, this);

      if (facet)
        this.state = facet.get();

      this.facet = facet;
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
      return <Component {...this.props} {...this.state} />;
    }

    // On component unmount
    componentWillUnmount() {
      if (!this.facet)
        return;

      // Releasing facet
      this.facet.release();
      this.facet = null;
    }
  };

  return ComposedComponent;
}
