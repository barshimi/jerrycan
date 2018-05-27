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
    return Promise.all([
      constantsCreator(),
      actionsCreator(),
      middlewaresCreator(),
      new ReducerRegistry(reducersCreator())
    ]).then(async (res) => {
      const routes = await routesBuilder(res[3], env)
      return {
        constants: res[0],
        actions: res[1],
        appMiddleware: res[2],
        reducerRegistry: res[3],
        routes: {childRoutes: routes}
      }
    })
  }
  return {
    init: async function () {
      if (!reduxElements) reduxElements = await init()
      return reduxElements
    }
  }
})()
