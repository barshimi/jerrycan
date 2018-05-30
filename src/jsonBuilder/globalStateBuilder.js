const debug = require('debug')('webApp:globalStateBuilder')

export default function (moduleGlobalState, moduleName, globalState) {
  if (!moduleGlobalState.length) return globalState
  try {
    moduleGlobalState.forEach(global => {
      if (globalState.constants.includes(global.actionConst)) throw Error('A constant with the same name exist in application')
      globalState.constants.push(global.actionConst)
      if (validateActionName(globalState.actions, global.actionFnName)) throw Error('An action creator with the same name exist in application')
      globalState.actions.push(actionCreatorStructure(global))
      globalState.actionsInfo[global.actionConst] = getActionInfo(global)
      setGlobalsReducers(global, moduleName, globalState.reducers)
    })
  } catch (e) {
    debug(e)
  }
}

const actionCreatorStructure = (gcObj) => {
  return Object.assign({
    actionConst: gcObj.actionConst,
    actionFnName: gcObj.actionFnName,
    payload: gcObj.payload || false
  },
  gcObj.hasOwnProperty('params') ? {params: gcObj.params} : {},
  gcObj.hasOwnProperty('apiCall') ? {apiCall: gcObj.apiCall} : {})
}

const validateActionName = (globalActions, actionFnName) => {
  return globalActions.reduce((flag, globals) => {
    if (globals.actionFnName === actionFnName) flag = true
    return flag
  }, false)
}

const getActionInfo = (gcObj) => Object.assign({
  funcName: gcObj.actionFnName,
  desc: gcObj.description,
  reducers: gcObj.reducers || [],
  payload: gcObj.reducers.length > 0 || false
})

const checkInitialReducersInModule = (gcArr, moduleReducersMap) => Object.keys(gcArr).filter(reducer => moduleReducersMap.includes(reducer))

const setModuleReducersMap = (gcArr, moduleReducersMap) => Object.keys(gcArr).filter(r => !moduleReducersMap.includes(r)).every(r => moduleReducersMap.push(r))

const setGlobalsReducers = (gcObj, moduleName, globalReducers) => {
  try {
    const reducersToAction = Object.assign({
      actionConst: gcObj.actionConst,
      reducers: gcObj.reducers
    }, gcObj.hasOwnProperty('customReducer') ? {
      customReducer: {
        reducerFunc: gcObj.customReducer,
        module: moduleName
      }} : {})
    if (!gcObj.initialReducers) {
      setModuleReducersMap(gcObj.reducers, globalReducers.moduleReducersMap)
      if (!globalReducers.moduleReducer.hasOwnProperty(moduleName)) globalReducers.moduleReducer[moduleName] = []
      return globalReducers.moduleReducer[moduleName].push(reducersToAction)
    }
    if (checkInitialReducersInModule(gcObj.reducers, globalReducers.moduleReducersMap).length) throw Error('Reducer exist in both initial state and internal module')
    return globalReducers.reducers.push(reducersToAction)
  } catch (e) {
    debug(e)
  }
}
