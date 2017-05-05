
var initialState = {
  offset: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_OFFSET':
      return { offset: action.offset }
    default:
      return state
  }
}
