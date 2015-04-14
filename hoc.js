/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 higher order component to enchance one's component.
 */
import React from 'react';
import type from './type.js';

export function Root(Component) {
  var ComposedComponent = class extends React.Component {

    // Handling child context
    getChildContext() {
      return {
        tree: this.props.tree
      };
    }

    // Render shim
    render() {
      return <Component {...this.props} />
    }
  };

  // Prop types
  ComposedComponent.propTypes = {
    tree: type.BaobabPropType
  };

  ComposedComponent.childContextTypes = {
    tree: type.BaobabPropType
  };

  return ComposedComponent;
}

export function Bind(Component) {
  var ComposedComponent = class extends React.Component {

    // Building initial state
    constructor(props, context) {
      super(props, context);

      var map = this.cursors;

      // No map, we return an empty object
      if (!map) {
        this.state = {};
        return this;
      }

      if (typeof map === 'function')
        map = map.call(this);

      if (!type.Object(map))
        throw Error('baobab-react.mixin: wrong "cursors" property (should be object or function).');

      this.cursors = {};

      var o = {},
          k;

      for (k in map) {

        // Solving
        if (typeof map[k] === 'function')
          o[k] = map[k].call(this);
        else
          o[k] = map[k];

        // Binding cursor
        this.cursors[k] = this.context.tree.select(o[k]);
      }

      map = o;

      // Creating facet
      this.__facet = this.context.tree.createFacet({cursors: map});

      this.state = this.__facet.get();
    }

    // When component is mounted
    componentDidMount() {
      if (!this.__facet)
        return;

      var handler = (function() {
        this.setState(this.__facet.get());
      }).bind(this);

      this.__facet.on('update', handler);
    }

    // On component unmount
    componentWillUnmount() {
      if (!this.__facet)
        return;

      this.__facet.release();
      this.__facet = null;
    }

    // Render shim
    render() {
      return <Component {...this.props} />;
    }
  };

  ComposedComponent.contextTypes = {
    tree: type.BaobabPropType
  };

  return ComposedComponent
}
