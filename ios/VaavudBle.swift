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
import RxSwift


struct Ultrasonic {
  let windDirection: Int
  let windSpeed: Double
  let compass: Int
  let battery: Int
  let temperature: Int
  
  
  var toDic: [String:Any] {
    var d : [String:Any] = [:]
    d["windDirection"] = windDirection
    d["windSpeed"] = windSpeed
    d["compass"] = compass
    d["battery"] = battery
    d["temperature"] = temperature
    
    return d
  }
}


struct Session {
  let timeStart: UInt64
  let windMeter = "Ultrasonic" //TODO
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
class VaavudBle: RCTEventEmitter  {
  
  let bleController = BluetoothController()
  var bluetoothListener: BluetoothListener!
  let vaavudSDK = VaavudSDK.shared
  var lastLatLon : CLLocationCoordinate2D?
  var points : [MeasurementPoint] = []
  
  var lastVelocity = 0.0
  var lastTrueWindSpeed = 0.0
  var lastTrueWindDirection = 0.0
  
  var bleFound = false
  
  override func supportedEvents() -> [String]! {
    return ["onBluetoothOff","onNoDeviceFound","onDeviceFound","onReading","onCompleted","timeout", "onLocationFound","onFinalData","onCharacteristicEnable"]
  }
  
  
  func workWithRowData(val: String) -> Ultrasonic {
    
    //    print(val)
    
    //Speed
    let s10 = val.substring(from: 0, to: 1)
    let s11 = val.substring(from: 2, to: 3)
    let h1 = Int(s11.appending(s10), radix: 16)
    let windSpeed = Double(h1!) / 100
    
    //    print("speed: \(_h1)")
    
    //Direction
    let s20 = val.substring(from: 4, to: 5)
    let s21 = val.substring(from: 6, to: 7)
    let windDirection = Int(s21.appending(s20), radix: 16)!
//    print("Direction: \(h2)")
    
    //Battery
    let s30 = val.substring(from: 8, to: 9)
    let h3 = Int(s30, radix: 16)! * 10
//    print("Battery: \(h3)")
    
    //    //Temperature
    let s40 = val.substring(from: 10, to: 11)
    let h4 = Int(s40, radix: 16)! - 100
    //    print("Temperataure: \(h4)")
    //
    //
    //    //Escora
    //    let s50 = val.substring(from: 12, to: 13)
    //    let h5 = Int(s50, radix: 16)! - 90
    //    print("Escora: \(h5)")
    //
    //
    //    //Cabeceo
    //    let s60 = val.substring(from: 14, to: 15)
    //    let h6 = Int(s60, radix: 16)! - 90
    //    print("Cabeceo: \(h6)")
    
    
    //Compass
    let s70 = val.substring(from: 16, to: 17)
    let s71 = val.substring(from: 18, to: 19)
    let compass = Int(s71.appending(s70) , radix: 16)!
    
    //    print("Compass: \(h7)")
    
    return Ultrasonic(windDirection: windDirection, windSpeed: windSpeed, compass: compass, battery: h3, temperature: h4)
  }
  
  
  
  private func findUltrasonic() {
    
    let _ = self.bleController.onConnectDevice()
      .subscribe(onError: {
        self.sendEvent(withName: "onNoDeviceFound", body: [] )
        print($0)
      }, onCompleted: {
        self.sendEvent(withName: "onDeviceFound", body: [] )
        self.bleController.activateSensores()
      })
  }
  
  
  
  @objc
  func readOnce() {
    let _ = bleController.onVerifyBle()
      .subscribe(onError: {
        self.sendEvent(withName: "onBluetoothOff", body: [] )
        print($0)
      }, onCompleted: {
        print("this is fine")
        self.findUltrasonic()
      })
    
    
    let _ = self.bleController.onreadOnce()
      .subscribe(onNext: {
        let val = $0.value?.hexEncodedString()
        let data = self.workWithRowData(val: val!)
        self.sendEvent(withName: "onReading", body: data.toDic )
      }, onError: {
        print("6")
        print($0)
      }, onCompleted: {
        print($0)
      })
  }
  
