
import {
  MODULES,
  DEFAULTE_ROUTE
} from '../env'
import fetchModulesConfFiles from './fetchModulesConfFiles'
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
    const jerrycanrcObj = await fetchModulesConfFiles()
    const jerrycanBuiltObj = await jerrycanrcObj.confArr.filter(confFile => MODULES.includes(confFile.module.name)).reduce((coreObj, confFile) => {
      if (!validateRcFile(confFile)) throw Error(`Jerrycan ${confFile.module.name} module file is not valid`)
      Promise.all([
        routesBuilder(confFile.route, coreObj.router, DEFAULTE_ROUTE),
        middlewareBuilder(confFile.middlewares, coreObj.middlewares, jerrycanrcObj.mw),
        globalStateBuilder(confFile.globalCycle, confFile.module, coreObj.globalState),
        initialStateBuilder(confFile.global_types, coreObj.initialState)
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
