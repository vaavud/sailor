//
//  VaavudBle.swift
//  sailing
//
//  Created by Diego Galindo on 1/19/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit
import Foundation
import CoreBluetooth
import CoreLocation
import VaavudSDK


struct Session {
  let timeStart: UInt64
  let windMeter = "sleipnir" //TODO
  var timeEnd: UInt64?
  var windMax: Double?
  var windMean: Double?
  var windDirection: Int?
  var location: [String:Double]?
  var windMin: Double?
  
  
  var toDic: [String:Any] {
    var d : [String:Any] = [:]
    d["timeStart"] = timeStart
    d["windMeter"] = windMeter
    d["timeEnd"] = timeEnd
    d["windMax"] = windMax
    d["windMin"] = windMin
    d["windMean"] = windMean
    d["windDirection"] = windDirection
    d["location"] = location
    
    return d
  }
  
}



struct MeasurementPoint {
  let speed: Double
  let direction: Int
  let location: CLLocationCoordinate2D
  let timestamp: UInt64
  
  
  var toDic: [String:Any] {
    return ["windSpeed": speed, "windDirection": direction, "location": ["lat":location.latitude, "lon": location.longitude], "timestamp":timestamp]
  }
}


@objc(VaavudBle)
class VaavudBle: RCTEventEmitter,IBluetoothManager {
  
  let vaavudSDK = VaavudSDK.shared
  
  override func supportedEvents() -> [String]! {
    return ["onBleState","onNewRead","onReadyToWork","onVaavudBleFound","onLocationWorking","onFinalData"]
  }
  
  @objc
  func initBle() {
    
    vaavudSDK.startWithBluetooth(listener: self)
    
    vaavudSDK.bluetoothCallback =  { data in
      self.sendEvent(withName: "onNewRead", body: ["windSpeed":data.windSpeed, "windDirection": data.windDirection] )
    }
    
    vaavudSDK.bluetoothExtraCallback = { data in
      print(data)
    }
    
    vaavudSDK.locationCallback =  { data in
      print(data)
    }
  }
  
  
  func onBleStatus(status: BluetoothStatus){
    switch status {
    case .on:
      self.sendEvent(withName: "onBleState", body: ["status":"on"] )
      break
    case .off:
      self.sendEvent(withName: "onBleState", body: ["status":"off"] )
      break
    case .unauthorized:
      self.sendEvent(withName: "onBleState", body: ["status":"unauthorized"] )
      break
    }
  }
  
  
  func onBleReadyToWork(){
    self.sendEvent(withName: "onReadyToWork", body: [] )
  }
  
  
  func onVaavudBleFound(){
    self.sendEvent(withName: "onVaavudBleFound", body: ["available":true])
  }
  
  
  @objc
  func isVaavudBleConnected() {
  }
  
  
  @objc
  func onConnect() {}
  
  @objc
  func onDisconnect(){
    
    
    vaavudSDK.stop()
    
    
//    if let p =  peripheral {
//      manager.cancelPeripheralConnection(p)
//    }
//    manager = nil
//    peripheral = nil
//    locationManager.stopUpdatingLocation()
//    
//    var latlon : [CLLocationCoordinate2D] = []
//    var speeds : [CGPoint] = []
//    var directions : [CGPoint] = []
//    
//    
//    for point in measurementPoints {
//      latlon.insert(point.location, at: 0)
//      speeds.insert(CGPoint(x:Double(point.timestamp) , y: point.speed), at: 0)
//      directions.insert(CGPoint(x: Double(point.timestamp), y:Double(point.direction)), at: 0)
//    }
//    
////    let simplifiedLocations = SwiftSimplify.simplify(latlon, tolerance: 1, highQuality: false).map{["lat":$0.latitude,"lon":$0.longitude]}
//    let simplifiedSpeed = SwiftSimplify.simplify(speeds, tolerance: 0.1, highQuality: false).map{$0.toSpeedDictionary}
//    let simplifiedDirection = SwiftSimplify.simplify(directions, tolerance: 22.5, highQuality: false).map{$0.toDirectionDictionary}
//    
//    
//    var avg : Double = 0
//    var max : Double = 0
//    var min = simplifiedSpeed.last!["windSpeed"]!
//    let dir = simplifiedDirection.last!["windDirection"]!
//    let _latlon = ["lat":latlon.last!.latitude,"lon":latlon.last!.longitude]
//    for s in simplifiedSpeed {
//      let v = s["windSpeed"]!
//      max = max < v ? v : max
//      min = min > v ? v : min
//      avg = avg + v
//    }
//    avg = avg / Double(simplifiedSpeed.count)
//    
//    session.windDirection = Int(dir)
//    session.windMax = max
//    session.windMean = avg
//    session.location = _latlon
//    session.timeEnd = Date().ticks
//    session.windMin = min
//    
//    
//    self.sendEvent(withName: "onFinalData", body: ["measurementPoints":measurementPoints.map{$0.toDic},"locations":latlon.map{["lat":$0.latitude,"lon":$0.longitude]},"speeds":simplifiedSpeed,"directions":simplifiedDirection, "session": session.toDic ] )
  }
}
