'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constantsCreator = constantsCreator;
const constJson = require('../../../../coreJson/jcConstants.json');
/**
 * [description]
 * @param  {[type]} constantsArr [description]
 * @return {[type]}              [description]
 */
function constantsCreator() {
  if (!constJson.length) return {};
  return constJson.reduce((constObj, constant) => {
    constObj[constant] = constant;
    return constObj;
  }, {});
}