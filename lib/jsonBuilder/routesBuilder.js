'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routesBuilder = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _utils = require('../utils');

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.set');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('webApp:routesBuilder');

const routesBuilder = exports.routesBuilder = (moduleRoute, coreObj, defaultRouter) => {
  try {
    const urlLocationRoutes = routeToArr(moduleRoute.urlLocation);
    const routePath = moduleRoute.urlLocation.length > 1 ? `/${moduleRoute.urlLocation.replace(/\//g, '.')}` : moduleRoute.urlLocation;
    (0, _assign2.default)(coreObj, (0, _utils.mergeDeep)(coreObj, objResolver(urlLocationRoutes)));
    if (routePath.length === 1) {
      if (coreObj['/'].hasOwnProperty(['$$_conf'])) throw Error(`Route ${moduleRoute.urlLocation} already exist`);
      const defaultRoute = defaultRouter ? { defaultRoute: defaultRouter } : moduleRoute.defaultRoute ? { defaultRoute: moduleRoute.defaultRoute } : {};
      coreObj['/']['$$_conf'] = (0, _assign2.default)({ path: moduleRoute.path, component: moduleRoute.directory_path }, defaultRoute);
    } else {
      if ((0, _keys2.default)((0, _lodash2.default)(coreObj, routePath)).length) throw Error(`Route ${moduleRoute.urlLocation} already exist`);
      (0, _lodash4.default)(coreObj, routePath, { '$$_conf': { path: moduleRoute.path, component: moduleRoute.directory_path } });
    }
    if (moduleRoute.children && Array.isArray(moduleRoute.children)) {
      moduleRoute.children.every(route => {
        routesBuilder(route, coreObj);
      });
    }
  } catch (e) {
    debug(e);
  }
};
/**
 * build nested object form array => ['o', 'z', 'y'] => 'o': { 'z': { 'y': {} } }
 * @param  {array} pathArr [route path as array]
 * @param  {object} obj    [empty object]
 * @return {object}        [nested object]
 */
const objResolver = (pathArr, obj = {}) => {
  pathArr.reduce((prev, curr) => prev[curr] = {}, obj);
  return obj;
};
/**
 * convert url location string to array
 * @param  {string} urlLocation [urlLocation property value]
 * @return {array}
 */
const routeToArr = urlLocation => {
  return urlLocation.length > 1 ? urlLocation.split('/').map((c, i) => !c.length && i !== 0 ? false : !c.length ? '/' : c) : ['/'];
};

exports.default = routesBuilder;