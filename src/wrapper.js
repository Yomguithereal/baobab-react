/**
 * Baobab-React Wrapper Component
 * ===============================
 *
 * ES6 wrapper component.
 */
import React from 'react/addons';
import PropTypes from './utils/prop-types.js';

/**
 * Helpers
 */
function renderChildren(children) {
  if (!children)
    return null;

  if (!Array.isArray(children))
    return React.addons.cloneWithProps(children);
  else
    return React.Children.map(children, function(child) {
      return React.addons.cloneWithProps(child);
    });
}

/**
 * Root wrapper
 */
export class Root extends React.Component {

  // Handling child context
  getChildContext() {
    return {
      tree: this.props.tree
    };
  }

  // Rendering children
  render() {
    return renderChildren(this.props.children);
  }
}

Root.propTypes = {
  tree: PropTypes.baobab
};

Root.childContextTypes = {
  tree: PropTypes.baobab
};

/**
 * Branch wrapper
 */
export class Branch extends React.Component {

}
