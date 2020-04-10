import React, {useContext, useState, useEffect} from 'react';
import {isBaobabTree} from './utils/helpers';
import Baobab from 'baobab';
import BaobabContext from './context';

const makeError = Baobab.helpers.makeError,
      isPlainObject = Baobab.type.object;

function invalidMapping(name, mapping) {
  throw makeError(
    'baobab-react/hooks.useBranch: given cursors mapping is invalid (check the "' + name + '" component).',
    {mapping}
  );
}

export function useRoot(tree) {
  if (!isBaobabTree(tree))
    throw makeError(
      'baobab-react/hooks.useRoot: given tree is not a Baobab.',
      {target: tree}
    );

  const [state, setState] = useState(() => {
    return ({children}) => {
      return React.createElement(BaobabContext.Provider, {
        value: {tree}
      }, children);
    };
  });

  useEffect(() => {
    setState(() => {
      return ({children}) => {
        return React.createElement(BaobabContext.Provider, {
          value: {tree}
        }, children);
      };
   });
  }, [tree]);

  return state;
}

export function useBranch(cursors, deps) {
  if (!isPlainObject(cursors) && typeof cursors !== 'function')
    invalidMapping(name, cursors);

  const context = useContext(BaobabContext);

  if (!context || !isBaobabTree(context.tree))
    throw makeError(
      'baobab-react/hooks.useBranch: tree is not available.'
    );

  const [state, setState] = useState(() => {
    const mapping = typeof cursors === 'function' ? cursors(context) : cursors;
    const obj = context.tree.project(mapping);
    obj.dispatch = (fn, ...args) => fn(context.tree, ...args);
    return obj;
  });

  useEffect(() => {
    const mapping = typeof cursors === 'function' ? cursors(context) : cursors;
    const watcher = context.tree.watch(mapping);

    const updateValue = () => {
      const obj = watcher.get();
      obj.dispatch = (fn, ...args) => fn(context.tree, ...args);
      setState(obj);
    };

    // cursors have changed - update value immediately
    updateValue();

    watcher.on('update', updateValue);

    return () => watcher.release();
  }, deps || []);

  return state;
}
