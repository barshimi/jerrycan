'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.routesBuilder = routesBuilder;

var _reducersCreator = require('./reducersCreator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routesJson = require('../../../../coreJson/JcRouterConfiguration.json');
const debug = require('debug')('webApp:routeBuilder');

function routesBuilder(registerReducers, env, obj = null) {
  const routeJsonConf = obj || routesJson;

  return (0, _keys2.default)(routeJsonConf).filter(r => r !== '$$_conf').map(route => {
    const routeObj = {
      path: routeJsonConf[route]['$$_conf'].path,
      indexRoute: {
        onEnter: (nextState, replace) => {
          routeJsonConf[route]['$$_conf']['moduleReducers'] && initialModuleReducers(routeJsonConf[route]['$$_conf'], registerReducers, env);
          routeJsonConf[route]['$$_conf']['defaultRoute'] && replace(routeJsonConf[route]['$$_conf']['defaultRoute']);
        }
      },
      getComponent(nextState, cb) {
        import('../../../../modules/' + routeJsonConf[route]['$$_conf'].component).then(component => cb(null, component.default)).catch(err => debug(`Failed to import component ${routeJsonConf[route]['$$_conf'].component} : ${err}`));
      }
    };
    (0, _keys2.default)(routeJsonConf[route]).filter(r => r !== '$$_conf').length && createChildRoutes(routeObj, registerReducers, env, routeJsonConf[route]);
    return routeObj;
  });
}

function createChildRoutes(routeObj, registerReducers, env, routeConf) {
  routeObj['getChildRoutes'] = (partialNextState, cb) => {
    require.ensure([], function (require) {
      cb(null, routesBuilder(registerReducers, env, routeConf));
    });
  };
}

async function initialModuleReducers(routeConf, registerReducers, env) {
  const moduleName = routeConf.component.split('/')[0];
  const { jcModuleReducers, jcInitialReducers } = await _promise2.default.all([fetchConfigFiles(moduleName, '/jcModuleReducers.json'), fetchConfigFiles(moduleName, '/jcInitialReducers.json')]);
  registerReducers.register({ [moduleName]: reduxReducer(jcInitialReducers || {}, (0, _reducersCreator.buildReducerFunc)(jcModuleReducers)) });
  if (env !== 'production' && module.hot) {
    module.hot.accept(['../../../../modules/' + moduleName + '/jcModuleReducers.json', '../../../../modules/' + moduleName + '/jcInitialReducers.json'], () => {
      _promise2.default.all([fetchConfigFiles(moduleName, '/jcModuleReducers.json'), fetchConfigFiles(moduleName, '/jcInitialReducers.json')]).then(res => {
        registerReducers.register({ [moduleName]: reduxReducer(res[1] || {}, res[0]) });
      }).catch(err => {
        console.log(err);
      });
    });
  }
}

function fetchConfigFiles(moduleName, configFile) {
  return new _promise2.default((resolve, reject) => {
    try {
      import('../../../../modules/' + moduleName + configFile).then(module => {
        resolve(module.default ? module.default : module);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function reduxReducer(initialState, reducersMap) {
  return (state = initialState, action) => reducersMap.hasOwnProperty(action.type) ? reducersMap[action.type](state, action.payload) : state;
}