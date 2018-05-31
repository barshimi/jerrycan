import path from 'path'
import fs from 'fs'
// import {CONFIG_TYPE, MODULES_NAME, MODULES} from '../env'
import {MODULES_NAME, MODULES} from '../env'

const modulesPath = path.join(process.cwd(), MODULES_NAME)
const filesType = [
  {type: 'rc', configName: '.jerrycanmodulerc'},
  {type: 'json', configName: 'jerrycanmodulerc.json'},
  {type: 'js', configName: 'jerrycanmodulerc.js'}
]
const fetchModulesRcFiles = () => {
  try {
    // const fileType = CONFIG_TYPE === 'rc' ? '.jerrycanmodulerc' : CONFIG_TYPE === 'json' ? 'jerrycanmodulerc.json' : 'jerrycanmodulerc.js'
    return fs.readdirSync(modulesPath).filter(checkModuleSrc).reduce((confObj, item) => {
      if (fs.existsSync(path.join(modulesPath, item, 'middleware')) && fs.statSync(path.join(modulesPath, item, 'middleware')).isDirectory()) fetchMwfilesPath(confObj.mw, modulesPath, item)
      filesType.reduce((flag, file) => {
        if (flag) return true
        const jerrycanConfigPath = path.join(modulesPath, item, file.configName)
        if (fs.existsSync(jerrycanConfigPath)) {
          confObj['confArr'].push(file.type !== 'js' ? JSON.parse(fs.readFileSync(jerrycanConfigPath)) : fs.readFileSync(jerrycanConfigPath))
          flag = true
        }
        return flag
      }, false)
      // const jerrycanrcPath = path.join(modulesPath, item, fileType)
      // const rcExist = fs.existsSync(jerrycanrcPath)
      // if (rcExist) confObj['confArr'].push(CONFIG_TYPE !== 'js' ? JSON.parse(fs.readFileSync(jerrycanrcPath)) : fs.readFileSync(jerrycanrcPath))
      return confObj
    }, {confArr: [], mw: {}})
  } catch (e) {
    console.error(e)
    return []
  }
}

const fetchMwfilesPath = (obj, mwPath, moduleName) => {
  return fs.readdirSync(path.join(mwPath, moduleName, 'middleware')).reduce((arr, item) => {
    const splitFile = item.includes('.') ? item.split('.') : ''
    if (Array.isArray(splitFile) && splitFile[1] !== 'js') return
    obj[splitFile[0]] = path.join(moduleName, 'middleware', item)
    return obj
  }, obj)
}

const checkModuleSrc = (item) => {
  const moduleName = path.join(modulesPath, item)
  return fs.statSync(moduleName).isDirectory() && item !== '.git' && item !== 'defaultCore' && MODULES.includes(item)
}

export default fetchModulesRcFiles
