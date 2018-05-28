'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.actionsCreator = actionsCreator;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const actionJson = require('../../../../coreJson/jcActions.json');
const debug = require('debug')('webApp:actionsCreator');

function actionsCreator() {
  try {
    return actionJson.reduce((obj, action) => {
      const passPayload = action.payload || false;
      obj[action.actionFnName] = !action.hasOwnProperty('apiCall') ? (payload = null) => (0, _assign2.default)({ type: action.actionConst }, passPayload ? { payload: payload } : {}) : (payload = null) => (0, _assign2.default)({ type: action.actionConst }, passPayload ? { payload: payload } : {}, { 'JCAC': {
          endPoint: action.apiCall.endPoint,
          request: action.apiCall.request,
          error: action.apiCall.error,
          innerFunc: action.apiCall.innerMW // TODO: load the function and pass it to the middleware throught the action
        } });
      return obj;
    }, {});
  } catch (e) {
    debug(e);
  }
}