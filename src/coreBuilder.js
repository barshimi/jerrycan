#! /usr/bin/env node

import fs from 'fs'
import ensure from 'node-ensure'

/**
 * config => {
 *  globalState: redux || mobx => will wrap configuration with the chosen global state manager
 *  view_stack: react || angular => at the moment the library support react but in the future we will wrap any view view_stack
 *             and will render the HTML results.
 *  loader: git || assets => library can clone repo by branch/tag or it can download assets from cdn/S3 etc...
 *  moduleBuilder: true/false => load modules on any node restart
 *  modules: array of all requested modules
 * }
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
(() => {
  const path = `${process.cwd()}/.jerrycanrc`
  if (!fs.existsSync(path)) process.exit(1)
  try {
    const config = JSON.parse(fs.readFileSync(path, 'utf8'))
    const moduleMethod = `./modulesBuilder/${config.loader}ModuleLoader` // options git || assets
    // configLoader => rc || json || js
    ensure([moduleMethod], async () => {
      if (config.moduleBuilder) await require(moduleMethod).default(config.modules)
      await require('./modulesBuilder/defaultCoreModule').default(config.view_stack)
      await require('./jsonBuilder/index').default()
    })
  } catch (e) {
    process.exit(1)
  }
})()
