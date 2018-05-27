'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.reducersCreator = reducersCreator;
exports.buildReducerFunc = buildReducerFunc;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('webApp:reducersCreator');

function reducersCreator() {
  try {
    // res [initialState, reducers]
    _promise2.default.all([fetchInitialJsonFile(), fetchReducersJsonFile()]).then(res => reduxReducer(res[0] = {}, buildReducerFunc(res[1])));
  } catch (e) {
    debug(e);
  }
}

function buildReducerFunc(reducers) {
  return reducers.reduce((obj, global) => {
    obj[global.actionConst] = (state, payload) => fetchCostumeReducer(state, payload, global);
    return obj;
  }, {});
}

function fetchCostumeReducer(state, payload, reducerObj) {
  const defaultReducer = defaultReducerFunc(state, payload, reducerObj.reducers);
  if (!reducerObj.hasOwnProperty('costumeReducer')) return defaultReducer;
  import(_path2.default.join('../../../../modules/', reducerObj.costumeReducer.module, 'reducers', reducerObj.costumeReducer.reducerFunc)).then(costumeReducer => costumeReducer.default(state, payload, reducerObj.reducers)).catch(err => {
    debug(err);
    return defaultReducer;
  });
}

function defaultReducerFunc(state, payload, reducers) {
  const reducerObj = (0, _keys2.default)(reducers).reduce((obj, reducer) => {
    obj[reducer] = !reducers[reducer].hasOwnProperty('payload') ? reducers[reducer] : reducers[reducer].payloadKey ? payload[reducers[reducer].payloadKey] : payload;
    return obj;
  }, {});
  return (0, _assign2.default)({}, state, reducerObj);
}

function fetchInitialJsonFile() {
  return new _promise2.default((resolve, reject) => {
    try {
      import('../../../../coreJson/jcGlobalInitialState.json').then(res => {
        resolve(res.default ? res.default : res);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function fetchReducersJsonFile() {
  return new _promise2.default((resolve, reject) => {
    try {
      import('../../../../coreJson/jcInitialReducers.json').then(res => {
        resolve(res.default ? res.default : res);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function reduxReducer(initialState, reducersMap) {
  return (state = initialState, action) => reducersMap.hasOwnProperty(action.type) ? reducersMap[action.type](state, action.payload) : state;
}

// function fetchCoreJsonFile (file) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path.join(__dirname, 'coreJson', `${file}.json`), 'utf8', (err, data) => {
//       if (err) reject(err)
//       return resolve(JSON.parse(data))
//     })
//   })
// }