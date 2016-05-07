/**
 * Baobab-React Helpers
 * =====================
 *
 * Miscellaneous helper functions.
 */

/**
 * Simple curry function.
 */
export function curry(fn, arity, acc) {
  acc = acc || [];

  return function(...args) {
    if (args.length < arity)
      return curry(fn, arity - 1, acc.concat(args));

    return fn(...args);
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
