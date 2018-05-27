'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _env = require('../env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const modulesPath = _path2.default.join(process.cwd(), _env.MODULES_NAME);
const fetchModulesRcFiles = () => {
  try {
    const fileType = _env.CONFIG_TYPE === 'rc' ? '.jerrycanmodulerc' : _env.CONFIG_TYPE === 'json' ? 'jerrycanmodulerc.json' : 'jerrycanmodulerc.js';
    return _fs2.default.readdirSync(modulesPath).filter(checkModuleSrc).reduce((rcObj, item) => {
      if (_fs2.default.existsSync(_path2.default.join(modulesPath, item, 'middleware')) && _fs2.default.statSync(_path2.default.join(modulesPath, item, 'middleware')).isDirectory()) fetchMwfilesPath(rcObj.mw, modulesPath, item);
      const jerrycanrcPath = _path2.default.join(modulesPath, item, fileType);
      const rcExist = _fs2.default.existsSync(jerrycanrcPath);
      if (rcExist) rcObj['rcArr'].push(_env.CONFIG_TYPE !== 'js' ? JSON.parse(_fs2.default.readFileSync(jerrycanrcPath)) : _fs2.default.readFileSync(jerrycanrcPath));
      return rcObj;
    }, { rcArr: [], mw: {} });
  } catch (e) {
    console.error(e);
    return [];
  }
};

const fetchMwfilesPath = (obj, mwPath, moduleName) => {
  return _fs2.default.readdirSync(_path2.default.join(mwPath, moduleName, 'middleware')).reduce((arr, item) => {
    const splitFile = item.includes('.') ? item.split('.') : '';
    if (Array.isArray(splitFile) && splitFile[1] !== 'js') return;
    obj[splitFile[0]] = _path2.default.join(moduleName, 'middleware', item);
    return obj;
  }, obj);
};

const checkModuleSrc = item => {
  const moduleName = _path2.default.join(modulesPath, item);
  return _fs2.default.statSync(moduleName).isDirectory() && item !== '.git' && item !== 'defaultCore' && _env.MODULES.includes(item);
};

exports.default = fetchModulesRcFiles;