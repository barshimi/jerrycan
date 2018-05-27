'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.middlewaresCreator = middlewaresCreator;

var _apiMiddleware = require('./apiMiddleware');

var _apiMiddleware2 = _interopRequireDefault(_apiMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('webApp:middlewaresCreator'); // import path from 'path'
function middlewaresCreator(actions) {
  try {
    return _promise2.default.all([loadJsonConfiguration()]).then(res => {
      return (0, _keys2.default)(res[0]).reduce((obj, mw) => {
        import('../../../../modules/' + res[0][mw][0]).then(middleware => {
          const middlewareFunc = middleware.default ? middleware.default : middleware;
          res[0][mw].shift();
          obj[mw] = middlewareFunc.bind(null, [].concat(actions, ...res[0][mw]));
        });
        return obj;
      }, { 'JCAC': _apiMiddleware2.default.bind(null, actions) });
    });
  } catch (e) {
    debug(e);
  }
}

function loadJsonConfiguration() {
  return new _promise2.default((resolve, reject) => {
    try {
      import('../../../../coreJson/jcMiddlewares.json').then(module => {
        resolve(module.default ? module.default : module);
      });
    } catch (e) {
      reject(e);
    }
  });
}

// function loadMiddlewareFunc () {
//   return new Promise((resolve, reject) => {
//     try {
//       import('../../../../coreJson/jcMiddlewareFunc.json').then(module => {
//         resolve(module.default ? module.default : module)
//       })
//     } catch (e) {
//       reject(e)
//     }
//   })
// }

// function fetchModulesMiddlewares () {
//   return new Promise((resolve, reject) => {
//     try {
//       const files = fs.readdirSync(path.join(__dirname, MODULES_NAME))
//       files.forEach(file => {
//         console.log(file)
//       })
//       // const modulesPath = path.join(__dirname, MODULES_NAME)
//       // /^\.\/(styles|templates|xyz)\/[^\/]+\.js$/
//       // const req = require.context(modulesPath, true, /middlewares\/.+\.js/)
//       // const middlewareObj = req.keys().reduce((obj, key) => {
//       //   const middlewareName = key.split('/').reverse()[0].split('.')[0]
//       //   obj[middlewareName] = require(`../${MODULES_NAME}` + key.slice(1)).default
//       //   return obj
//       // }, {})
//       // resolve(middlewareObj)
//     } catch (e) {
//       reject(e)
//     }
//   })
// }