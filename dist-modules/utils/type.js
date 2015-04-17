/**
 * Baobab-React Type Checking
 * ===========================
 *
 * Some helpers to perform runtime validations.
 */
'use strict';

var type = {};

type.Object = function (value) {
  return value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Function);
};

type.Baobab = function (value) {
  return value && typeof value.toString === 'function' && value.toString() === '[object Baobab]';
};

type.Cursor = function (value) {
  return value && typeof value.toString === 'function' && value.toString() === '[object Cursor]';
};

type.BaobabPropType = function (props, propName, componentName) {

  if (!props[propName]) return new Error('baobab-react: no tree was given.');
  if (!type.Baobab(props[propName])) return new Error('baobab-react: the given tree is not a Baobab instance.');
};

type.BaobabContextType = function (props, propName, componentName) {

  if (!props[propName]) return new Error('baobab-react: no tree was passed through context.');
  if (!type.Baobab(props[propName])) return new Error('baobab-react: the given tree is not a Baobab instance.');
};

module.exports = type;