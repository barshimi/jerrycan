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
const filesType = [{ type: 'rc', configName: '.jerrycanmodulerc' }, { type: 'json', configName: 'jerrycanmodulerc.json' }, { type: 'js', configName: 'jerrycanmodulerc.js' }];
const fetchModulesRcFiles = () => {
  try {
    return _fs2.default.readdirSync(modulesPath).filter(checkModuleSrc).reduce((confObj, item) => {
      // if (fs.existsSync(path.join(modulesPath, item, 'middleware')) && fs.statSync(path.join(modulesPath, item, 'middleware')).isDirectory()) fetchMwfilesPath(confObj.mw, modulesPath, item)
      filesType.reduce((flag, file) => {
        if (flag) return true;
        const jerrycanConfigPath = _path2.default.join(modulesPath, item, file.configName);
        if (_fs2.default.existsSync(jerrycanConfigPath)) {
          const configFile = file.type !== 'js' ? JSON.parse(_fs2.default.readFileSync(jerrycanConfigPath)) : _fs2.default.readFileSync(jerrycanConfigPath);
          const mwDirName = configFile.module.hasOwnProperty('middleware') ? configFile.module.middleware : 'middleware';
          if (_fs2.default.existsSync(_path2.default.join(modulesPath, item, mwDirName)) && _fs2.default.statSync(_path2.default.join(modulesPath, item, mwDirName)).isDirectory()) fetchMwfilesPath(confObj.mw, modulesPath, item, mwDirName);
          confObj['confArr'].push(configFile);
          flag = true;
        }
        return flag;
      }, false);
      return confObj;
    }, { confArr: [], mw: {} });
  } catch (e) {
    console.error(e);
    return [];
  }
};

const fetchMwfilesPath = (obj, mwPath, moduleName, mwDirName) => {
  return _fs2.default.readdirSync(_path2.default.join(mwPath, moduleName, mwDirName)).reduce((arr, item) => {
    const splitFile = item.includes('.') ? item.split('.') : '';
    if (Array.isArray(splitFile) && splitFile[1] !== 'js') return;
    obj[splitFile[0]] = _path2.default.join(moduleName, mwDirName, item);
    return obj;
  }, obj);
};

const checkModuleSrc = item => {
  const moduleName = _path2.default.join(modulesPath, item);
  return _fs2.default.statSync(moduleName).isDirectory() && item !== '.git' && item !== 'defaultCore' && _env.MODULES.includes(item);
};

exports.default = fetchModulesRcFiles;