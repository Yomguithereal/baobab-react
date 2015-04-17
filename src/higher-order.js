/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 higher order component to enchance one's component.
 */
import React from 'react';
import type from './utils/type.js';

/**
 * Root component
 */
export function Root(Component, tree) {
  var ComposedComponent = class extends React.Component {

    // Handling child context
    getChildContext() {
      return {
        tree: tree
      };
    }

    // Render shim
    render() {
      return <Component {...this.props} />
    }
  };

  // Child context types
  ComposedComponent.childContextTypes = {
    tree: type.BaobabPropType
  };

  return ComposedComponent;
}

/**
 * Branch component
 */
export function Branch(Component, specs) {
  if (specs && !type.Object(specs))
    throw Error('baobab-react.higher-order: invalid specifications (should be an object with cursors and/or facets key).')

  var ComposedComponent = class extends React.Component {

    // Building initial state
    constructor(props, context) {
      super(props, context);

      this.state = {name: 'Hey', surname: 'Jude'};
      this.test = 'Hello';
    }

    // Render shim
    render() {
      return <Component {...this.props} {...this.state}/>;
    }
  };

  ComposedComponent.contextTypes = {
    tree: type.BaobabPropType
  };

  return ComposedComponent
}
