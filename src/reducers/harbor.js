
import { HARBOR_LOADED, NO_HARBOR, FORECAST_LOADED, PROFILE_LOADED } from '../constants/harbor'
import { LOGOUT } from '../constants/auth'


var initialState = {
  directions: undefined,
  location: undefined,
  forecast: undefined,
  windMin: 0,
  windMax: 0,
  name: undefined,
  loading: true,
  key: undefined
}

export default function harbor(state = initialState, action) {
  switch (action.type) {
    case NO_HARBOR:
      return { ...state, loading: false }
    case HARBOR_LOADED:
      return {
        ...state,
        loading: false,
        directions: action.directions,
        name: action.name,
        location: action.location,
        key: action.key
      }
    case FORECAST_LOADED:
      return { ...state, forecast: action.forecast }
    case PROFILE_LOADED:
      return { ...state, windMax: action.windMax, windMin: action.windMin }
    case LOGOUT:
      return { ...state, ...initialState }
    default:
      return state
  }
}
