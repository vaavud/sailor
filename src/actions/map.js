export function getMarkers(time) {
  return new Promise((resolve, reject) => {
    let finalUrl = 'https://weather.vaavud.com/api/spots'
    fetch(finalUrl)
      .then(response => response.text())
      .then(res => {
        let result = JSON.parse(res)
        resolve(result)
      })
      .catch(err => {
        reject(err)
      })
  })
}
