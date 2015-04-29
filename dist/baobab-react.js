(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
BaobabReact = require('./index.js');

},{"./index.js":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.root = root;
exports.branch = branch;
/**
 * Baobab-React Decorators
 * ========================
 *
 * ES7 decorators sugar for higher order components.
 */

var _Root$Branch = require('./higher-order.js');

function root(tree) {
  if (typeof tree === 'function') {
    return _Root$Branch.root(tree);
  }return function (target) {
    return _Root$Branch.root(target, tree);
  };
}

function branch(specs) {
  if (typeof specs === 'function') {
    return _Root$Branch.branch(specs);
  }return function (target) {
    return _Root$Branch.branch(target, specs);
  };
}
},{"./higher-order.js":3}],3:[function(require,module,exports){
'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
 * Root component
 */
exports.root = root;

/**
 * Branch component
 */
exports.branch = branch;
/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 higher order component to enchance one's component.
 */

var _React = require('react');

var _React2 = _interopRequireDefault(_React);

var _type = require('./utils/type.js');

var _type2 = _interopRequireDefault(_type);

var _PropTypes = require('./utils/prop-types.js');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

function root(Component, tree) {
  if (!_type2['default'].Baobab(tree)) throw Error('baobab-react:higher-order.root: given tree is not a Baobab.');

  var ComposedComponent = (function (_React$Component) {
    var _class = function ComposedComponent() {
      _classCallCheck(this, _class);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    };

    _inherits(_class, _React$Component);

    _createClass(_class, [{
      key: 'getChildContext',

      // Handling child context
      value: function getChildContext() {
        return {
          tree: tree
        };
      }
    }, {
      key: 'render',

      // Render shim
      value: function render() {
        return _React2['default'].createElement(Component, this.props);
      }
    }], [{
      key: 'childContextTypes',
      value: {
        tree: _PropTypes2['default'].baobab
      },
      enumerable: true
    }]);

    return _class;
  })(_React2['default'].Component);

  return ComposedComponent;
}

function branch(Component) {
  var specs = arguments[1] === undefined ? {} : arguments[1];

  if (!_type2['default'].Object(specs)) throw Error('baobab-react.higher-order: invalid specifications ' + '(should be an object with cursors and/or facets key).');

  var ComposedComponent = (function (_React$Component2) {
    var _class2 =

    // Building initial state
    function ComposedComponent(props, context) {
      _classCallCheck(this, _class2);

      _get(Object.getPrototypeOf(_class2.prototype), 'constructor', this).call(this, props, context);

      var facet = context.tree.createFacet(specs, [props, context]);

      if (facet) this.state = facet.get();

      this.facet = facet;
    };

    _inherits(_class2, _React$Component2);

    _createClass(_class2, [{
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
        return _React2['default'].createElement(Component, _extends({}, this.props, this.state));
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
    }, {
      key: 'componentWillReceiveProps',

      // On new props
      value: function componentWillReceiveProps(props) {
        if (!this.facet) {
          return;
        }this.facet.refresh([props, this.context]);
        this.setState(this.facet.get());
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

    return _class2;
  })(_React2['default'].Component);

  return ComposedComponent;
}
},{"./utils/prop-types.js":5,"./utils/type.js":6,"react":"react"}],4:[function(require,module,exports){
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
},{"./utils/prop-types.js":5}],5:[function(require,module,exports){
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
},{"./type.js":6}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
  }, {
    key: 'componentWillReceiveProps',

    // On new props
    value: function componentWillReceiveProps(props) {
      if (!this.facet) {
        return;
      }this.facet.refresh([props, this.context]);
      this.setState(this.facet.get());
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
},{"./utils/prop-types.js":5,"react/addons":"react/addons"}],8:[function(require,module,exports){
module.exports = {
  decorators: require('./dist-modules/decorators.js'),
  higherOrder: require('./dist-modules/higher-order.js'),
  mixins: require('./dist-modules/mixins.js'),
  PropTypes: require('./dist-modules/utils/prop-types.js'),
  wrappers: require('./dist-modules/wrappers.js')
};

},{"./dist-modules/decorators.js":2,"./dist-modules/higher-order.js":3,"./dist-modules/mixins.js":4,"./dist-modules/utils/prop-types.js":5,"./dist-modules/wrappers.js":7}]},{},[1]);
