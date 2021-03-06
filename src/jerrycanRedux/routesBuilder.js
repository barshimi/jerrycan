import {buildReducerFunc} from './reducersCreator'
const routesJson = require('../../../../coreJson/JcRouterConfiguration.json')
const debug = require('debug')('webApp:routeBuilder')

export function routesBuilder (registerReducers, env, obj = null) {
  const routeJsonConf = obj || routesJson

  return Object.keys(routeJsonConf)
    .filter(r => r !== '$$_conf')
    .map(route => {
      const routeObj = {
        path: routeJsonConf[route]['$$_conf'].path,
        indexRoute: {
          onEnter: (nextState, replace) => {
            routeJsonConf[route]['$$_conf']['moduleReducers'] && initialModuleReducers(routeJsonConf[route]['$$_conf'], registerReducers, env)
            routeJsonConf[route]['$$_conf']['defaultRoute'] && replace(routeJsonConf[route]['$$_conf']['defaultRoute'])
          }
        },
        getComponent (nextState, cb) {
          import('../../../../modules/' + routeJsonConf[route]['$$_conf'].component)
            .then(component => cb(null, component.default))
            .catch(err => debug(`Failed to import component ${routeJsonConf[route]['$$_conf'].component} : ${err}`))
        }
      }
      Object.keys(routeJsonConf[route]).filter(r => r !== '$$_conf').length && createChildRoutes(routeObj, registerReducers, env, routeJsonConf[route])
      return routeObj
    })
}

function createChildRoutes (routeObj, registerReducers, env, routeConf) {
  routeObj['getChildRoutes'] = (partialNextState, cb) => {
    require.ensure([], function (require) {
      cb(null, routesBuilder(registerReducers, env, routeConf))
    })
  }
}

async function initialModuleReducers (routeConf, registerReducers, env) {
  const moduleName = routeConf.component.split('/')[0]
  const {jcModuleReducers, jcInitialReducers} = await Promise.all([
    fetchConfigFiles(moduleName, '/jcModuleReducers.json'),
    fetchConfigFiles(moduleName, '/jcInitialReducers.json')
  ])
  registerReducers.register({[moduleName]: reduxReducer(jcInitialReducers || {}, buildReducerFunc(jcModuleReducers))})
  if (env !== 'production' && module.hot) {
    module.hot.accept(['../../../../modules/' + moduleName + '/jcModuleReducers.json', '../../../../modules/' + moduleName + '/jcInitialReducers.json'], () => {
      Promise.all([
        fetchConfigFiles(moduleName, '/jcModuleReducers.json'),
        fetchConfigFiles(moduleName, '/jcInitialReducers.json')
      ]).then(res => {
        registerReducers.register({[moduleName]: reduxReducer(res[1] || {}, res[0])})
      }).catch(err => { console.log(err) })
    })
  }
}

function fetchConfigFiles (moduleName, configFile) {
  return new Promise((resolve, reject) => {
    try {
      import('../../../../modules/' + moduleName + configFile).then(module => {
        resolve(module.default ? module.default : module)
      })
    } catch (e) {
      reject(e)
    }
  })
}

function reduxReducer (initialState, reducersMap) {
  return (state = initialState, action) => reducersMap.hasOwnProperty(action.type) ? reducersMap[action.type](state, action.payload) : state
}
