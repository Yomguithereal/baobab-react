/**
 * Baobab-React Helpers
 * =====================
 *
 * Miscellaneous helper functions.
 */

/**
 * Simple curry function.
 */
export function curry(fn, arity) {
  return function f1(...args) {
    if (args.length >= arity) {
      return fn.apply(null, args);
    }
    else {
      return function f2(...args2) {
        return f1.apply(null, args.concat(args2));
      };
    }
  };
}

/**
 * Solving the mapping given to a higher-order construct.
 */
export function solveMapping(mapping, props, context) {
  if (typeof mapping === 'function')
    mapping = mapping(props, context);

  return mapping;
}

/**
 * Determines if the given tree is a Baobab tree.
 * FIXME: if Baobab ever implements something like Array.isArray we should use
 * that instead of relying in the internal _identity = '[object Baobab]' value.
 * See https://github.com/Yomguithereal/baobab/blob/master/src/baobab.js#L111
 */
export function isBaobabTree(tree) {
    return !!(tree && typeof tree.toString === 'function' && tree.toString() === '[object Baobab]');
}
