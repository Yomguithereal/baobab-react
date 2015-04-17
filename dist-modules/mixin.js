/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
'use strict';

var React = require('react'),
    PropTypes = React.PropTypes,
    type = require('./utils/type.js'),
    abstract = require('./utils/abstract.js');

/**
 * Root mixin
 */
var RootMixin = {

  // Component prop Type
  propTypes: {
    tree: type.BaobabPropType
  },

  // Context prop types
  childContextTypes: {
    tree: type.BaobabPropType
  },

  // Handling child context
  getChildContext: function getChildContext() {
    return {
      tree: this.props.tree
    };
  }
};

/**
 * Child mixin
 */
var ChildMixin = {

  // Context prop types
  contextTypes: {
    tree: type.BaobabContextType
  },

  // Building initial state
  getInitialState: function getInitialState() {
    var o = abstract.init.call(this, this.context.tree, this.cursors);

    // Setting properties
    this.__facet = o.facet;
    this.cursors = o.cursors;

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

    // Releasing cursors
    for (var k in this.cursors) this.cursors[k].release();
    this.cursors = null;
  }
};

// Exporting
ChildMixin.root = RootMixin;

module.exports = ChildMixin;