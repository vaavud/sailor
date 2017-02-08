
// import firebase from 'firebase'
// import realm from '../store/realm'

let SERVER_URL = 'http://52.30.86.52/apps/sailing/'
import realm from '../store/realm'


export function getSummaryInformation(sessionKey) {
  return new Promise((resolve, reject) => {
    console.log('looking for...', sessionKey)
    let summary = realm.objects('Summary').filtered(`key = "${sessionKey}"`)
    resolve(summary[0])
  })
}


export function getSummaryFromServer(sessionKey) {
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + `m_screen/${sessionKey}`, { method: 'GET' })
      .then(response => response.json())
      .then(responseData => {

        if (responseData.windSpeeds.length === 0) {
          reject()
        }
        else {
          //TODO Save it in cache...
          resolve(responseData)
        }
      })
      .catch(err => {
        console.log(err)
        reject()
      })
  })
}
