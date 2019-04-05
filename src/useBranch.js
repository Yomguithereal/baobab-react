import {useContext, useState, useEffect} from 'react';
import {Context} from './higher-order';
import {isBaobabTree} from './utils/helpers';
import Baobab from 'baobab';

const makeError = Baobab.helpers.makeError,
      isPlainObject = Baobab.type.object;

function invalidMapping(name, mapping) {
  throw makeError(
    'baobab-react/useBranch: given cursors mapping is invalid (check the "' + name + '" component).',
    {mapping}
  );
}

export function useBranch(cursors) {
  if (!isPlainObject(cursors) && typeof cursors !== 'function')
    invalidMapping(name, cursors);

  const context = useContext(Context);

  if (!context || !isBaobabTree(context.tree))
    throw makeError(
      'baobab-react/useBranch: tree is not available.'
    );

  const [state, setState] = useState(() => {
    const mapping = typeof cursors === 'function' ? cursors(context) : cursors;
    return context.tree.project(mapping);
  });

  useEffect(() => {
    const mapping = typeof cursors === 'function' ? cursors(context) : cursors;
    const watcher = context.tree.watch(mapping);

    watcher.on('update', () => {
      setState(watcher.get());
    });

    return () => watcher.release();
  }, [cursors]);

  return state;
}