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
  var ComposedComponent = class extends React.Component {

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

  // Child context types
  ComposedComponent.childContextTypes = {
    tree: PropTypes.baobab
  };

  return ComposedComponent;
}

/**
 * Branch component
 */
export function branch(Component, specs) {
  if (specs && !type.Object(specs))
    throw Error('baobab-react.higher-order: invalid specifications ' +
                '(should be an object with cursors and/or facets key).');

  var ComposedComponent = class extends React.Component {

    // Building initial state
    constructor(props, context) {
      super(props, context);

      //...
    }

    // Render shim
    render() {
      return <Component {...this.props} {...this.state}/>;
    }
  };

  ComposedComponent.contextTypes = {
    tree: PropTypes.baobab
  };

  return ComposedComponent;
}
