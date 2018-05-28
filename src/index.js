// TODO: find a way to load stack type
import {
  actionsCreator,
  constantsCreator,
  middlewaresCreator,
  reducersRegistry as ReducerRegistry,
  reducersCreator,
  routesBuilder
} from './jerrycanRedux'

export default (function (env) {
  let reduxElements = null
  function init () {
    const reducers = new ReducerRegistry(reducersCreator())
    return {
      constants: constantsCreator(),
      actions: actionsCreator(),
      appMiddleware: middlewaresCreator(),
      reducerRegistry: reducers,
      routes: {childRoutes: routesBuilder(reducers, env)}
    }
  }
  return {
    init: function () {
      if (!reduxElements) reduxElements = init()
      return reduxElements
    }
  }
})()
