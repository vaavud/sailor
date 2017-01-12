import {DISPLAY_ERROR} from '../constants/utils'


export function showError(error) {
  return (dispatch, getState) => {
    dispatch({type:DISPLAY_ERROR, msg:error.msg, title:error.title, errorCode: -1})
  }
}
