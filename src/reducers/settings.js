
import { SETTINGS_LOADED } from '../constants/settings'

var initialState = {
  timeInterval: undefined,
  windSpeed: undefined,
  direction: undefined,
  temperature: undefined,
  colorExplanation: true
}

export default function settings(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_LOADED:
      return {
        ...state,
        timeInterval: action.settings.timeInterval,
        windSpeed: action.settings.windSpeed,
        direction: action.settings.direction,
        temperature: action.settings.temperature,
        colorExplanation: action.settings.colorExplanation
      }
    default:
      return state
  }
}



