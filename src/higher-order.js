/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 state of the art higher order component.
 */
import React from 'react';
import Baobab from 'baobab';
import {curry, solveMapping} from './utils/helpers';
import PropTypes from './utils/prop-types';

const makeError = Baobab.helpers.makeError,
      isPlainObject = Baobab.type.object;

/**
 * Helpers
 */
function displayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

function invalidMapping(name, mapping) {
  throw makeError(
    'baobab-react/higher-order.branch: given cursors mapping is invalid (check the "' + name + '" component).',
    {mapping}
  );
}

/**
 * Root component
 */
function root(tree, Component) {
  if (!(tree instanceof Baobab))
    throw makeError(
      'baobab-react/higher-order.root: given tree is not a Baobab.',
      {target: tree}
    );

  if (typeof Component !== 'function')
    throw Error('baobab-react/higher-order.root: given target is not a valid React component.');

  const name = displayName(Component);

  const ComposedComponent = class extends React.Component {

    // Handling child context
    getChildContext() {
      return {
        tree
      };
    }

    // Render shim
    render() {
      return <Component {...this.props} />;
    }
  };

  ComposedComponent.displayName = 'Rooted' + name;
  ComposedComponent.childContextTypes = {
    tree: PropTypes.baobab
  };

  return ComposedComponent;
}

/**
 * Branch component
 */
function branch(cursors, Component) {
  if (typeof Component !== 'function')
    throw Error('baobab-react/higher-order.branch: given target is not a valid React component.');

  const name = displayName(Component);

  if (!isPlainObject(cursors) && typeof cursors !== 'function')
    invalidMapping(name, cursors);

  const ComposedComponent = class extends React.Component {

    getDecoratedComponentInstance() {
        return this.decoratedComponentInstance;
    }

    handleChildRef(component) {
        this.decoratedComponentInstance = component;
    }

    // Building initial state
    constructor(props, context) {
      super(props, context);

      if (cursors) {
        const mapping = solveMapping(cursors, props, context);

        if (!mapping)
          invalidMapping(name, mapping);

        // Creating the watcher
        this.watcher = this.context.tree.watch(mapping);

        // Hydrating initial state
        this.state = this.watcher.get();
      }
    }

    // On component mount
    componentWillMount() {

      // Creating dispatcher
      this.dispatcher = (fn, ...args) => fn(this.context.tree, ...args);

      if (!this.watcher)
        return;

      const handler = () => {
        if (this.watcher)
          this.setState(this.watcher.get());
      };

      this.watcher.on('update', handler);
    }

    // Render shim
    render() {
      const suppl = {dispatch: this.dispatcher};

      return <Component {...this.props} {...suppl} {...this.state} ref={this.handleChildRef.bind(this)} />;
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
      if (!this.watcher || typeof cursors !== 'function')
        return;

      const mapping = solveMapping(cursors, props, this.context);

      if (!mapping)
        invalidMapping(name, mapping);

      // Refreshing the watcher
      this.watcher.refresh(mapping);
      this.setState(this.watcher.get());
    }
  };

  ComposedComponent.displayName = 'Branched' + name;
  ComposedComponent.contextTypes = {
    tree: PropTypes.baobab
  };

  return ComposedComponent;
}

// Currying the functions so that they could be used as decorators
const curriedRoot = curry(root, 2),
      curriedBranch = curry(branch, 2);

export {curriedRoot as root, curriedBranch as branch};
