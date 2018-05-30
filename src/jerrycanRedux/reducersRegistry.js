
/**
 * reducer Registry for initial reducers on create store and add new reducers on specific route
 */
export class reducersRegistry {
  constructor (initialReducers = {}) {
    this._reducers = initialReducers
    this._emitChange = null
  }
  /**
   * register new reducers
   */
  register (newReducers) {
    this._reducers = Object.assign(this._reducers, newReducers)
    if (this._emitChange != null) {
      this._emitChange(this.getReducers())
    }
  }
  /**
   * reset all global state to starting point (not sure if it's necessary for projects)
   */
  reset () {
    this._reducers = Object.assign({})
    if (this._emitChange != null) {
      this._emitChange(this.getReducers())
    }
  }
  /**
   * remove part of global state
   */
  remove (removeReducers) {
    removeReducers.map(reducer => {
      delete this._reducers[reducer]
    })
    if (this._emitChange != null) {
      this._emitChange(this.getReducers())
    }
  }
  /**
   * get the updated global state
   */
  getReducers () { return Object.assign({}, this._reducers) }
  /**
   * change listener
   */
  setChangeListener (listener) {
    if (this._emitChange != null) {
      throw new Error('Can only set the listener for a reducerRegistry once.')
    }
    this._emitChange = listener
  }
}
