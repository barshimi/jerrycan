'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = rcFile => {
  return (0, _keys2.default)(rcFile).every(key => rcMandatoryKeys.includes(key));
};

const rcMandatoryKeys = ['module', 'route', 'global_types', 'globalCycle', 'middlewares'];