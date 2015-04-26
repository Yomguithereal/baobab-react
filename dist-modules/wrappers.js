'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

var _React = require('react/addons');

var _React2 = _interopRequireDefault(_React);

var _PropTypes = require('./utils/prop-types.js');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

/**
 * Helpers
 */
function rootPass(props) {
  var children = props.children;
  var tree = props.tree;

  var otherProps = _objectWithoutProperties(props, ['children', 'tree']);

  return _extends({}, otherProps);
}

function branchPass(props, state) {
  var children = props.children;
  var cursors = props.cursors;
  var facets = props.facets;

  var otherProps = _objectWithoutProperties(props, ['children', 'cursors', 'facets']);

  return _extends({}, otherProps, state);
}

function renderChildren(children, props) {
  if (!children) {
    return null;
  }if (!Array.isArray(children)) {
    return _React2['default'].addons.cloneWithProps(children, props);
  } else {
    var group = _React2['default'].Children.map(children, function (child) {
      return _React2['default'].addons.cloneWithProps(child, props);
    });

    return _React2['default'].createElement(
      'span',
      null,
      group
    );
  }
}

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
      return renderChildren(this.props.children, rootPass(this.props));
    }
  }], [{
    key: 'propTypes',
    value: {
      tree: _PropTypes2['default'].baobab
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      tree: _PropTypes2['default'].baobab
    },
    enumerable: true
  }]);

  return Root;
})(_React2['default'].Component);

exports.Root = Root;

/**
 * Branch wrapper
 */

var Branch = (function (_React$Component2) {

  // Building initial state

  function Branch(props, context) {
    _classCallCheck(this, Branch);

    _get(Object.getPrototypeOf(Branch.prototype), 'constructor', this).call(this, props, context);

    var facet = context.tree.createFacet({
      cursors: props.cursors,
      facets: props.facets
    }, [props, context]);

    if (facet) this.state = facet.get();

    this.facet = facet;
  }

  _inherits(Branch, _React$Component2);

  _createClass(Branch, [{
    key: 'getChildContext',

    // Child context
    value: function getChildContext() {
      return {
        cursors: this.facet.cursors
      };
    }
  }, {
    key: 'componentDidMount',

    // On component mount
    value: function componentDidMount() {
      if (!this.facet) {
        return;
      }var handler = (function () {
        this.setState(this.facet.get());
      }).bind(this);

      this.facet.on('update', handler);
    }
  }, {
    key: 'render',

    // Render shim
    value: function render() {
      return renderChildren(this.props.children, branchPass(this.props, this.state));
    }
  }, {
    key: 'componentWillUnmount',

    // On component unmount
    value: function componentWillUnmount() {
      if (!this.facet) {
        return;
      } // Releasing facet
      this.facet.release();
      this.facet = null;
    }
  }], [{
    key: 'contextTypes',
    value: {
      tree: _PropTypes2['default'].baobab
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      cursors: _PropTypes2['default'].cursors
    },
    enumerable: true
  }]);

  return Branch;
})(_React2['default'].Component);

exports.Branch = Branch;