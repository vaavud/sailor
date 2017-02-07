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


struct MeasurementPoint {
  let speed: Double
  let direction: Int
  let location: CLLocationCoordinate2D
  let timestamp: UInt64
  
  
  var toDic: [String:Any] {
    return ["speed": speed, "direction": direction, "location": ["latitude":location.latitude, "longitude": location.longitude], "timestamp":timestamp]
  }
}


extension Date {
  var ticks: UInt64 {
    return UInt64(self.timeIntervalSince1970 * 1000)
  }
}

extension CGPoint {
  var toDic: [String:Double] {
    return ["timestamp": Double(self.x), "value": Double(self.y)]
  }
}


extension Data {
  func hexEncodedString() -> String {
    return map { String(format: "%02hhx", $0) }.joined()
  }
}

extension String {
  func substring(from: Int?, to: Int?) -> String {
    if let start = from {
      guard start < self.characters.count else {
        return ""
      }
    }
    
    if let end = to {
      guard end >= 0 else {
        return ""
      }
    }
    
    if let start = from, let end = to {
      guard end - start >= 0 else {
        return ""
      }
    }
    
    let startIndex: String.Index
    if let start = from, start >= 0 {
      startIndex = self.index(self.startIndex, offsetBy: start)
    } else {
      startIndex = self.startIndex
    }
    
    let endIndex: String.Index
    if let end = to, end >= 0, end < self.characters.count {
      endIndex = self.index(self.startIndex, offsetBy: end + 1)
    } else {
      endIndex = self.endIndex
    }
    
    return self[startIndex ..< endIndex]
  }
}

@objc(VaavudBle)
class VaavudBle: RCTEventEmitter,CBCentralManagerDelegate, CBPeripheralDelegate, CLLocationManagerDelegate {
  
  var manager:CBCentralManager!
  var peripheral:CBPeripheral?
  let locationManager = CLLocationManager()
  var lastLocation: CLLocationCoordinate2D?

  
  let BEAN_NAME = "ULTRASONIC"
  let BEAN_SCRATCH_UUID = CBUUID(string: "00002a39-0000-1000-8000-00805f9b34fb")
  let BEAN_SERVICE_UUID = CBUUID(string: "0000180d-0000-1000-8000-00805f9b34fb")
  
  
  var measurementPoints: [MeasurementPoint] = []
  
  
  override func supportedEvents() -> [String]! {
    return ["onBleConnected","onStateHasChanged","onNewRead","onReadyToWork","onVaavudBleFound","onLocationWorking","onFinalData"]
  }
  
  @objc
  func initBle() {
    manager = CBCentralManager(delegate: self, queue: nil)
    
    
    isAuthorizedtoGetUserLocation()
    if CLLocationManager.locationServicesEnabled() {
      locationManager.delegate = self
      locationManager.desiredAccuracy = kCLLocationAccuracyBestForNavigation
      locationManager.startUpdatingLocation()
      self.sendEvent(withName: "onLocationWorking", body: ["available":true])
    }
    else {
      self.sendEvent(withName: "onLocationWorking", body: ["available":false])
    }
  }
  
