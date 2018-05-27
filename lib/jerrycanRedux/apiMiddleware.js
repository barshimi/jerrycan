'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = apiMiddleware;

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('webApp:APImiddleware');

function apiMiddleware(actions, store) {
  return next => action => {
    if (!action.hasOwnProperty('JCAC')) return next(action);
    return action.JCAC.endPoint.length > 1 ? multipleRequestBuilder(action, store, next) : singleRequestBuilder(action, store, next);
  };
}
// req: JCAC_url | JCAC_query | JCAC_headers
// set default headers with process.env.HEADERS
function buildRequestOptions(action, index = 0) {
  const { endPoint } = action.JCAC;
  const method = endPoint[index].method;
  const headers = (0, _assign2.default)({}, process.env.hasOwnProperty('HEADERS') && process.env.HEADERS.length ? process.env.HEADERS : {}, endPoint[index].hasOwnProperty('headers') ? endPoint[index].headers : {}, action.payload.hasOwnProperty('JCAC_headers') ? action.payload.JCAC_headers : {});
  const query = action.payload.hasOwnProperty('JCAC_query') ? _querystring2.default.stringify(action.payload.JCAC_query) : {};
  const URL = [process.env.hasOwnProperty('API_HOST') && process.env.API_HOST.length ? process.env.API_HOST : '', endPoint[index].url, action.payload.hasOwnProperty('JCAC_url') ? action.payload.JCAC_url : '', action.payload.hasOwnProperty('JCAC_query') ? _querystring2.default.stringify(action.payload.JCAC_query) : '', !checkDataTransformReq(method) ? buildQueryParams(action.payload, query) : ''].join('');
  return (0, _assign2.default)({
    url: URL,
    method: method,
    headers: headers
  }, convertOptions(endPoint.options || {}));
}

function convertOptions(options) {
  return (0, _assign2.default)({
    type: options.type || 'json',
    crossOrigin: options.crossOrigin || true,
    withCredentials: options.credentials || false
  }, options.type === 'json' ? { contentType: 'application/json' } : {});
}

const singleRequestBuilder = (action, store, next) => {
  const { endPoint, request, error, innerFunc } = action.JCAC;
  request.filter(req => req.type).forEach(req => store.dispatch(req));
  const reqOptions = (0, _assign2.default)(buildRequestOptions(action), checkDataTransformReq(endPoint.method) ? { data: (0, _stringify2.default)(reduceDataKeys(action.payload)) } : {});
  (0, _reqwest2.default)(reqOptions).then(res => {
    Object.prototype.toString.call(innerFunc) === '[object Function]' ? next((0, _assign2.default)(action, { payload: innerFunc(res) })) : next((0, _assign2.default)(action, { payload: res }));
  }).fail(err => {
    debug(err);
    error.forEach(action => store.dispatch(action));
  });
};

const multipleRequestBuilder = (action, store, next) => {
  const { endPoint, request, error, innerFunc } = action.JCAC;
  request.filter(req => req.type).forEach(req => store.dispatch(req));
  const keysArr = [];
  _promise2.default.all(endPoint.map((call, i) => {
    if (call.key) keysArr.push(call.key);
    const reqOptions = (0, _assign2.default)(buildRequestOptions(action, i), checkDataTransformReq(endPoint.method) ? { data: (0, _stringify2.default)(reduceDataKeys(action.payload)) } : {});
    return promiseRequest(reqOptions);
  })).then(response => {
    const finalRes = keysArr.length !== response.length ? Object.prototype.toString.call(innerFunc) === '[object Function]' ? innerFunc(response) : response : response.reduce((obj, res, index) => {
      obj[keysArr[index]] = res;
      return obj;
    }, {});
    return next((0, _assign2.default)(action, { payload: finalRes }));
  }).catch(err => {
    debug(err);
    error.forEach(action => store.dispatch(action));
  });
};

const promiseRequest = options => {
  return new _promise2.default((resolve, reject) => {
    return (0, _reqwest2.default)(options).then(res => resolve(res)).fail(err => reject(err));
  });
};

const checkDataTransformReq = method => ['post', 'put', 'patch'].includes(method.toLowerCase());

const buildQueryParams = (data, query) => {
  const dataType = Object.prototype.toString.call(data) === '[object String]';
  return `?${_querystring2.default.stringify(!dataType ? reduceDataKeys(data) : {})}${dataType ? data : ''}`;
};

const reduceDataKeys = data => {
  if (Array.isArray(data)) return {};
  return (0, _keys2.default)(data).filter(key => !key.includes('JCAC')).reduce((obj, key) => {
    obj[key] = data[key];
    return obj;
  });
};