/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 state of the art higher order component.
 */
import React from 'react';
import Baobab from 'baobab';
import {curry, isBaobabTree, solveMapping} from './utils/helpers';
import deepEqual from 'deep-equal';
import BaobabContext from './context';

const makeError = Baobab.helpers.makeError,
      isPlainObject = Baobab.type.object;

/**
 * Helpers
 */
function displayName(Component) {
  return Component.name || Component.displayName || 'Component';
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
  if (!isBaobabTree(tree))
    throw makeError(
      'baobab-react/higher-order.root: given tree is not a Baobab.',
      {target: tree}
    );

  if (typeof Component !== 'function')
    throw Error('baobab-react/higher-order.root: given target is not a valid React component.');

  const name = displayName(Component);

  const value = {tree};

  const ComposedComponent = class extends React.Component {
    // Render shim
    render() {
      return (
        <BaobabContext.Provider value={ value }>
          <Component {...this.props} />
        </BaobabContext.Provider>
      );
    }
  };

  ComposedComponent.displayName = 'Rooted' + name;

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

    // Building initial state
    constructor(props, context) {
      super(props, context);

      // Creating dispatcher
      this.dispatcher = (fn, ...args) => fn(this.context.tree, ...args);

      if (cursors) {
        this.mapping = solveMapping(cursors, props, context);

        if (!this.mapping)
          invalidMapping(name, this.mapping);

        if (!this.context || !isBaobabTree(this.context.tree))
          throw makeError(
            'baobab-react/higher-order.branch: tree is not available.'
          );

        // Creating the watcher
        this.watcher = this.context.tree.watch(this.mapping);

        // Hydrating initial state
        this.state = this.watcher.get();
      }
    }

    // On component mount
    componentDidMount() {
      if (!this.watcher)
        return;

      const handler = () => {
        if (this.watcher)
          this.setState(this.watcher.get());
      };

      handler();
      this.watcher.on('update', handler);
    }

    // Render shim
    render() {
      const {decoratedComponentRef, ...props} = this.props;
      const suppl = {dispatch: this.dispatcher};

      return <Component {...props} {...suppl} {...this.state} ref={decoratedComponentRef} />;
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
    componentDidUpdate() {
      if (!this.watcher || typeof cursors !== 'function')
        return;

      const mapping = solveMapping(cursors, this.props, this.context);

      if (!mapping)
        invalidMapping(name, mapping);

      if (deepEqual(mapping, this.mapping)) return;

      this.mapping = mapping;

      // Refreshing the watcher
      this.watcher.refresh(this.mapping);
      this.setState(this.watcher.get());
    }
  };

  ComposedComponent.displayName = 'Branched' + name;

  ComposedComponent.contextType = BaobabContext;

  return ComposedComponent;
}

// Currying the functions so that they could be used as decorators
const curriedRoot = curry(root, 2),
      curriedBranch = curry(branch, 2);

export {curriedRoot as root, curriedBranch as branch};
