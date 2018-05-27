"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduxReducer = reduxReducer;
function reduxReducer(initialState, reducersMap) {
  return (state = initialState, action) => reducersMap.hasOwnProperty(action.type) ? reducersMap[action.type](state, action.payload) : state;
}