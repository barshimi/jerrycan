import APImiddleware from './apiMiddleware'
const middlewareJson = require('../../../../coreJson/jcMiddlewares.json')
const debug = require('debug')('webApp:middlewaresCreator')

export async function middlewaresCreator (actions) {
  try {
    const apiMw = APImiddleware.bind(null, actions)
    return Object.keys(middlewareJson)
      .reduce(async (arr, mw) => {
        const middlewareFunc = await import('../../../../modules/' + middlewareJson[mw][0]).then(middleware => middleware.default ? middleware.default : middleware)
        middlewareJson[mw].shift()
        const func = middlewareFunc.bind(null, [].concat(actions, ...middlewareJson[mw]))
        arr.push(func)
        return arr
      }, [apiMw])
  } catch (e) {
    debug(e)
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
