/**
 * Baobab-React Custom Prop Types
 * ===============================
 *
 * PropTypes used to propagate context safely.
 */
var Baobab = require('baobab'),
    Cursor = Baobab.Cursor,
    type = Baobab.type;

function errorMessage(propName, what) {
  return 'prop type `' + propName + '` is invalid; it must be ' + what + '.';
}

var PropTypes = {};

PropTypes.baobab = function(props, propName) {
  if (!(props[propName] instanceof Baobab))
    return new Error(errorMessage(propName, 'a Baobab tree'));
};

PropTypes.cursors = function(props, propName) {
  var cursors = props[propName];

  if (!type.object(cursors) ||
      !Object.keys(cursors).every(function(k) {
        return k instanceof Cursor;
      }))
    return new Error(errorMessage(propName, 'a cursors object'));
};

module.exports = PropTypes;
