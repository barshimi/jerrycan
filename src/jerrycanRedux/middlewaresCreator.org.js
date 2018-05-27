// import path from 'path'
import APImiddleware from './apiMiddleware'

const debug = require('debug')('webApp:middlewaresCreator')

export function middlewaresCreator (actions) {
  try {
    return Promise.all([loadJsonConfiguration(), loadMiddlewareFunc()])
      .then(res => {
        return Object.keys(res[0])
          .reduce((obj, mw) => {
            obj[mw] = eval(res[1][mw]).bind(null, [].concat(actions, ...res[0][mw]))
            return obj
          }, {'JCAC': APImiddleware.bind(null, actions)})
      })
  } catch (e) {
    debug(e)
  }
}

function loadJsonConfiguration () {
  return new Promise((resolve, reject) => {
    try {
      import('../../../../coreJson/jcMiddlewares.json').then(module => {
        resolve(module.default ? module.default : module)
      })
    } catch (e) {
      reject(e)
    }
  })
}

function loadMiddlewareFunc () {
  return new Promise((resolve, reject) => {
    try {
      import('../../../../coreJson/jcMiddlewareFunc.json').then(module => {
        resolve(module.default ? module.default : module)
      })
    } catch (e) {
      reject(e)
    }
  })
}

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
