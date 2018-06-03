'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.reducersCreator = reducersCreator;

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
    if (!configReducer.hasOwnProperty('customReducer')) {
      (0, _keys2.default)(configReducer.reducers).forEach(innerReducer => {
        if (!obj.hasOwnProperty(innerReducer)) obj[innerReducer] = {};
        obj[innerReducer][configReducer.actionConst] = (state, payload) => defaultReducerFunc(state, payload, configReducer.reducers[innerReducer]);
      });
    } else {
      import(`../../../../modules/${configReducer.customReducer.module}/${configReducer.customReducer.folderPath}/${configReducer.customReducer.reducerFunc}`).then(customReducer => {
        (0, _keys2.default)(configReducer.reducers).forEach(innerReducer => {
          if (!obj.hasOwnProperty(innerReducer)) obj[innerReducer] = {};
          obj[innerReducer][configReducer.actionConst] = (state, payload) => customReducer.default(state, payload, { reducer: innerReducer, config: configReducer.reducers[innerReducer] });
        });
      }).catch(err => {
        debug(err);
        return (0, _keys2.default)(configReducer.reducers).forEach(innerReducer => {
          if (!obj.hasOwnProperty(innerReducer)) obj[innerReducer] = {};
          obj[innerReducer][configReducer.actionConst] = (state, payload) => defaultReducerFunc(state, payload, configReducer.reducers[innerReducer]);
        });
      });
    }
    return obj;
  }, {});
}
function checkReducerConfig(reducerConfig) {
  if (Object.prototype.toString.call(reducerConfig) !== '[object Object]' || !reducerConfig.hasOwnProperty('payload')) return false;
  return true;
}
function defaultReducerFunc(state, payload, reducerConfig) {
  return !checkReducerConfig(reducerConfig) ? reducerConfig : reducerConfig.payloadKey ? payload[reducerConfig.payloadKey] : payload;
}

function reduxReducer(initialState = {}, reducersMap) {
  const reducerObj = (0, _keys2.default)(initialState).reduce((obj, globalState) => {
    obj[globalState] = (state = initialState[globalState], action) => {
      return reducersMap.hasOwnProperty(globalState) && reducersMap[globalState].hasOwnProperty(action.type) ? reducersMap[globalState][action.type](state, action.payload) : state;
    };
    return obj;
  }, {});
  return reducerObj;
}

// export function buildReducerFunc (reducers) {
//   return reducers.reduce((obj, configReducer) => {
//     obj[configReducer.actionConst] = (state, payload) => fetchCostumeReducer(state, payload, configReducer)
//     return obj
//   }, {})
// }
//
// function fetchCostumeReducer (state, payload, reducers) {
//   return reducers.reduce((obj, configReducer) => {
//     if (!configReducer.hasOwnProperty('costumeReducer')) {
//       obj[configReducer.actionConst] = (state, payload) => defaultReducerFunc(state, payload, configReducer.reducers)
//     } else {
//       import(`../../../../modules/${configReducer.costumeReducer.module}/reducers/${configReducer.costumeReducer.reducerFunc}`)
//         .then(costumeReducer => {
//           return obj[configReducer.actionConst] = (state, payload) => costumeReducer.default(state, payload, configReducer.reducers)
//         })
//         .catch(err => {
//           debug(err)
//           return obj[configReducer.actionConst] = (state, payload) => defaultReducerFunc(state, payload, configReducer.reducers)
//         })
//     }
//     return obj
//   }, {})
// }
//
// function defaultReducerFunc (state, payload, reducers) {
//   const reducerObj = Object.keys(reducers).reduce((obj, reducer) => {
//     obj[reducer] = !reducers[reducer].hasOwnProperty('payload') ? reducers[reducer] : reducers[reducer].payloadKey ? payload[reducers[reducer].payloadKey] : payload
//     return obj
//   }, {})
//   return Object.assign({}, state, reducerObj)
// }
//
// function reduxReducer (initialState, reducersMap) {
//   return (state = initialState, action) => reducersMap.hasOwnProperty(action.type) ? reducersMap[action.type](state, action.payload) : state
// }