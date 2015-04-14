/**
 * Baobab-React Type Checking
 * ===========================
 *
 * Some helpers to perform runtime validations.
 */

var type = {};

type.Object = function(value) {
  return value &&
         typeof value === 'object' &&
         !Array.isArray(value) &&
         !(value instanceof Function);
};

type.Map = function(value) {
  return typeof value === 'function' || type.Object(value);
}

module.exports = type;
