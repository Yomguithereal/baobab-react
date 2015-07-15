/**
 * Baobab-React Helpers
 * =====================
 *
 * Miscellaneous helper functions.
 */
var type = require('./type.js');

function makeError(message, data) {
  var err = new Error(message),
      k;

  for (k in data)
    err[k] = data[k];

  return err;
}

function solveMapping(mapping, props, context) {
  if (typeof mapping === 'function')
    mapping = mapping(props, context);

  if (!type.mapping(mapping))
    return null;

  return mapping;
}

module.exports = {
  makeError: makeError,
  solveMapping: solveMapping
};
