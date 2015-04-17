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

type.Baobab = function(value) {
	return value &&
         typeof value.toString === 'function' &&
         value.toString() === '[object Baobab]';
};

type.Cursor = function(value) {
  return value &&
         typeof value.toString === 'function' &&
         value.toString() === '[object Cursor]';
};

module.exports = type;
