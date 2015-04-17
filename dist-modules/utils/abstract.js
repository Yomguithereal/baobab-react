/**
 * Baobab-React Abstract Code
 * ===========================
 *
 * Compilation of functions used by each of the strategies.
 */
'use strict';

var type = require('./type.js');

exports.init = function (tree, map) {

  // No map provided, we return an empty object
  if (!map) return { cursors: {}, facet: null };

  if (typeof map === 'function') map = map.call(this);

  if (!type.Object(map)) throw Error('baobab-react: wrong "cursors" or "facets" property ' + '(should be object or function).');

  var cursors = {};

  var o = {},
      k;

  for (k in map) {

    // Solving
    if (typeof map[k] === 'function') o[k] = map[k].call(this);else o[k] = map[k];

    // Binding cursor
    cursors[k] = tree.select(o[k]);
  }

  // Creating facet
  var facet = tree.createFacet({ cursors: o });

  return {
    cursors: cursors,
    facet: facet
  };
};