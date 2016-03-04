/**
 * Baobab-React Helpers
 * =====================
 *
 * Miscellaneous helper functions.
 */
export function curry(fn, arity, acc) {
  acc = acc || [];

  return function(...args) {
    if (args.length < arity)
      return curry(fn, arity - 1, acc.concat(args));

    return fn(...args);
  };
}

export function solveMapping(mapping, props, context) {
  if (typeof mapping === 'function')
    mapping = mapping(props, context);

  return mapping;
}
