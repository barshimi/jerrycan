'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _jerrycanRedux = require('./jerrycanRedux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (env) {
  let reduxElements = null;
  function init() {
    return _promise2.default.all([(0, _jerrycanRedux.constantsCreator)(), (0, _jerrycanRedux.actionsCreator)(), (0, _jerrycanRedux.middlewaresCreator)(), new _jerrycanRedux.reducersRegistry((0, _jerrycanRedux.reducersCreator)())]).then(async res => {
      const routes = await (0, _jerrycanRedux.routesBuilder)(res[3], env);
      return {
        constants: res[0],
        actions: res[1],
        appMiddleware: res[2],
        reducerRegistry: res[3],
        routes: { childRoutes: routes }
      };
    });
  }
  return {
    init: async function () {
      if (!reduxElements) reduxElements = await init();
      return reduxElements;
    }
  };
}(); // TODO: find a way to load stack type