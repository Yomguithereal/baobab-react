/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 higher order component to enchance one's component.
 */
import React from 'react';
import type from './utils/type.js';
import helpers from './utils/helpers.js';
import PropTypes from './utils/prop-types.js';

/**
 * Root component
 */
export function root(Component, tree) {
  if (!type.baobab(tree))
    throw helpers.makeError(
      'baobab-react:higher-order.root: given tree is not a Baobab.',
      {target: tree}
    );

  const componentDisplayName =
    Component.name ||
    Component.displayName ||
    'Component';

  const ComposedComponent = class extends React.Component {
    static displayName = 'Rooted' + componentDisplayName;

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
export function branch(Component, mapping=null) {
  const componentDisplayName =
    Component.name ||
    Component.displayName ||
    'Component';

  const ComposedComponent = class extends React.Component {
    static displayName = 'Branched' + componentDisplayName;

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

      if (mapping) {
        const solvedMapping = helpers.solveMapping(mapping, props, context);

        if (!solvedMapping)
          throw helpers.makeError(
            'baobab-react:higher-order.branch: given mapping is invalid.',
            {mapping: solvedMapping}
          );

        // Creating the watcher
        this.watcher = this.context.tree.watch(solvedMapping);

        // Instantiating cursors
        this.cursors = {};

        let k;
        for (k in solvedMapping)
          if (type.cursor(solvedMapping[k]))
            this.cursors[k] = solvedMapping[k];
          else
            this.cursors[k] = this.context.tree.select(solvedMapping[k]);

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
      return <Component {...this.props} {...this.state} />;
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

      const solvedMapping = helpers.solveMapping(mapping, props, this.context);

      if (!solvedMapping)
        throw helpers.makeError(
          'baobab-react:higher-order.branch: given mapping is invalid.',
          {mapping: solvedMapping}
        );

      // Creating the watcher
      this.watcher = this.context.tree.watch(solvedMapping);

      // Instantiating cursors
      this.cursors = {};

      let k;
      for (k in solvedMapping)
        if (type.cursor(solvedMapping[k]))
          this.cursors[k] = solvedMapping[k];
        else
          this.cursors[k] = this.context.tree.select(solvedMapping[k]);

      this.setState(this.watcher.get());
    }
  };

  return ComposedComponent;
}
