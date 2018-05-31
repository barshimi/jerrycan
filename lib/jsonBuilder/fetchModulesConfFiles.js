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
// import {CONFIG_TYPE, MODULES_NAME, MODULES} from '../env'

const filesType = [{ type: 'rc', configName: '.jerrycanmodulerc' }, { type: 'json', configName: 'jerrycanmodulerc.json' }, { type: 'js', configName: 'jerrycanmodulerc.js' }];
const fetchModulesRcFiles = () => {
  try {
    // const fileType = CONFIG_TYPE === 'rc' ? '.jerrycanmodulerc' : CONFIG_TYPE === 'json' ? 'jerrycanmodulerc.json' : 'jerrycanmodulerc.js'
    return _fs2.default.readdirSync(modulesPath).filter(checkModuleSrc).reduce((confObj, item) => {
      if (_fs2.default.existsSync(_path2.default.join(modulesPath, item, 'middleware')) && _fs2.default.statSync(_path2.default.join(modulesPath, item, 'middleware')).isDirectory()) fetchMwfilesPath(confObj.mw, modulesPath, item);
      filesType.reduce((flag, file) => {
        if (flag) return true;
        const jerrycanConfigPath = _path2.default.join(modulesPath, item, file.configName);
        if (_fs2.default.existsSync(jerrycanConfigPath)) {
          confObj['confArr'].push(file.type !== 'js' ? JSON.parse(_fs2.default.readFileSync(jerrycanConfigPath)) : _fs2.default.readFileSync(jerrycanConfigPath));
          flag = true;
        }
        return flag;
      }, false);
      // const jerrycanrcPath = path.join(modulesPath, item, fileType)
      // const rcExist = fs.existsSync(jerrycanrcPath)
      // if (rcExist) confObj['confArr'].push(CONFIG_TYPE !== 'js' ? JSON.parse(fs.readFileSync(jerrycanrcPath)) : fs.readFileSync(jerrycanrcPath))
      return confObj;
    }, { confArr: [], mw: {} });
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