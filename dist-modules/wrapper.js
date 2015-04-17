'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * Baobab-React Wrapper Component
 * ===============================
 *
 * ES6 wrapper component.
 */

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _PropTypes = require('./utils/prop-types.js');

var _PropTypes2 = _interopRequireWildcard(_PropTypes);

/**
 * Root wrapper
 */

var Root = (function (_React$Component) {
  function Root() {
    _classCallCheck(this, Root);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Root, _React$Component);

  _createClass(Root, [{
    key: 'getChildContext',

    // Handling child context
    value: function getChildContext() {
      return {
        tree: this.props.tree
      };
    }
  }, {
    key: 'render',

    // Rendering children
    value: function render() {
      return this.props.children;
    }
  }]);

  return Root;
})(_React2['default'].Component);

exports.Root = Root;

Root.propTypes = {
  tree: _PropTypes2['default'].baobab
};

Root.childContextTypes = {
  tree: _PropTypes2['default'].baobab
};

/**
 * Branch wrapper
 */

var Branch = (function (_React$Component2) {
  function Branch() {
    _classCallCheck(this, Branch);

    if (_React$Component2 != null) {
      _React$Component2.apply(this, arguments);
    }
  }

  _inherits(Branch, _React$Component2);

  return Branch;
})(_React2['default'].Component);

exports.Branch = Branch;

Root.contextTypes = {
  tree: _PropTypes2['default'].baobab
};