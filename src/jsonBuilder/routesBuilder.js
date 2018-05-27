import {mergeDeep} from '../utils'
import get from 'lodash.get'
import set from 'lodash.set'
const debug = require('debug')('webApp:routesBuilder')

export const routesBuilder = (moduleRoute, coreObj, defaultRouter) => {
  try {
    const urlLocationRoutes = routeToArr(moduleRoute.urlLocation)
    const routePath = moduleRoute.urlLocation.length > 1 ? `/${moduleRoute.urlLocation.replace(/\//g, '.')}` : moduleRoute.urlLocation
    Object.assign(coreObj, mergeDeep(coreObj, objResolver(urlLocationRoutes)))
    if (routePath.length === 1) {
      if (coreObj['/'].hasOwnProperty(['$$_conf'])) throw Error(`Route ${moduleRoute.urlLocation} already exist`)
      const defaultRoute = defaultRouter ? {defaultRoute: defaultRouter} : moduleRoute.defaultRoute ? {defaultRoute: moduleRoute.defaultRoute} : {}
      coreObj['/']['$$_conf'] = Object.assign({path: moduleRoute.path, component: moduleRoute.directory_path}, defaultRoute)
    } else {
      if (Object.keys(get(coreObj, routePath)).length) throw Error(`Route ${moduleRoute.urlLocation} already exist`)
      set(coreObj, routePath, {'$$_conf': {path: moduleRoute.path, component: moduleRoute.directory_path}})
    }
    if (moduleRoute.children && Array.isArray(moduleRoute.children)) {
      moduleRoute.children.every(route => {
        routesBuilder(route, coreObj)
      })
    }
  } catch (e) {
    debug(e)
  }
}
/**
 * build nested object form array => ['o', 'z', 'y'] => 'o': { 'z': { 'y': {} } }
 * @param  {array} pathArr [route path as array]
 * @param  {object} obj    [empty object]
 * @return {object}        [nested object]
 */
const objResolver = (pathArr, obj = {}) => {
  pathArr.reduce((prev, curr) => prev[curr] = {}, obj)
  return obj
}
/**
 * convert url location string to array
 * @param  {string} urlLocation [urlLocation property value]
 * @return {array}
 */
const routeToArr = (urlLocation) => {
  return urlLocation.length > 1 ? urlLocation.split('/').map((c, i) => !c.length && i !== 0 ? false : !c.length ? '/' : c) : ['/']
}

export default routesBuilder
