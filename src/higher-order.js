/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 higher order component to enchance one's component.
 */
import React from 'react';
import type from './utils/type.js';
import PropTypes from './utils/prop-types.js';
import mixin from './utils/mixin.js';

let isHot = false;

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


export function branch(Component, spec = {}) {
  if (!type.Object(spec))
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
        cursors: this.__facet.cursors
      };
    }

    // Building initial state
    constructor(props, context) {
      super(props, context);
      this.state = mixin.createFacetAndReturnState.call(this, spec);
    }

    componentWillUpdate() {
      if (isHot) {
        mixin.resetCursorsAndFacets.call(this, spec);
      }
    }

    // On component mount
    componentWillMount() {
      mixin.registerListener.call(this);
    }

    // Render shim
    render() {
      return <Component {...this.props} {...this.state} />;
    }

    // On component unmount
    componentWillUnmount() {
      mixin.releaseFacet.call(this);
    }

    // On new props
    componentWillReceiveProps(props) {
      if (!this.__facet)
        return;

      this.__facet.refresh([props, this.context]);
      this.setState(this.__facet.get());
    }
  };

  return ComposedComponent;
}

export function makeHot() {
  isHot = true;
}