  private func isAuthorizedtoGetUserLocation() {
    if CLLocationManager.authorizationStatus() != .authorizedAlways {
      locationManager.requestAlwaysAuthorization()
    }
  }
  
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    guard let latlon = locations.last else{
      return
    }
    lastLocation = latlon.coordinate
  }
  
  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    print("Did location updates is called but failed getting location \(error)")
  }
  
  
  @objc
  func isVaavudBleConnected() {
    guard let _ = peripheral else {
      self.sendEvent(withName: "onVaavudBleFound", body: ["available":false])
      return
    }
    
    self.sendEvent(withName: "onVaavudBleFound", body: ["available":true])
  }
  
  
  @objc
  func onConnect() {
    
  }
  
  @objc
  func onDisconnect(){
    if let p =  peripheral {
      manager.cancelPeripheralConnection(p)
    }
    manager = nil
    peripheral = nil
    locationManager.stopUpdatingLocation()
    
    var latlon : [CLLocationCoordinate2D] = []
    var speeds : [CGPoint] = []
    var directions : [CGPoint] = []
    
    
    for point in measurementPoints {
      latlon.insert(point.location, at: 0)
      speeds.insert(CGPoint(x:Double(point.timestamp) , y: point.speed), at: 0)
      directions.insert(CGPoint(x: Double(point.timestamp), y:Double(point.direction)), at: 0)
    }
    
    let simplifiedLocations = SwiftSimplify.simplify(latlon, tolerance: 1, highQuality: false).map{["latitude":$0.latitude,"longitude":$0.longitude]}
    let simplifiedSpeed = SwiftSimplify.simplify(speeds, tolerance: 0.1, highQuality: false).map{$0.toDic}
    let simplifiedDirection = SwiftSimplify.simplify(directions, tolerance: 22.5, highQuality: false).map{$0.toDic}
    
    
    self.sendEvent(withName: "onFinalData", body: ["measurementPoints":measurementPoints.map{$0.toDic},"locations":simplifiedLocations,"speeds":simplifiedSpeed,"directions":simplifiedDirection ] )
    
  }
  
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
    
    if let device = (advertisementData as NSDictionary).object(forKey: CBAdvertisementDataLocalNameKey)as? NSString {
      
      if device.contains(BEAN_NAME) == true {
        
        self.manager.stopScan()
        
        self.peripheral = peripheral
        self.peripheral!.delegate = self
        
        manager.connect(peripheral, options: nil)
      }
    }
  }
  
  
  
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    if central.state == .poweredOn {
      central.scanForPeripherals(withServices: nil, options: nil)
      self.sendEvent(withName: "onStateHasChanged", body: ["status":"poweredOn","success":true] )
    } else if central.state == .unauthorized {
      print("Bluetooth not available.")
      self.sendEvent(withName: "onStateHasChanged", body: ["status":"unauthorized","success":false] )
    }
    else{
      self.sendEvent(withName: "onStateHasChanged", body: ["status":"poweredOff","success":false] )
    }
  }
  
  
  func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
    peripheral.discoverServices(nil)
    self.sendEvent(withName: "onBleConnected", body: ["connected":true] )
  }
  
  
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
    for service in peripheral.services! {
      let thisService = service as CBService
      
      if service.uuid == BEAN_SERVICE_UUID {
        
        self.sendEvent(withName: "onVaavudBleFound", body: ["available":true])
        peripheral.discoverCharacteristics(
          nil,
          for: thisService
        )
      }
    }
  }
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
    for characteristic in service.characteristics! {
      let thisCharacteristic = characteristic as CBCharacteristic
      
      if thisCharacteristic.uuid == BEAN_SCRATCH_UUID {
        
        self.sendEvent(withName: "onReadyToWork", body: [] )

        self.peripheral!.setNotifyValue(
          true,
          for: thisCharacteristic
        )
      }
    }
  }
  
  
  func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
    
    if characteristic.uuid == BEAN_SCRATCH_UUID {
      
      if let v = characteristic.value {
        let val = v.hexEncodedString()
        
        //Speed
        let s10 = val.substring(from: 0, to: 1)
        let s11 = val.substring(from: 2, to: 3)
        let h1 = Int(s11.appending(s10), radix: 16)
        let _h1 = Double(h1!) / 100
        
        //Direction
        let s20 = val.substring(from: 4, to: 5)
        let s21 = val.substring(from: 6, to: 7)
        let h2 = Int(s21.appending(s20), radix: 16)!
        
        //Battery
        let s30 = val.substring(from: 8, to: 9)
        let h3 = Int(s30, radix: 16)! * 10
        
        //Temperature
        let s40 = val.substring(from: 10, to: 11)
        let h4 = Int(s40, radix: 16)! - 100
        
        //Escora
        let s50 = val.substring(from: 12, to: 13)
        let h5 = Int(s50, radix: 16)! - 90
        
        //Cabeceo
        let s60 = val.substring(from: 14, to: 15)
        let h6 = Int(s60, radix: 16)! - 90
        
        
        //Compass
        let s70 = val.substring(from: 16, to: 17)
        let h7 = Int(s70, radix: 16)! * 2
        

        if let _loc = lastLocation {
          
//          let speed = Speed(windSpeed: _h1, timestamp: Date().ticks)
//          let direction = Direction(windDirection: h2, timestamp: Date().ticks)
          let point = MeasurementPoint(speed: _h1, direction: h2, location: _loc, timestamp: Date().ticks)
          measurementPoints.insert(point, at: 0)
        }
        
        self.sendEvent(withName: "onNewRead", body: ["windSpeed":_h1, "windDirection": h2, "battery": h3, "temperature": h4, "escora":h5, "cabeceo":h6, "compass":h7] )
      }
    }
  }
  
  
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
    central.scanForPeripherals(withServices: nil, options: nil)
    self.sendEvent(withName: "onBleConnected", body: ["connected":false] )
  }
}
