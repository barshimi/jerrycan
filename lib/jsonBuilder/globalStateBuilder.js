'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = function (moduleGlobalState, moduleName, globalState) {
  if (!moduleGlobalState.length) return globalState;
  try {
    moduleGlobalState.forEach(global => {
      if (globalState.constants.includes(global.actionConst)) throw Error('A constant with the same name exist in application');
      globalState.constants.push(global.actionConst);
      if (validateActionName(globalState.actions, global.actionFnName)) throw Error('An action creator with the same name exist in application');
      globalState.actions.push(actionCreatorStructure(global));
      globalState.actionsInfo[global.actionConst] = getActionInfo(global);
      setGlobalsReducers(global, moduleName, globalState.reducers);
    });
  } catch (e) {
    debug(e);
  }
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('webApp:globalStateBuilder');

const actionCreatorStructure = gcObj => {
  return (0, _assign2.default)({
    actionConst: gcObj.actionConst,
    actionFnName: gcObj.actionFnName,
    payload: gcObj.payload || false
  }, gcObj.hasOwnProperty('params') ? { params: gcObj.params } : {}, gcObj.hasOwnProperty('apiCall') ? { apiCall: gcObj.apiCall } : {});
};

const validateActionName = (globalActions, actionFnName) => {
  return globalActions.reduce((flag, globals) => {
    if (globals.actionFnName === actionFnName) flag = true;
    return flag;
  }, false);
};

const getActionInfo = gcObj => (0, _assign2.default)({
  funcName: gcObj.actionFnName,
  desc: gcObj.description,
  reducers: gcObj.reducers || [],
  payload: gcObj.reducers.length > 0 || false
});

const checkInitialReducersInModule = (gcArr, moduleReducersMap) => (0, _keys2.default)(gcArr).filter(reducer => moduleReducersMap.includes(reducer));

const setModuleReducersMap = (gcArr, moduleReducersMap) => (0, _keys2.default)(gcArr).filter(r => !moduleReducersMap.includes(r)).every(r => moduleReducersMap.push(r));

const setGlobalsReducers = (gcObj, moduleName, globalReducers) => {
  try {
    const reducersToAction = (0, _assign2.default)({
      actionConst: gcObj.actionConst,
      reducers: gcObj.reducers
    }, gcObj.hasOwnProperty('customReducer') ? {
      customReducer: {
        reducerFunc: gcObj.customReducer,
        module: moduleName
      } } : {});
    if (!gcObj.initialReducers) {
      setModuleReducersMap(gcObj.reducers, globalReducers.moduleReducersMap);
      if (!globalReducers.moduleReducer.hasOwnProperty(moduleName)) globalReducers.moduleReducer[moduleName] = [];
      return globalReducers.moduleReducer[moduleName].push(reducersToAction);
    }
    if (checkInitialReducersInModule(gcObj.reducers, globalReducers.moduleReducersMap).length) throw Error('Reducer exist in both initial state and internal module');
    return globalReducers.reducers.push(reducersToAction);
  } catch (e) {
    debug(e);
  }
};