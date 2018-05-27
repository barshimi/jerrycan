'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _env = require('../env');

var _fetchModulesRcFiles = require('./fetchModulesRcFiles');

var _fetchModulesRcFiles2 = _interopRequireDefault(_fetchModulesRcFiles);

var _validateRcFile = require('./validateRcFile');

var _validateRcFile2 = _interopRequireDefault(_validateRcFile);

var _routesBuilder = require('./routesBuilder');

var _routesBuilder2 = _interopRequireDefault(_routesBuilder);

var _middlewareBuilder = require('./middlewareBuilder');

var _middlewareBuilder2 = _interopRequireDefault(_middlewareBuilder);

var _globalStateBuilder = require('./globalStateBuilder');

var _globalStateBuilder2 = _interopRequireDefault(_globalStateBuilder);

var _initialStateBuilder = require('./initialStateBuilder');

var _initialStateBuilder2 = _interopRequireDefault(_initialStateBuilder);

var _writeModuleReducers = require('./writeModuleReducers');

var _writeModuleReducers2 = _interopRequireDefault(_writeModuleReducers);

var _writeCoreConfigurationFile = require('./writeCoreConfigurationFile');

var _writeCoreConfigurationFile2 = _interopRequireDefault(_writeCoreConfigurationFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('webApp:jsonBuilder');

exports.default = async function () {
  try {
    const jerrycanrcObj = await (0, _fetchModulesRcFiles2.default)();
    const jerrycanBuiltObj = await jerrycanrcObj.rcArr.filter(rcFile => _env.MODULES.includes(rcFile.module.name)).reduce((coreObj, rcFile) => {
      if (!(0, _validateRcFile2.default)(rcFile)) throw Error(`Jerrycan ${rcFile.module.name} module file is not valid`);
      _promise2.default.all([(0, _routesBuilder2.default)(rcFile.route, coreObj.router, _env.DEFAULTE_ROUTE), (0, _middlewareBuilder2.default)(rcFile.middlewares, coreObj.middlewares, jerrycanrcObj.mw), (0, _globalStateBuilder2.default)(rcFile.globalCycle, rcFile.module.name, coreObj.globalState), (0, _initialStateBuilder2.default)(rcFile.global_types, coreObj.initialState)]);
      return coreObj;
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
    });
    if (!jerrycanBuiltObj.router.hasOwnProperty('/')) jerrycanBuiltObj.router['/'] = {};
    if (!jerrycanBuiltObj.router['/'].hasOwnProperty('$$_conf')) {
      jerrycanBuiltObj.router['/']['$$_conf'] = { path: '/', component: 'defaultCore/App' };
    }
    if ((0, _keys2.default)(jerrycanBuiltObj.globalState.reducers.moduleReducer).length) await (0, _writeModuleReducers2.default)(jerrycanBuiltObj.globalState.reducers.moduleReducer, jerrycanBuiltObj.router);
    (0, _writeCoreConfigurationFile2.default)([{ obj: jerrycanBuiltObj.middlewares, name: 'jcMiddlewares' }, { obj: jerrycanBuiltObj.router, name: 'jcRouterConfiguration' }, { obj: jerrycanBuiltObj.globalState.constants, name: 'jcConstants' }, { obj: jerrycanBuiltObj.globalState.actions, name: 'jcActions' }, { obj: jerrycanBuiltObj.globalState.actionsInfo, name: 'jcActionsInfo' }, { obj: jerrycanBuiltObj.globalState.reducers.reducers, name: 'jcInitialReducers' }, { obj: jerrycanBuiltObj.initialState.initialReducers, name: 'jcGlobalInitialState' }, { obj: jerrycanBuiltObj.initialState.globalsInfo, name: 'jcGlobalMap' }]);
  } catch (e) {
    debug(e);
  }
};