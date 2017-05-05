
var initialState = {
  data: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_OFFSET':
      return { data: action.data }
    default:
      return state
  }
}
