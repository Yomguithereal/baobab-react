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

type.BaobabPropType = function(props, propName, componentName) {
  var p = props[propName];

  if (!(p &&
        typeof p.toString === 'function' &&
        p.toString() === '[object Baobab]'))
    return new Error('baobab-react: the given tree is not a Baobab instance.');
};

module.exports = type;
