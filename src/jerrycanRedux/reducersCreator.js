import path from 'path'

const debug = require('debug')('webApp:reducersCreator')

export function reducersCreator () {
  try {
    // res [initialState, reducers]
    Promise.all([fetchInitialJsonFile(), fetchReducersJsonFile()])
      .then(res => reduxReducer(res[0] = {}, buildReducerFunc(res[1])))
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

function fetchInitialJsonFile () {
  return new Promise((resolve, reject) => {
    try {
      import('../../../../coreJson/jcGlobalInitialState.json').then(res => {
        resolve(res.default ? res.default : res)
      })
    } catch (e) {
      reject(e)
    }
  })
}

function fetchReducersJsonFile () {
  return new Promise((resolve, reject) => {
    try {
      import('../../../../coreJson/jcInitialReducers.json').then(res => {
        resolve(res.default ? res.default : res)
      })
    } catch (e) {
      reject(e)
    }
  })
}

function reduxReducer (initialState, reducersMap) {
  return (state = initialState, action) => reducersMap.hasOwnProperty(action.type) ? reducersMap[action.type](state, action.payload) : state
}

// function fetchCoreJsonFile (file) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path.join(__dirname, 'coreJson', `${file}.json`), 'utf8', (err, data) => {
//       if (err) reject(err)
//       return resolve(JSON.parse(data))
//     })
//   })
// }
