const debug = require('debug')('webApp:middlewareBuilder')
/**
 * [middlewareBuilder description]
 * @param  {[type]} configMiddleware [description]
 * @param  {[type]} middleware       [description]
 * @return {[type]}                  [description]
 */
const middlewareBuilder = (configMiddleware, middleware, mwPath) => {
  try {
    return configMiddleware.reduce((mwObj, mw) => {
      if (mwObj.hasOwnProperty(mw.name)) throw new BreakMiddlewareException(mw.name)
      mw.params ? mw.params.unshift(mwPath[mw.name]) : mw.params = [mwPath[mw.name]]
      mwObj[mw.name] = mw.params
      return mwObj
    }, middleware)
  } catch (e) {
    debug(e)
    if (e instanceof BreakMiddlewareException) throw Error(`Middleware name '${e.value}' already exist, please check other modules functionality`)
  }
}

function BreakMiddlewareException (value) {
  this.value = value
}

export default middlewareBuilder

// const fs = require('fs');
// const path = require('path')
// fs.readdirSync('./modules').filter(file => file === 'middleware').forEach(file => {
//   var filePath = path.join('./modules', file);
//   if (!fs.statSync(filePath).isDirectory()) return
//   fs.readdirSync(filePath).forEach(inFile => {
//     const t = require('./modules/' + file  + '/' + inFile)
//     console.log('./modules/' + file  + '/' + inFile)
//   })
//   console.log()
//   // fs.readdirSync()
// })
