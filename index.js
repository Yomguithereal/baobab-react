module.exports = {
  decorators: require('./dist-modules/decorators.js').default,
  higherOrder: require('./dist-modules/higher-order.js').default,
  mixins: require('./dist-modules/mixins.js').default,
  PropTypes: require('./dist-modules/utils/prop-types.js').default,
  wrappers: require('./dist-modules/wrappers.js').default
};
