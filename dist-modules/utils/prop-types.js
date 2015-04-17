/**
 * Baobab-React Custom Prop Types
 * ===============================
 *
 * PropTypes used to propagate context safely.
 */
'use strict';

var type = require('./type.js');

var PropTypes = {};

PropTypes.baobab = function (props, propName, componentName) {
  if (!type.Baobab(props[propName])) return new Error('prop type `' + propName + '` is invalid; it must be a Baobab tree.');
};

module.exports = PropTypes;