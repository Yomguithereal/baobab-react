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
