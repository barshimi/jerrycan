'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.middlewaresCreator = middlewaresCreator;

var _apiMiddleware = require('./apiMiddleware');

var _apiMiddleware2 = _interopRequireDefault(_apiMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const middlewareJson = require('../../../../coreJson/jcMiddlewares.json');
const debug = require('debug')('webApp:middlewaresCreator');

function middlewaresCreator(actions) {
  try {
    return (0, _keys2.default)(middlewareJson).reduce((obj, mw) => {
      import('../../../../modules/' + middlewareJson[mw][0]).then(middleware => {
        const middlewareFunc = middleware.default ? middleware.default : middleware;
        middlewareJson[mw].shift();
        obj[mw] = middlewareFunc.bind(null, [].concat(actions, ...middlewareJson[mw]));
      });
      return obj;
    }, { 'JCAC': _apiMiddleware2.default.bind(null, actions) });
  } catch (e) {
    debug(e);
  }
}