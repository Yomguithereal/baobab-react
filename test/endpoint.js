/* global beforeEach, afterEach */

/**
 * Baobab-React Unit Tests Endpoint
 * =================================
 *
 * Gathering and requiring test suites.
 */
var jsdom = require('jsdom').jsdom,
    assert = require('assert'),
    $ = require('cheerio');

// Extending assert
assert.selectorText = function(sel, txt) {
  return assert.strictEqual(
    $(sel, document.documentElement.outerHTML).text(),
    txt
  );
};

console.warn = function(msg) {
  throw Error(msg);
};

// Setup
beforeEach(function() {

  var dom = jsdom('<div><div id="mount"></div></div>');
  global.document = dom;
  global.window = dom.parentWindow;
  document.mount = dom.querySelector('#mount');

  require('react/lib/ExecutionEnvironment').canUseDOM = true;
});

afterEach(function() {
  delete global.document;
  delete global.window;
});

// Suites
require('./suites/mixins.jsx');
require('./suites/higher-order.jsx');
// require('./suites/wrappers.jsx');
