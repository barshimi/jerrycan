import path from 'path'
import fs from 'fs'
import {MODULES_NAME, MODULES} from '../env'

const modulesPath = path.join(process.cwd(), MODULES_NAME)
const filesType = [
  {type: 'rc', configName: '.jerrycanmodulerc'},
  {type: 'json', configName: 'jerrycanmodulerc.json'},
  {type: 'js', configName: 'jerrycanmodulerc.js'}
]
const fetchModulesRcFiles = () => {
  try {
    return fs.readdirSync(modulesPath).filter(checkModuleSrc).reduce((confObj, item) => {
      // if (fs.existsSync(path.join(modulesPath, item, 'middleware')) && fs.statSync(path.join(modulesPath, item, 'middleware')).isDirectory()) fetchMwfilesPath(confObj.mw, modulesPath, item)
      filesType.reduce((flag, file) => {
        if (flag) return true
        const jerrycanConfigPath = path.join(modulesPath, item, file.configName)
        if (fs.existsSync(jerrycanConfigPath)) {
          const configFile = file.type !== 'js' ? JSON.parse(fs.readFileSync(jerrycanConfigPath)) : fs.readFileSync(jerrycanConfigPath)
          const mwDirName = configFile.module.hasOwnProperty('middleware') ? configFile.module.middleware : 'middleware'
          if (fs.existsSync(path.join(modulesPath, item, mwDirName)) && fs.statSync(path.join(modulesPath, item, mwDirName)).isDirectory()) fetchMwfilesPath(confObj.mw, modulesPath, item, mwDirName)
          confObj['confArr'].push(configFile)
          flag = true
        }
        return flag
      }, false)
      return confObj
    }, {confArr: [], mw: {}})
  } catch (e) {
    console.error(e)
    return []
  }
}

const fetchMwfilesPath = (obj, mwPath, moduleName, mwDirName) => {
  return fs.readdirSync(path.join(mwPath, moduleName, mwDirName)).reduce((arr, item) => {
    const splitFile = item.includes('.') ? item.split('.') : ''
    if (Array.isArray(splitFile) && splitFile[1] !== 'js') return
    obj[splitFile[0]] = path.join(moduleName, mwDirName, item)
    return obj
  }, obj)
}

const checkModuleSrc = (item) => {
  const moduleName = path.join(modulesPath, item)
  return fs.statSync(moduleName).isDirectory() && item !== '.git' && item !== 'defaultCore' && MODULES.includes(item)
}

export default fetchModulesRcFiles
