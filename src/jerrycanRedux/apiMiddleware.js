import querystring from 'querystring'
import Reqwest from 'reqwest'

const debug = require('debug')('webApp:APImiddleware')

export default function apiMiddleware (actions, store) {
  return (next) => (action) => {
    if (!action.hasOwnProperty('JCAC')) return next(action)
    return action.JCAC.endPoint.length > 1 ? multipleRequestBuilder(action, store, next) : singleRequestBuilder(action, store, next)
  }
}
// req: JCAC_url | JCAC_query | JCAC_headers
// set default headers with process.env.HEADERS
function buildRequestOptions (action, index = 0) {
  const {endPoint} = action.JCAC
  const method = endPoint[index].method
  const headers = Object.assign(
    {},
    process.env.hasOwnProperty('HEADERS') && process.env.HEADERS.length ? process.env.HEADERS : {},
    endPoint[index].hasOwnProperty('headers') ? endPoint[index].headers : {},
    action.payload.hasOwnProperty('JCAC_headers') ? action.payload.JCAC_headers : {}
  )
  const query = action.payload.hasOwnProperty('JCAC_query') ? querystring.stringify(action.payload.JCAC_query) : {}
  const URL = [
    process.env.hasOwnProperty('API_HOST') && process.env.API_HOST.length ? process.env.API_HOST : '',
    endPoint[index].url,
    action.payload.hasOwnProperty('JCAC_url') ? action.payload.JCAC_url : '',
    action.payload.hasOwnProperty('JCAC_query') ? querystring.stringify(action.payload.JCAC_query) : '',
    !checkDataTransformReq(method) ? buildQueryParams(action.payload, query) : ''
  ].join('')
  return Object.assign({
    url: URL,
    method: method,
    headers: headers
  }, convertOptions(endPoint.options || {}))
}

function convertOptions (options) {
  return Object.assign({
    type: options.type || 'json',
    crossOrigin: options.crossOrigin || true,
    withCredentials: options.credentials || false
  }, options.type === 'json' ? {contentType: 'application/json'} : {})
}

const singleRequestBuilder = (action, store, next) => {
  const {endPoint, request, error, innerFunc} = action.JCAC
  request.filter(req => req.type).forEach(req => store.dispatch(req))
  const reqOptions = Object.assign(
    buildRequestOptions(action),
    checkDataTransformReq(endPoint.method) ? {data: JSON.stringify(reduceDataKeys(action.payload))} : {}
  )
  Reqwest(reqOptions)
    .then(res => {
      Object.prototype.toString.call(innerFunc) === '[object Function]'
        ? next(Object.assign(action, {payload: innerFunc(res)}))
        : next(Object.assign(action, {payload: res}))
    })
    .fail(err => {
      debug(err)
      error.forEach(action => store.dispatch(action))
    })
}

const multipleRequestBuilder = (action, store, next) => {
  const {endPoint, request, error, innerFunc} = action.JCAC
  request.filter(req => req.type).forEach(req => store.dispatch(req))
  const keysArr = []
  Promise.all(endPoint.map((call, i) => {
    if (call.key) keysArr.push(call.key)
    const reqOptions = Object.assign(
      buildRequestOptions(action, i),
      checkDataTransformReq(endPoint.method) ? {data: JSON.stringify(reduceDataKeys(action.payload))} : {}
    )
    return promiseRequest(reqOptions)
  }))
    .then(response => {
      const finalRes = keysArr.length !== response.length
        ? Object.prototype.toString.call(innerFunc) === '[object Function]' ? innerFunc(response) : response
        : response.reduce((obj, res, index) => {
          obj[keysArr[index]] = res
          return obj
        }, {})
      return next(Object.assign(action, {payload: finalRes}))
    })
    .catch(err => {
      debug(err)
      error.forEach(action => store.dispatch(action))
    })
}

const promiseRequest = (options) => {
  return new Promise((resolve, reject) => {
    return Reqwest(options)
      .then(res => resolve(res))
      .fail(err => reject(err))
  })
}

const checkDataTransformReq = (method) => ['post', 'put', 'patch'].includes(method.toLowerCase())

const buildQueryParams = (data, query) => {
  const dataType = Object.prototype.toString.call(data) === '[object String]'
  return `?${querystring.stringify(!dataType ? reduceDataKeys(data) : {})}${dataType ? data : ''}`
}

const reduceDataKeys = (data) => {
  if (Array.isArray(data)) return {}
  return Object.keys(data).filter(key => !key.includes('JCAC')).reduce((obj, key) => {
    obj[key] = data[key]
    return obj
  })
}
