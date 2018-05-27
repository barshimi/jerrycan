'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (moduleGlobalTypes, initialState) {
  try {
    moduleGlobalTypes.forEach(global => {
      if (initialState.initialReducers.hasOwnProperty(global.globalName)) throw Error('Global already exist in Initial globals');
      initialState.initialReducers[global.globalName] = global.initialState;
      initialState.globalsInfo[global.globalName] = global.globalType;
    });
  } catch (e) {
    debug(e);
  }
};

const debug = require('debug')('webApp:initialStateBuilder');