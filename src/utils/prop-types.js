/**
 * Baobab-React Custom Prop Types
 * ===============================
 *
 * PropTypes used to propagate context safely.
 */
import {isBaobabTree} from './helpers';

function errorMessage(propName, what) {
  return `prop type \`${propName}\` is invalid; it must be ${what}.`;
}

export default {
  baobab(props, propName) {
    if (!(propName in props))
      return;

    if (!isBaobabTree(props[propName]))
      return new Error(errorMessage(propName, 'a Baobab tree'));
  }
};
