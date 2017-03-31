
// import firebase from 'firebase'
// import realm from '../store/realm'

import realm from '../store/realm'

let SERVER_URL = 'https://apps-dev.vaavud.com/sailing/'

export function getSummaryInformation(sessionKey) {
  return new Promise((resolve, reject) => {
    let summary = realm.objects('Summary').filtered(`key = "${sessionKey}"`)
    if (summary[0]) {

      let s = summary[0]


      console.log('summary from chache',s )

      let speeds = []
      let directions = []
      let locations = []

      for (let index in s.speeds) {
        speeds.push(s.speeds[index])
      }

      for (let index in s.directions) {
        directions.push(s.directions[index])
      }

      for (let index in s.locations) {
        locations.push(s.locations[index])
      }

      let _summary = {
        windSpeeds: speeds,
        locations: locations,
        windDirections: directions,
        windMax: s.windMax,
        windMin: s.windMin
      }

      resolve(_summary)
    }
    else {
      getSummaryFromServer(sessionKey).then(session => {
        resolve(session)
      }).catch(err => reject(err))
    }
  })
}


function getSummaryFromServer(sessionKey) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}m-screen/${sessionKey}`)
      .then(response => response.json())
      .then(responseData => {

        console.log('from server', responseData)

        if ('err' in responseData) {
          reject()
        }
        else {
          if (responseData.windSpeeds.length === 0) {
            reject()
          }
          else {
            resolve(responseData)
          }
        }
      })
      .catch(err => {
        console.log(err)
        reject()
      })
  })
}
