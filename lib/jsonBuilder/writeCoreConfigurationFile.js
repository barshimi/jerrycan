'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('webApp:writeCoreConfigurationFile');

exports.default = Arr => {
  try {
    if (!Arr.length) throw Error();
    const coreJsonPath = _path2.default.join(process.cwd(), 'coreJson');
    _shelljs2.default.rm('-rf', 'coreJson');
    _shelljs2.default.mkdir('coreJson');
    Arr.forEach(async file => _fs2.default.writeFile(_path2.default.join(coreJsonPath, `${file.name}.json`), (0, _stringify2.default)(file.obj), err => {
      if (err) throw Error(`Error while writing Json file configuration ${file.name}`);
    }));
  } catch (e) {
    debug(e);
  }
};