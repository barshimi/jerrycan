'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.reducersCreator = reducersCreator;
exports.buildReducerFunc = buildReducerFunc;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initialJson = require('../../../../coreJson/jcGlobalInitialState.json');
const reducersJson = require('../../../../coreJson/jcInitialReducers.json');
const debug = require('debug')('webApp:reducersCreator');

function reducersCreator() {
  try {
    // res [initialState, reducers]
    return reduxReducer(initialJson || {}, buildReducerFunc(reducersJson));
  } catch (e) {
    debug(e);
  }
}

function buildReducerFunc(reducers) {
  return reducers.reduce((obj, configReducer) => {
    obj[configReducer.actionConst] = (state, payload) => fetchCostumeReducer(state, payload, configReducer);
    return obj;
  }, {});
}

function fetchCostumeReducer(state, payload, reducers) {
  return reducers.reduce((obj, configReducer) => {
    if (!configReducer.hasOwnProperty('costumeReducer')) {
      obj[configReducer.actionConst] = (state, payload) => defaultReducerFunc(state, payload, configReducer.reducers);
    } else {
      import(`../../../../modules/${configReducer.costumeReducer.module}/reducers/${configReducer.costumeReducer.reducerFunc}`).then(costumeReducer => {
        return obj[configReducer.actionConst] = (state, payload) => costumeReducer.default(state, payload, configReducer.reducers);
      }).catch(err => {
        debug(err);
        return obj[configReducer.actionConst] = (state, payload) => defaultReducerFunc(state, payload, configReducer.reducers);
      });
    }
    return obj;
  }, {});
}

function defaultReducerFunc(state, payload, reducers) {
  const reducerObj = (0, _keys2.default)(reducers).reduce((obj, reducer) => {
    obj[reducer] = !reducers[reducer].hasOwnProperty('payload') ? reducers[reducer] : reducers[reducer].payloadKey ? payload[reducers[reducer].payloadKey] : payload;
    return obj;
  }, {});
  return (0, _assign2.default)({}, state, reducerObj);
}

function reduxReducer(initialState, reducersMap) {
  return (state = initialState, action) => reducersMap.hasOwnProperty(action.type) ? reducersMap[action.type](state, action.payload) : state;
}