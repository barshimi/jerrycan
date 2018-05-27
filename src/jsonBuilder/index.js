
import {
  MODULES,
  DEFAULTE_ROUTE
} from '../env'
import fetchModulesRcFiles from './fetchModulesRcFiles'
import validateRcFile from './validateRcFile'
import routesBuilder from './routesBuilder'
import middlewareBuilder from './middlewareBuilder'
import globalStateBuilder from './globalStateBuilder'
import initialStateBuilder from './initialStateBuilder'
import writeModuleReducers from './writeModuleReducers'
import writeCoreConfigurationFile from './writeCoreConfigurationFile'

const debug = require('debug')('webApp:jsonBuilder')

export default async function () {
  try {
    const jerrycanrcObj = await fetchModulesRcFiles()
    const jerrycanBuiltObj = await jerrycanrcObj.rcArr.filter(rcFile => MODULES.includes(rcFile.module.name)).reduce((coreObj, rcFile) => {
      if (!validateRcFile(rcFile)) throw Error(`Jerrycan ${rcFile.module.name} module file is not valid`)
      Promise.all([
        routesBuilder(rcFile.route, coreObj.router, DEFAULTE_ROUTE),
        middlewareBuilder(rcFile.middlewares, coreObj.middlewares, jerrycanrcObj.mw),
        globalStateBuilder(rcFile.globalCycle, rcFile.module.name, coreObj.globalState),
        initialStateBuilder(rcFile.global_types, coreObj.initialState)
      ])
      return coreObj
    }, {
      router: {},
      middlewares: {},
      globalState: {
        constants: [],
        actions: [],
        actionsInfo: {},
        reducers: {
          moduleReducer: {},
          reducers: [],
          moduleReducersMap: []
        }
      },
      initialState: {
        initialReducers: {},
        globalsInfo: {}
      }
    })
    if (!jerrycanBuiltObj.router.hasOwnProperty('/')) jerrycanBuiltObj.router['/'] = {}
    if (!jerrycanBuiltObj.router['/'].hasOwnProperty('$$_conf')) {
      jerrycanBuiltObj.router['/']['$$_conf'] = {path: '/', component: 'defaultCore/App'}
    }
    if (Object.keys(jerrycanBuiltObj.globalState.reducers.moduleReducer).length) await writeModuleReducers(jerrycanBuiltObj.globalState.reducers.moduleReducer, jerrycanBuiltObj.router)
    writeCoreConfigurationFile([
      {obj: jerrycanBuiltObj.middlewares, name: 'jcMiddlewares'},
      {obj: jerrycanBuiltObj.router, name: 'jcRouterConfiguration'},
      {obj: jerrycanBuiltObj.globalState.constants, name: 'jcConstants'},
      {obj: jerrycanBuiltObj.globalState.actions, name: 'jcActions'},
      {obj: jerrycanBuiltObj.globalState.actionsInfo, name: 'jcActionsInfo'},
      {obj: jerrycanBuiltObj.globalState.reducers.reducers, name: 'jcInitialReducers'},
      {obj: jerrycanBuiltObj.initialState.initialReducers, name: 'jcGlobalInitialState'},
      {obj: jerrycanBuiltObj.initialState.globalsInfo, name: 'jcGlobalMap'}
    ])
  } catch (e) {
    debug(e)
  }
}
