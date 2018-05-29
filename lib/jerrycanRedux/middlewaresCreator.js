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

async function middlewaresCreator(actions) {
  try {
    const apiMw = _apiMiddleware2.default.bind(null, actions);
    return (0, _keys2.default)(middlewareJson).reduce(async (arr, mw) => {
      const middlewareFunc = await import('../../../../modules/' + middlewareJson[mw][0]).then(middleware => middleware.default ? middleware.default : middleware);
      middlewareJson[mw].shift();
      const func = middlewareFunc.bind(null, [].concat(actions, ...middlewareJson[mw]));
      arr.push(func);
      return arr;
    }, [apiMw]);
  } catch (e) {
    debug(e);
  }
}

// export function middlewaresCreator (actions) {
//   try {
//     return Object.keys(middlewareJson)
//       .reduce((obj, mw) => {
//         import('../../../../modules/' + middlewareJson[mw][0]).then(middleware => {
//           const middlewareFunc = middleware.default ? middleware.default : middleware
//           middlewareJson[mw].shift()
//           obj[mw] = middlewareFunc.bind(null, [].concat(actions, ...middlewareJson[mw]))
//         })
//         return obj
//       }, {'JCAC': APImiddleware.bind(null, actions)})
//   } catch (e) {
//     debug(e)
//   }
// }