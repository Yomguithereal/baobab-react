/**
 * Baobab-React Helpers
 * =====================
 *
 * Miscellaneous helper functions.
 */
function curry(fn, arity, acc) {
  acc = acc || [];

  return function() {
    var args = Array.prototype.slice.call(arguments);

    if (args.length < arity)
      return curry(fn, arity - 1, acc.concat(args));

    return fn.apply(null, args);
  };
}

function solveMapping(mapping, props, context) {
  if (typeof mapping === 'function')
    mapping = mapping(props, context);

  return mapping;
}

module.exports = {
  solveMapping: solveMapping
};
