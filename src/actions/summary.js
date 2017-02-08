
// import firebase from 'firebase'
// import realm from '../store/realm'

let SERVER_URL = 'http://52.30.86.52/apps/sailing/'
import realm from '../store/realm'


export function getSummaryInformation(sessionKey) {
  return new Promise((resolve, reject) => {

    console.log('looking for...', sessionKey)
    let summary = realm.objects('Summary').filtered(`key = "${sessionKey}"`)

    if (summary[0]) {
      resolve(summary[0])
    }
    else {
      console.log('check from server')
    }

    // fetch(SERVER_URL + `m_screen/${sessionKey}`, { method: 'GET' })
    //   .then(response => response.json())
    //   .then(responseData => {
    //     resolve(responseData)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //     reject()
    //   })
  })
}