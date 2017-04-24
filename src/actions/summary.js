
// import firebase from 'firebase'
// import realm from '../store/realm'

import realm from '../store/realm'

let SERVER_URL = 'https://apps-dev.vaavud.com/sailing/'

export function getSummaryInformation(sessionKey) {
  return new Promise((resolve, reject) => {
    let summary = realm.objects('Summary').filtered(`key = "${sessionKey}"`)
    if (summary[0]) {

      console.log('summary from server...', sessionKey)

      let { speeds, directions, locations, windMax, windMin } = summary[0]

      let mSpeeds = []
      let mDirections = []
      let mLocations = []

      for (let index in speeds) {
        if (parseInt(index, 10) > 4000) continue
        mSpeeds.push(speeds[index])
      }

      for (let index in directions) {
        if (parseInt(index, 10) > 4000) continue
        mDirections.push(directions[index])
      }

      for (let index in locations) {
        if (parseInt(index, 10) > 4000) continue
        mLocations.push(locations[index])
      }

      let _summary = {
        windSpeeds: mSpeeds,
        locations: mLocations,
        windDirections: mDirections,
        windMax: windMax,
        windMin: windMin
      }

      resolve(_summary)
    }
    else {
      console.log('summary from server...', sessionKey)
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
