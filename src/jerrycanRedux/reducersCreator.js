
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
function buildReducerFunc (reducers) {
  return reducers.reduce((obj, configReducer) => {
    if (!configReducer.hasOwnProperty('costumeReducer')) {
      Object.keys(configReducer.reducers).forEach(innerReducer => {
        if (!obj.hasOwnProperty(innerReducer)) obj[innerReducer] = {}
        obj[innerReducer][configReducer.actionConst] = (state, payload) => defaultReducerFunc(state, payload, configReducer.reducers[innerReducer])
      })
    }
    return obj
  }, {})
}
function checkReducerConfig (reducerConfig) {
  if (Object.prototype.toString.call(reducerConfig) !== '[object Object]' || !reducerConfig.hasOwnProperty('payload')) return false
  return true
}
function defaultReducerFunc (state, payload, reducerConfig) {
  console.log(state, payload, reducerConfig)
  return !checkReducerConfig(reducerConfig) ? reducerConfig : reducerConfig.payloadKey ? payload[reducerConfig.payloadKey] : payload
}

function reduxReducer (initialState = {}, reducersMap) {
  const reducerObj = Object.keys(initialState).reduce((obj, globalState) => {
    obj[globalState] = (state = initialState[globalState], action) => {
      return reducersMap.hasOwnProperty(globalState) && reducersMap[globalState].hasOwnProperty(action.type) ? reducersMap[globalState][action.type](state, action.payload) : state
    }
    return obj
  }, {})
  return reducerObj
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
