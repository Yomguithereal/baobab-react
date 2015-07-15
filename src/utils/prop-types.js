/**
 * Baobab-React Custom Prop Types
 * ===============================
 *
 * PropTypes used to propagate context safely.
 */
var type = require('./type.js');

function errorMessage(propName, what) {
  return 'prop type `' + propName + '` is invalid; it must be ' + what + '.';
}

var PropTypes = {};

PropTypes.baobab = function(props, propName) {
  if (!type.baobab(props[propName]))
    return new Error(errorMessage(propName, 'a Baobab tree'));
};

PropTypes.cursors = function(props, propName) {
  var p = props[propName];

  var valid = type.object(p) && Object.keys(p).every(function(k) {
    return type.cursor(p[k]);
  });

  if (!valid)
    return new Error(errorMessage(propName, 'Baobab cursors'));
};

module.exports = PropTypes;
