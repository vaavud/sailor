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
class VaavudBle: RCTEventEmitter,CBCentralManagerDelegate, CBPeripheralDelegate {
  
  
  var manager:CBCentralManager!
  var peripheral:CBPeripheral!
  
  let BEAN_NAME = "ULTRA4.0"
  let BEAN_SCRATCH_UUID = CBUUID(string: "00002a39-0000-1000-8000-00805f9b34fb")
  let BEAN_SERVICE_UUID = CBUUID(string: "0000180d-0000-1000-8000-00805f9b34fb")
  
  override func supportedEvents() -> [String]! {
    return ["onBleConnected","onStateHasChanged","onNewRead","onReadyToWork"]
  }
  
  @objc
  func initBle() {
    manager = CBCentralManager(delegate: self, queue: nil)
  }
  
  @objc
  func onConnect(){
    manager.connect(peripheral, options: nil)
    self.sendEvent(withName: "onBleConnected", body: ["connected":true] )

  }
  
  @objc
  func onDisconnect(){
    manager.cancelPeripheralConnection(peripheral)
    self.sendEvent(withName: "onBleConnected", body: ["connected":false] )
  }
  
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
    if let device = (advertisementData as NSDictionary).object(forKey: CBAdvertisementDataLocalNameKey)as? NSString {
      
      if device.contains(BEAN_NAME) == true {
        
        
        self.manager.stopScan()
        
        self.peripheral = peripheral
        self.peripheral.delegate = self
        
        //EMIT on devide found
        
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
  }
  
  
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
    for service in peripheral.services! {
      let thisService = service as CBService
      
      if service.uuid == BEAN_SERVICE_UUID {
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

        self.peripheral.setNotifyValue(
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
        
        let s10 = val.substring(from: 0, to: 1)
        let s11 = val.substring(from: 2, to: 3)
        
        
        let h1 = Int(s11.appending(s10), radix: 16)
        print(h1!)
        //emit new windSpeed
        
        
        let s20 = val.substring(from: 4, to: 5)
        let s21 = val.substring(from: 6, to: 7)
        
        
        let h2 = Int(s21.appending(s20), radix: 16)
        print(h2!)
        //emit new direction
        
        
        let s30 = val.substring(from: 8, to: 9)
        let s31 = val.substring(from: 10, to: 11)
        
        let h3 = Int(s31.appending(s30), radix: 16)
        print(h3!)
        
        self.sendEvent(withName: "onNewRead", body: ["windSpeed":h1!, "windDirection": h2!, "battery": h3!] )

        
      }
    }
  }
  
  
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
    central.scanForPeripherals(withServices: nil, options: nil)
  }
  
  
//  @objc
//  func getInformation(_ foo: String, callback successCallback: RCTResponseSenderBlock) {
//    
//    print("something")
//    let resultsDict = [
//      "version" : "1.0"
//    ]
//    
//    self.sendEvent(withName: "onBleConnected", body: resultsDict )
//    
//    successCallback([resultsDict])
//  }
//  
//  @objc
//  func deviceStatus(callback successCallback: RCTResponseSenderBlock) {
//    
//    let resultsDict = [
//      "version" : "1.0"
//    ]
//    
//    successCallback([resultsDict])
//  }
//  
//  @objc
//  func startReading(callback successCallback: RCTResponseSenderBlock) {
//    
//    let resultsDict = [
//      "version" : "1.0"
//    ]
//    
//    successCallback([resultsDict])
//  }
//  
//  @objc
//  func stopReading(callback successCallback: RCTResponseSenderBlock) {
//    
//    let resultsDict = [
//      "version" : "1.0"
//    ]
//    
//    successCallback([resultsDict])
//  }
}
