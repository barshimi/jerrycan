'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducersRegistry = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * reducer Registry for initial reducers on create store and add new reducers on specific route
 */
class reducersRegistry {
  constructor(initialReducers = {}) {
    this._reducers = initialReducers;
    this._emitChange = null;
  }
  /**
   * register new reducers
   */
  register(newReducers) {
    this._reducers = (0, _assign2.default)(this._reducers, newReducers);
    if (this._emitChange != null) {
      this._emitChange(this.getReducers());
    }
  }
  /**
   * reset all global state to starting point (not sure if it's necessary for projects)
   */
  reset() {
    this._reducers = (0, _assign2.default)({});
    if (this._emitChange != null) {
      this._emitChange(this.getReducers());
    }
  }
  /**
   * remove part of global state
   */
  remove(removeReducers) {
    removeReducers.map(reducer => {
      delete this._reducers[reducer];
    });
    if (this._emitChange != null) {
      this._emitChange(this.getReducers());
    }
  }
  /**
   * get the updated global state
   */
  getReducers() {
    return (0, _assign2.default)({}, this._reducers);
  }
  /**
   * change listener
   */
  setChangeListener(listener) {
    if (this._emitChange != null) {
      throw new Error('Can only set the listener for a reducerRegistry once.');
    }
    this._emitChange = listener;
  }
}
exports.reducersRegistry = reducersRegistry;