(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
BaobabReactMixins = require('./mixins.js');

},{"./mixins.js":5}],2:[function(require,module,exports){
/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
'use strict';

var PropTypes = require('./utils/prop-types.js');

/**
 * Root mixin
 */
var RootMixin = {

  // Component prop Type
  propTypes: {
    tree: PropTypes.baobab
  },

  // Context prop types
  childContextTypes: {
    tree: PropTypes.baobab
  },

  // Handling child context
  getChildContext: function getChildContext() {
    return {
      tree: this.props.tree
    };
  }
};

/**
 * Branch mixin
 */
var BranchMixin = {

  // Context prop types
  contextTypes: {
    tree: PropTypes.baobab
  },

  // Building initial state
  getInitialState: function getInitialState() {

    // Setting properties
    this.__facet = this.context.tree.createFacet({
      cursors: this.cursors,
      facets: this.facets
    }, [this.props, this.context]);
    this.cursors = this.__facet.cursors;

    if (this.__facet) {
      return this.__facet.get();
    }return {};
  },

  // On component mount
  componentDidMount: function componentDidMount() {
    if (!this.__facet) {
      return;
    }var handler = (function () {
      this.setState(this.__facet.get());
    }).bind(this);

    this.__facet.on('update', handler);
  },

  // On component unmount
  componentWillUnmount: function componentWillUnmount() {
    if (!this.__facet) {
      return;
    } // Releasing facet
    this.__facet.release();
    this.__facet = null;
  },

  // On new props
  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (!this.__facet) {
      return;
    }this.__facet.refresh([props, this.context]);
    this.setState(this.__facet.get());
  }
};

// Exporting
exports.root = RootMixin;
exports.branch = BranchMixin;
},{"./utils/prop-types.js":3}],3:[function(require,module,exports){
/**
 * Baobab-React Custom Prop Types
 * ===============================
 *
 * PropTypes used to propagate context safely.
 */
'use strict';

var type = require('./type.js');

function errorMessage(propName, what) {
  return 'prop type `' + propName + '` is invalid; it must be ' + what + '.';
}

var PropTypes = {};

PropTypes.baobab = function (props, propName) {
  if (!type.Baobab(props[propName])) return new Error(errorMessage(propName, 'a Baobab tree'));
};

PropTypes.cursors = function (props, propName) {
  var p = props[propName];

  var valid = type.Object(p) && Object.keys(p).every(function (k) {
    return type.Cursor(p[k]);
  });

  if (!valid) return new Error(errorMessage(propName, 'Baobab cursors'));
};

module.exports = PropTypes;
},{"./type.js":4}],4:[function(require,module,exports){
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

module.exports = type;
},{}],5:[function(require,module,exports){
module.exports = require('./dist-modules/mixins.js');

},{"./dist-modules/mixins.js":2}]},{},[1]);
