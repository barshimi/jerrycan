
import shell from 'shelljs'
import {MODULES_NAME} from '../env'
import {closeService} from '../utils'
import fs from 'fs'

export default function (modules) {
  try {
    if (!fs.existsSync(`${process.cwd()}/${MODULES_NAME}`)) shell.mkdir(MODULES_NAME)
    if (shell.ls('-A', `${MODULES_NAME}/`).length > 1) shell.rm('-rf', `${MODULES_NAME}/*`)
    cloneModules(modules)
  } catch (e) {
    closeService('git module builder')
  }
}

const cloneModules = (modules) => {
  modules.forEach(module => shell.exec(`cd ${MODULES_NAME}/ && git clone ${module}`))
}
