
// import firebase from 'firebase'
// import realm from '../store/realm'

let SERVER_URL = 'http://52.30.86.52/apps/sailing/'

export function getSummaryInformation(sessionKey) {
  return new Promise((resolve, reject) => {

    fetch(SERVER_URL + `m_screen/${sessionKey}`, { method: 'GET' })
      .then(response => response.json())
      .then(responseData => {
        resolve(responseData)
      })
      .catch(err => {
        console.log(err)
        reject()
      })
  })
}