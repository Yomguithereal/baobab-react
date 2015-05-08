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
  if (!type.Baobab(props[propName]))
    return new Error(errorMessage(propName, 'a Baobab tree'));
};

PropTypes.cursors = function(props, propName) {
  var p = props[propName];

  var valid = type.Object(p) && Object.keys(p).every(function(k) {
    return type.Cursor(p[k]);
  });

  if (!valid)
    return new Error(errorMessage(propName, 'Baobab cursors'));
};

PropTypes.facets = function(props, propName) {
  var p = props[propName];

  var valid = type.Object(p) && Object.keys(p).every(function(k) {
    return type.Facet(p[k]);
  });

  if (!valid)
    return new Error(errorMessage(propName, 'Baobab facets'));
};

module.exports = PropTypes;
