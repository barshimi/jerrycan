import shell from 'shelljs'
import path from 'path'
import fs from 'fs'

const debug = require('debug')('webApp:writeCoreConfigurationFile')

export default (Arr) => {
  try {
    if (!Arr.length) throw Error()
    const coreJsonPath = path.join(process.cwd(), 'coreJson')
    shell.rm('-rf', 'coreJson')
    shell.mkdir('coreJson')
    Arr.forEach(async file => fs.writeFile(path.join(coreJsonPath, `${file.name}.json`), JSON.stringify(file.obj), err => {
      if (err) throw Error(`Error while writing Json file configuration ${file.name}`)
    }))
  } catch (e) {
    debug(e)
  }
}
