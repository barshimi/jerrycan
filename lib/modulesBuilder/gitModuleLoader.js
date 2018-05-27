'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (modules) {
  try {
    if (!_fs2.default.existsSync(`${process.cwd()}/${_env.MODULES_NAME}`)) _shelljs2.default.mkdir(_env.MODULES_NAME);
    if (_shelljs2.default.ls('-A', `${_env.MODULES_NAME}/`).length > 1) _shelljs2.default.rm('-rf', `${_env.MODULES_NAME}/*`);
    cloneModules(modules);
  } catch (e) {
    (0, _utils.closeService)('git module builder');
  }
};

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _env = require('../env');

var _utils = require('../utils');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cloneModules = modules => {
  modules.forEach(module => _shelljs2.default.exec(`cd ${_env.MODULES_NAME}/ && git clone ${module}`));
};