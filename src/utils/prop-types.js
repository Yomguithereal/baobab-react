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

module.exports = PropTypes;
