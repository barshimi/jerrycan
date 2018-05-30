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
  return reducers.reduce((obj, configReducer) => {
    obj[configReducer.actionConst] = (state, payload) => fetchCostumeReducer(state, payload, configReducer)
    return obj
  }, {})
}

function fetchCostumeReducer (state, payload, reducers) {
  return reducers.reduce((obj, configReducer) => {
    if (!configReducer.hasOwnProperty('costumeReducer')) {
      obj[configReducer.actionConst] = (state, payload) => defaultReducerFunc(state, payload, configReducer.reducers)
    } else {
      import(`../../../../modules/${configReducer.costumeReducer.module}/reducers/${configReducer.costumeReducer.reducerFunc}`)
        .then(costumeReducer => {
          return obj[configReducer.actionConst] = (state, payload) => costumeReducer.default(state, payload, configReducer.reducers)
        })
        .catch(err => {
          debug(err)
          return obj[configReducer.actionConst] = (state, payload) => defaultReducerFunc(state, payload, configReducer.reducers)
        })
    }
    return obj
  }, {})
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
