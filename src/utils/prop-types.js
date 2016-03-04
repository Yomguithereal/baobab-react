/**
 * Baobab-React Custom Prop Types
 * ===============================
 *
 * PropTypes used to propagate context safely.
 */
import Baobab from 'baobab';

function errorMessage(propName, what) {
  return `prop type \`${propName}\` is invalid; it must be ${what}.`;
}

export default {
  baobab(props, propName) {
    if (!(propName in props))
      return;

    if (!(props[propName] instanceof Baobab))
      return new Error(errorMessage(propName, 'a Baobab tree'));
  }
};
