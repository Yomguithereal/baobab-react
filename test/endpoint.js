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

function throwMessage(msg) {
  throw Error(msg);
}

console.warn = throwMessage;
console.error = throwMessage;

// Setup
before(function() {
  var dom = jsdom('<!doctype html><html><head><meta charset="utf-8"></head><body><div id="mount"></div></body></html>');

  global.window = dom.parentWindow;
  global.document = dom;
  global.navigator = window.navigator;
  document.mount = document.querySelector('#mount');
});

// Cleanup
after(function() {
  global.window.close();
  delete global.document;
  delete global.navigator;
  delete global.window;
});

// Suites
require('./suites/mixins.jsx');
require('./suites/higher-order.jsx');
require('./suites/wrappers.jsx');