  @objc
  func readRowData(_ fromSdk:Bool, headingOffset: NSNumber, offset:[String:Any]) {
    
    DispatchQueue.main.async {
      
//      print(offset)
//      print(headingOffset)
      
      let _ = self.bleController.onVerifyBle()
        .subscribe(onError: {
          self.sendEvent(withName: "onBluetoothOff", body: [] )
          print($0)
        }, onCompleted: {
          self.findUltrasonic()
        })
      
      if fromSdk {
        self.vaavudSDK.startWithBluetooth(offset:offset, headingOffset:headingOffset.intValue)
        self.bluetoothListener = self.vaavudSDK
        self.initSkdListeners()
      }
      
      let _ = self.bleController.readRowData()
        .subscribe(onNext: {
          let val = $0.value?.hexEncodedString()
          
          if fromSdk {
            self.respWithSdk(val: val!)
          }
          else {
            self.respSimpleData(val: val!)
          }
        }, onError: {
          print("6")
          print($0)
        }, onCompleted: {
          print($0)
        })
    }
    
  }
  
  
  private func initSkdListeners() {
    
    vaavudSDK.bluetoothCallback =  { data in
      if let latlon = self.lastLatLon {
        self.points.insert(MeasurementPoint(speed: data.windSpeed, direction: data.windDirection, location: latlon, timestamp: Date().ticks), at: 0)
      }
      
      self.sendEvent(withName: "onReading", body: ["windSpeed":data.windSpeed, "windDirection": data.windDirection, "battery": data.battery, "velocity": self.lastVelocity, "trueWindSpeed": self.lastTrueWindSpeed, "trueWindDirection": self.lastTrueWindDirection, "compass":data.compass] )
    }
    
    vaavudSDK.trueWindSpeedCallback = {data in
      self.lastTrueWindSpeed = data.speed
    }
    
    vaavudSDK.trueWindDirectionCallback = {data in
      self.lastTrueWindDirection = data.direction
    }
    
    
    vaavudSDK.velocityCallback = { data in
      self.lastVelocity = data.speed
    }
    
    _ = vaavudSDK.locationCallback.subscribe(onNext: {
      self.lastLatLon = $0.coordinate

    }, onError: {
      print($0)
    
    }, onCompleted: {
    
    })
    
//    vaavudSDK.locationCallback =  { data in
////      self.lastLatLon = data.coordinate
//    }
  }
  
  
  private func respWithSdk(val: String ) {
    let data = self.workWithRowData(val: val)
    bluetoothListener.newReading(event: BluetoothEvent(windSpeed: data.windSpeed, windDirection: data.windDirection, battery: data.battery, compass: Double(data.compass)))
  }
  
  private func respSimpleData(val: String) {
    let data = self.workWithRowData(val: val)
    self.sendEvent(withName: "onReading", body: data.toDic )
  }
  
  
  @objc
  func addOffset(_ offset: NSNumber) {

    var myInt :UInt16 = UInt16(offset.int16Value)
    let myIntData = Data(bytes: &myInt, count: MemoryLayout.size(ofValue: myInt))
    
    let _ = self.bleController.addOffset(activate: myIntData)
      .subscribe(onNext: {
        print($0.value ?? 0)
        print("Enable sensors") //TODO
      }, onError: {
        print("Enable error") //TODO
        print($0)
      }, onCompleted: {
        self.sendEvent(withName: "onCharacteristicEnable", body: [] )
        self.bleController.readOffSet()
      })
    
  }
  
  
  @objc
  func calibrateCompass(_ on: Bool) {
    let bytes : [UInt8] = on ? [0x01] : [0x00]
    let data = Data(bytes:bytes)
    
    let _ = self.bleController.calibrationCompass(activate: data)
      .subscribe(onNext: { _ in
        print("Enable sensors")
      }, onError: {
        print("Enable error")
        print($0)
      }, onCompleted: {
        print("done with sensors")
        print($0)
      })
  }
  
  @objc
  func onStopSdk(){
    self.bleController.onDispose()
    
    let _ = vaavudSDK.stop()
    
    
    var latlon : [CLLocationCoordinate2D] = []
    var speeds : [CGPoint] = []
    var directions : [CGPoint] = []
    
    
    for point in points {
      latlon.insert(point.location, at: 0)
      speeds.insert(CGPoint(x:Double(point.timestamp) , y: point.speed), at: 0)
      directions.insert(CGPoint(x: Double(point.timestamp), y:Double(point.direction)), at: 0)
    }
    
    if points.count > 2 {
      let simplifiedLocations = SwiftSimplify.simplify(latlon, tolerance: 0.0001, highQuality: false).map{["lat":$0.latitude,"lon":$0.longitude]}
      let simplifiedSpeed = SwiftSimplify.simplify(speeds, tolerance: 0.5, highQuality: false).map{$0.toSpeedDictionary}
      let simplifiedDirection = SwiftSimplify.simplify(directions, tolerance: 22.5, highQuality: false).map{$0.toDirectionDictionary}
      
      var avg : Double = 0
      var max : Double = 0
      var min = simplifiedSpeed.last!["windSpeed"]!
      //    let dir = simplifiedDirection.last!["windDirection"]!
      //    let _latlon = ["lat":latlon.last!.latitude,"lon":latlon.last!.longitude]
      
      for s in simplifiedSpeed {
        let v = s["windSpeed"]!
        max = max < v ? v : max
        min = min > v ? v : min
        avg = avg + v
      }
      
      
      avg = avg / Double(simplifiedSpeed.count)
      
      //    session.windDirection = Int(dir)
      //    session.windMax = max
      //    session.windMean = avg
      //    session.location = _latlon
      //    session.timeEnd = Date().ticks
      //    session.windMin = min
      
      self.sendEvent(withName: "onFinalData", body: ["measurementPoints":points.map{$0.toDic},"locations":simplifiedLocations,"speeds":simplifiedSpeed,"directions":simplifiedDirection,"session": vaavudSDK.session.dict ] )
      points = []
    }
  }
  
  @objc
  func onDisconnect() {
    self.bleController.onDispose()
    self.sendEvent(withName: "onCompleted", body: [] )
  }
}
