/**
 * Baobab-React Decorators
 * ========================
 *
 * ES7 decorators sugar for higher order components.
 */
import {
  root as Root,
  branch as Branch
} from './higher-order.js';

export function root(tree) {
  if (typeof tree === 'function')
    return Root(tree);

  return function(target) {
    return Root(target, tree);
  };
}

export function branch(specs) {
  if (typeof specs === 'function')
    return Branch(specs);

  return function(target) {
    return Branch(target, specs);
  };
}
