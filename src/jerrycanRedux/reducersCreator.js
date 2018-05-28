import path from 'path'
const initialJson = require('../../../../coreJson/jcGlobalInitialState.json')
const reducersJson = require('../../../../coreJson/jcInitialReducers.json')
const debug = require('debug')('webApp:reducersCreator')

export function reducersCreator () {
  try {
    // res [initialState, reducers]
    return reduxReducer(initialJson || {}, buildReducerFunc(reducersJson))
  } catch (e) {
    debug(e)
  }
}

export function buildReducerFunc (reducers) {
  return reducers.reduce((obj, global) => {
    obj[global.actionConst] = (state, payload) => fetchCostumeReducer(state, payload, global)
    return obj
  }, {})
}

function fetchCostumeReducer (state, payload, reducerObj) {
  const defaultReducer = defaultReducerFunc(state, payload, reducerObj.reducers)
  if (!reducerObj.hasOwnProperty('costumeReducer')) return defaultReducer
  import(path.join('../../../../modules/', reducerObj.costumeReducer.module, 'reducers', reducerObj.costumeReducer.reducerFunc))
    .then(costumeReducer => costumeReducer.default(state, payload, reducerObj.reducers))
    .catch(err => {
      debug(err)
      return defaultReducer
    })
}

function defaultReducerFunc (state, payload, reducers) {
  const reducerObj = Object.keys(reducers).reduce((obj, reducer) => {
    obj[reducer] = !reducers[reducer].hasOwnProperty('payload') ? reducers[reducer] : reducers[reducer].payloadKey ? payload[reducers[reducer].payloadKey] : payload
    return obj
  }, {})
  return Object.assign({}, state, reducerObj)
}

function reduxReducer (initialState, reducersMap) {
  return (state = initialState, action) => reducersMap.hasOwnProperty(action.type) ? reducersMap[action.type](state, action.payload) : state
}
