
export function reduxReducer (initialState, reducersMap) {
  return (state = initialState, action) => reducersMap.hasOwnProperty(action.type) ? reducersMap[action.type](state, action.payload) : state
}
