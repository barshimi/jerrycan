import path from 'path'
import fs from 'fs'
import {CONFIG_TYPE, MODULES_NAME, MODULES} from '../env'

const modulesPath = path.join(process.cwd(), MODULES_NAME)
const fetchModulesRcFiles = () => {
  try {
    const fileType = CONFIG_TYPE === 'rc' ? '.jerrycanmodulerc' : CONFIG_TYPE === 'json' ? 'jerrycanmodulerc.json' : 'jerrycanmodulerc.js'
    return fs.readdirSync(modulesPath).filter(checkModuleSrc).reduce((rcObj, item) => {
      if (fs.existsSync(path.join(modulesPath, item, 'middleware')) && fs.statSync(path.join(modulesPath, item, 'middleware')).isDirectory()) fetchMwfilesPath(rcObj.mw, modulesPath, item)
      const jerrycanrcPath = path.join(modulesPath, item, fileType)
      const rcExist = fs.existsSync(jerrycanrcPath)
      if (rcExist) rcObj['rcArr'].push(CONFIG_TYPE !== 'js' ? JSON.parse(fs.readFileSync(jerrycanrcPath)) : fs.readFileSync(jerrycanrcPath))
      return rcObj
    }, {rcArr: [], mw: {}})
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
