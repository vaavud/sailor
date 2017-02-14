
import Realm from 'realm'

class Harbor { }
Harbor.schema = {
  name: 'Harbor',
  properties: {
    name: { type: 'string', optional: true },
    windMax: { type: 'int', optional: true },
    windMin: { type: 'int', optional: true },
    location: { type: 'Location', optional: true },
    directions: { type: 'Direction', optional: true },
    key: { type: 'string', optional: true }
  }
}

class Forecast { }
Forecast.schema = {
  name: 'Forecast',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    directions: { type: 'Direction' },
    days: { type: 'list', objectType: 'Day' },
    location: { type: 'Location' },
    resolution: { type: 'string' },
    bestResolutionAvailable: { type: 'string' }
  }
}

class Day { }
Day.schema = {
  name: 'Day',
  properties: {
    temperature: { type: 'double' },
    windSpeed: { type: 'double' },
    windDirection: { type: 'double' },
    icon: { type: 'string' },
    color: { type: 'string' },
    day: { type: 'string' },
    date: { type: 'double' }
  }
}


class Settings { }
Settings.schema = {
  name: 'Settings',
  properties: {
    timeInterval: { type: 'string', default: 'sec' },
    windSpeed: { type: 'string', default: 'mps' },
    direction: { type: 'string', default: 'deg' },
    temperature: { type: 'string', default: 'cel' },
    colorExplanation: { type: 'bool', default: true }
  }
}

class Direction { }
Direction.schema = {
  name: 'Direction',
  properties: {
    N: { type: 'bool', optional: true },
    S: { type: 'bool', optional: true },
    W: { type: 'bool', optional: true },
    E: { type: 'bool', optional: true },
    NE: { type: 'bool', optional: true },
    NW: { type: 'bool', optional: true },
    SE: { type: 'bool', optional: true },
    SW: { type: 'bool', optional: true },
  }
}

class Location { }
Location.schema = {
  name: 'Location',
  properties: {
    name: { type: 'string', optional: true },
    lat: 'double',
    lon: 'double',
    time: { type: 'double', optional: true }
  }
}

class SessionPoints { }
SessionPoints.schema = {
  name: 'SessionPoints',
  properties: {
    key: { type: 'string' },
    sent: { type: 'bool', default: false },
    points: { type: 'list', objectType: 'Point' }
  }
}

class Point { }
Point.schema = {
  name: 'Point',
  properties: {
    timestamp: { type: 'double' },
    windSpeed: { type: 'double' },
    windDirection: { type: 'double' },
    location: { type: 'Location' }
  }
}

class Session { }
Session.schema = {
  name: 'Session', properties: {
    deviceKey: { type: 'string', optional: true },
    timeEnd: { type: 'double', optional: true },
    timeStart: { type: 'double', optional: true },
    turbulence: { type: 'int', optional: true },
    uid: 'string',
    key: 'string',
    sent: { type: 'bool', default: false },
    location: { type: 'Location', optional: true },
    windDirection: { type: 'double', optional: true },
    windMax: { type: 'double', optional: true },
    windMean: { type: 'double', optional: true },
    windMeter: { type: 'string', optional: true }
  }
}

class SpeedPoint { }
SpeedPoint.schema = {
  name: 'SpeedPoint',
  properties: {
    timestamp: 'double',
    windSpeed: 'double'
  }
}

class DirectionPoint { }
DirectionPoint.schema = {
  name: 'DirectionPoint',
  properties: {
    timestamp: 'double',
    windDirection: 'double'
  }
}


class Summary { }
Summary.schema = {
  name: 'Summary', properties: {
    key: 'string',
    windMin: 'double',
    windMax: 'double',
    speeds: { type: 'list', objectType: 'SpeedPoint' },
    directions: { type: 'list', objectType: 'DirectionPoint' },
    locations: { type: 'list', objectType: 'Location' }
  }
}

const realm = new Realm({ schema: [Session, Location, Harbor, Direction, Settings, Forecast, Day, SessionPoints, Point, Summary, DirectionPoint, SpeedPoint] })
export default realm
