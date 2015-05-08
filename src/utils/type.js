/**
 * Baobab-React Type Checking
 * ===========================
 *
 * Some helpers to perform runtime validations.
 */
var Baobab = require('baobab'),
    Cursor = Baobab.Cursor,
    Facet = Baobab.Facet;

var type = {};

type.Object = function(value) {
  return value &&
         typeof value === 'object' &&
         !Array.isArray(value) &&
         !(value instanceof Date) &&
         !(value instanceof RegExp);
};

type.Baobab = function(value) {
  return value instanceof Baobab;
};

type.Cursor = function(value) {
  return value instanceof Cursor;
};

type.Facet = function(value) {
  return value instanceof Facet;
};

module.exports = type;
