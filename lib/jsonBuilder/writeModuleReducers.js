'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = function (moduleReducers, router) {
  try {
    (0, _keys2.default)(moduleReducers).every(reducers => {
      const GlobalPath = _path2.default.join(process.cwd(), _env.MODULES_NAME, reducers, 'jcModuleReducers.json');
      _shelljs2.default.rm(GlobalPath);
      _fs2.default.writeFile(GlobalPath, (0, _stringify2.default)(moduleReducers[reducers]), err => {
        if (err) throw Error('Error on writing module reducers Json file');
      });
      router['/'][reducers]['$$_conf']['moduleReducers'] = true;
    });
  } catch (e) {
    debug(e);
  }
};

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _env = require('../env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('webApp:writeModulereducers');