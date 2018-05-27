'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.constantsCreator = constantsCreator;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [description]
 * @param  {[type]} constantsArr [description]
 * @return {[type]}              [description]
 */
function constantsCreator() {
  return _promise2.default.all([fetchCoreJsonFile()]).then(res => {
    if (!res[0].length) return {};
    return res[0].reduce((constObj, constant) => {
      constObj[constant] = constant;
      return constObj;
    }, {});
  });
}

function fetchCoreJsonFile() {
  return new _promise2.default((resolve, reject) => {
    try {
      import('../../../../coreJson/jcConstants.json').then(res => {
        resolve(res.default ? res.default : res);
      });
    } catch (e) {
      reject(e);
    }
  });
}