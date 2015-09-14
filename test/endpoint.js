/**
 * Baobab-React Unit Tests Endpoint
 * =================================
 *
 * Gathering and requiring test suites.
 */
var jsdom = require('jsdom'),
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
jsdom.env({
  html: '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="mount"></div></body></html>',
  done: function(err, w) {
    global.window = w;
    global.document = w.document;
    global.navigator = w.navigator;
    document.mount = document.querySelector('#mount');
    start();
  }
});

function start() {

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

  run();
}
