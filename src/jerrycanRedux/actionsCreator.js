const actionJson = require('../../../../coreJson/jcActions.json')
const debug = require('debug')('webApp:actionsCreator')

export function actionsCreator () {
  try {
    return actionJson.reduce((obj, action) => {
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
  } catch (e) {
    debug(e)
  }
}
