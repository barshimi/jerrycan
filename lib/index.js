'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jerrycanRedux = require('./jerrycanRedux');

exports.default = function (env) {
  let reduxElements = null;
  function init() {
    const reducers = new _jerrycanRedux.reducersRegistry((0, _jerrycanRedux.reducersCreator)());
    return {
      constants: (0, _jerrycanRedux.constantsCreator)(),
      actions: (0, _jerrycanRedux.actionsCreator)(),
      // appMiddleware: middlewaresCreator(),
      reducerRegistry: reducers,
      routes: { childRoutes: (0, _jerrycanRedux.routesBuilder)(reducers, env) }
    };
  }
  return {
    init: function () {
      if (!reduxElements) reduxElements = init();
      return reduxElements;
    },
    appMiddleware: async function (actions) {
      const mw = await (0, _jerrycanRedux.middlewaresCreator)(actions);
      return mw;
    }
  };
}(); // TODO: find a way to load stack type