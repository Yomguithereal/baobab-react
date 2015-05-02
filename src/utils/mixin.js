var ensureObject = require('./ensureObject.js');
var isSame = require('./isSame.js');

var mixin = {
  createFacetAndReturnState: function(spec) {

    if (!this.context.tree) {
      console.warn('No tree available on context');
      return {};
    }

    // Setting properties
    this.__facet = this.context.tree.createFacet({
      cursors: spec.cursors,
      facets: spec.facets
    });

    this.__previousCursors = ensureObject(spec.cursors);
    this.__previousFacets = ensureObject(spec.facets);

    if (this.__facet) {
      return this.__facet.get();
    }

    return {};

  },
  releaseFacet: function() {
    if (!this.__facet)
      return;

    this.__facet.release();
    this.__facet = null;
  },
  cleanState: function() {
    this.__previousFacets = this.__previousFacets || {};
    this.__previousCursors = this.__previousCursors || {};
    Object.keys(this.__previousFacets).concat(Object.keys(this.__previousCursors)).forEach(function(key) {
      delete this.state[key];
    }, this);
    return this.state || {};
  },
  registerListener: function() {
    if (!this.__facet)
      return;

    this.__facet.on('update', function() {
      this.setState(this.__facet.get());
    }.bind(this));
  },
  hasChangedBaobabProps: function() {
    var cursors = ensureObject(this.cursors);
    var facets = ensureObject(this.facets);
    return
  },
  resetCursorsAndFacets: function(spec) {

    // If cursors and facets has not changed,
    // just return
    if (isSame(ensureObject(spec.cursors), this.__previousCursors) && isSame(ensureObject(spec.facets), this.__previousFacets)) {
      return;
    }

    // Remove all facet and cursor keys from state, and
    // return the cleaned object
    var state = mixin.cleanState.call(this);

    // Release facet
    mixin.releaseFacet.call(this);

    // Get new facet state and register listener
    var newState = mixin.createFacetAndReturnState.call(this, spec);
    mixin.registerListener.call(this);

    // Merge new facet state into cleaned state
    Object.keys(newState).reduce(function(state, key) {
      state[key] = newState[key];
      return state;
    }, state);

    // Set new state
    this.setState(state);
  }
};

module.exports = mixin;
