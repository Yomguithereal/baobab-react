/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 higher order component to enchance one's component.
 */
import React from 'react';
import Baobab, {type} from 'baobab';
import {solveMapping} from './utils/helpers.js';
import PropTypes from './utils/prop-types.js';

const makeError = Baobab.helpers.makeError;

/**
 * Root component
 */
export function root(Component, tree) {
  if (!(tree instanceof Baobab))
    throw makeError(
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

    // Passing the component's cursors through context
    getChildContext() {
      return {
        cursors: this.cursors
      };
    }

    // Building initial state
    constructor(props, context) {
      super(props, context);

      if (mapping.cursors) {
        const solvedMapping = solveMapping(mapping.cursors, props, context);

        if (!solvedMapping)
          throw makeError(
            'baobab-react:higher-order.branch: given cursors mapping is invalid (check the "' + displayName + '" component).',
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
      if (!this.watcher || !mapping.cursors)
        return;

      const solvedMapping = solveMapping(mapping.cursors, props, this.context);

      if (!solvedMapping)
        throw makeError(
          'baobab-react:higher-order.branch: given mapping is invalid (check the "' + displayName + '" component).',
          {mapping: solvedMapping}
        );

      // Refreshing the watcher
      this.watcher.refresh(solvedMapping);
      this.cursors = this.watcher.getCursors();
      this.setState(this.watcher.get());
    }
  };

  return ComposedComponent;
}
