import shell from 'shelljs'
import path from 'path'
import fs from 'fs'
import {MODULES_NAME} from '../env'

const debug = require('debug')('webApp:writeModulereducers')

export default function (moduleReducers, router) {
  try {
    Object.keys(moduleReducers).every(reducers => {
      const GlobalPath = path.join(process.cwd(), MODULES_NAME, reducers, 'jcModuleReducers.json')
      shell.rm(GlobalPath)
      fs.writeFile(GlobalPath, JSON.stringify(moduleReducers[reducers]), err => {
        if (err) throw Error('Error on writing module reducers Json file')
      })
      router['/'][reducers]['$$_conf']['moduleReducers'] = true
    })
  } catch (e) {
    debug(e)
  }
}
