// import fs from 'browserify-fs'
import path from 'path'
const debug = require('debug')('webApp:actionsCreator')

export function actionsCreator () {
  try {
    return Promise.all([fetchCoreJsonFile()])
      .then(res => {
        return res[0].reduce((obj, action) => {
          const passPayload = action.payload || false
          obj[action.actionFnName] = !action.hasOwnProperty('apiCall')
            ? (payload = null) => Object.assign({type: action.actionConst}, passPayload ? {payload: payload} : {})
            : (payload = null) => Object.assign(
              {type: action.actionConst},
              passPayload ? {payload: payload} : {},
              {'JCAC': {
                endPoint: action.apiCall.endPoint,
                request: action.apiCall.request,
                error: action.apiCall.error,
                innerFunc: action.apiCall.innerMW // TODO: load the function and pass it to the middleware throught the action
              }}
            )
          return obj
        }, {})
      })
  } catch (e) {
    debug(e)
  }
}

function fetchCoreJsonFile () {
  return new Promise((resolve, reject) => {
    try {
      import('../../../../coreJson/jcActions.json').then(res => {
        resolve(res.default ? res.default : res)
      })
    } catch (e) {
      reject(e)
    }
  })
}
