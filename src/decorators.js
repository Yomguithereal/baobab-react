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
  return function(Component) {
    return Root(Component, tree);
  };
}

export function branch(specs) {
  return function(Component) {
    return Branch(Component, specs);
  };
}
