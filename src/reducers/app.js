
var initialState = {
  isOnline: false,
  uid: undefined,
  deviceId: undefined,
  isLoading: false,
  provider: 'unknown',
  premium:false,
  token:'',
  userType: 'free'
}


export default function app(state = initialState, action ) {
  switch (action.type) {
    default:
    return state
  }
}
