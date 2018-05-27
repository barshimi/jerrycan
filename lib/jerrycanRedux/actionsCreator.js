'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.actionsCreator = actionsCreator;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('webApp:actionsCreator'); // import fs from 'browserify-fs'
function actionsCreator() {
  try {
    return _promise2.default.all([fetchCoreJsonFile()]).then(res => {
      return res[0].reduce((obj, action) => {
        const passPayload = action.payload || false;
        obj[action.actionFnName] = !action.hasOwnProperty('apiCall') ? (payload = null) => (0, _assign2.default)({ type: action.actionConst }, passPayload ? { payload: payload } : {}) : (payload = null) => (0, _assign2.default)({ type: action.actionConst }, passPayload ? { payload: payload } : {}, { 'JCAC': {
            endPoint: action.apiCall.endPoint,
            request: action.apiCall.request,
            error: action.apiCall.error,
            innerFunc: action.apiCall.innerMW // TODO: load the function and pass it to the middleware throught the action
          } });
        return obj;
      }, {});
    });
  } catch (e) {
    debug(e);
  }
}

function fetchCoreJsonFile() {
  return new _promise2.default((resolve, reject) => {
    try {
      import('../../../../coreJson/jcActions.json').then(res => {
        resolve(res.default ? res.default : res);
      });
    } catch (e) {
      reject(e);
    }
  });
}