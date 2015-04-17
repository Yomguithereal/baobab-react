/**
 * Baobab-React Wrapper Component
 * ===============================
 *
 * ES6 wrapper component.
 */
import React from 'react';
import PropTypes from './utils/prop-types.js';

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
    return this.props.children;
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

Root.contextTypes = {
  tree: PropTypes.baobab
};
