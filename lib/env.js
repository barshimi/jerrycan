'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const MODULES = exports.MODULES = 'modules';
const NODE_ENV = exports.NODE_ENV = process.env.NODE_ENV || 'development';
const DEFAULTE_ROUTE = exports.DEFAULTE_ROUTE = process.env.DEFAULTE_ROUTE || '';
const API_SERVER = exports.API_SERVER = process.env.API_SERVER || '';
const CONFIG_TYPE = exports.CONFIG_TYPE = process.env.CONFIG_TYPE || 'rc';