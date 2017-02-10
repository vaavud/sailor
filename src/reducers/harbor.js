
import { HARBOR_LOADED, NO_HARBOR, FORECAST_LOADED, PROFILE_LOADED, FORECAST_FAILD } from '../constants/harbor'
import { LOGOUT } from '../constants/auth'


var initialState = {
  directions: undefined,
  location: undefined,
  forecast: undefined,
  windMin: 5,
  windMax: 10,
  name: undefined,
  loading: true,
  key: undefined,
  forecastFaild: false
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
    case FORECAST_LOADED:
      return { ...state, forecast: action.forecast }
    case FORECAST_FAILD:
      return { ...state, forecastFaild: true }
    case LOGOUT:
      return { ...state, ...initialState }
    default:
      return state
  }
}
