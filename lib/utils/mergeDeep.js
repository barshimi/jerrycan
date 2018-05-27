'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDeep = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 * @param  {object} objects [Objects to merge]
 * @return {object} [New object with merged key/values]
 */
const mergeDeep = exports.mergeDeep = (...objects) => {
  const isObject = obj => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    (0, _keys2.default)(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
};