/**
 * Baobab-React Helpers
 * =====================
 *
 * Miscellaneous helper functions.
 */
var type = require('baobab').type;

function solveMapping(mapping, props, context) {
  if (typeof mapping === 'function')
    mapping = mapping(props, context);

  return mapping;
}

module.exports = {
  solveMapping: solveMapping
};
