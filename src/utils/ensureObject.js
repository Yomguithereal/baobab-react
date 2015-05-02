module.exports = function (obj) {
  if (!obj) {
    return {};
  }
  if (typeof obj === 'function') {
    obj = obj();
  }
  if (typeof obj === 'object' && obj !== null) {
    return obj;
  }
  return {};
};