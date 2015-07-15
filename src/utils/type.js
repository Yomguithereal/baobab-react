/**
 * Baobab-React Type Checking
 * ===========================
 *
 * Some helpers to perform runtime validations.
 */
var Baobab = require('baobab');

var Cursor = Baobab.Cursor;

var type = {};

type.object = function(value) {
  return value &&
         typeof value === 'object' &&
         !Array.isArray(value) &&
         !(value instanceof Date) &&
         !(value instanceof RegExp);
};

type.baobab = function(value) {
  return value instanceof Baobab;
};

type.cursor = function(value) {
  return value instanceof Cursor;
};

type.mapping = function(value) {
  return type.object(value) && Object.keys(value).every(function(s) {
    return Array.isArray(s) ||
           type.cursor(s) ||
           typeof s === 'string' ||
           typeof s === 'number' ||
           typeof s === 'function' ||
           typeof s === 'object';
  });
};

module.exports = type;
