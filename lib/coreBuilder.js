#! /usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _nodeEnsure = require('node-ensure');

var _nodeEnsure2 = _interopRequireDefault(_nodeEnsure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  const path = `${process.cwd()}/.jerrycanrc`;
  if (!_fs2.default.existsSync(path)) process.exit(1);
  try {
    const config = JSON.parse(_fs2.default.readFileSync(path, 'utf8'));
    const moduleMethod = `./modulesBuilder/${config.loader}ModuleLoader`; // options git || assets
    // configLoader => rc || json || js
    (0, _nodeEnsure2.default)([moduleMethod], async () => {
      if (config.moduleBuilder) await require(moduleMethod).default(config.modules);
      await require('./modulesBuilder/defaultCoreModule').default(config.view_stack);
      await require('./jsonBuilder/index').default();
    });
  } catch (e) {
    process.exit(1);
  }
})();