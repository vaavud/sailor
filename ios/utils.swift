//
//  utils.swift
//  sailing
//
//  Created by Diego Galindo on 2/20/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation


extension Date {
  var ticks: UInt64 {
    return UInt64(self.timeIntervalSince1970 * 1000)
  }
}

extension CGPoint {
  var toDirectionDictionary: [String:Double] {
    return ["timestamp": Double(self.x), "windDirection": Double(self.y)]
  }
  
  var toSpeedDictionary:  [String:Double] {
    return ["timestamp": Double(self.x), "windSpeed": Double(self.y)]
  }
}


//extension Data {
//  func hexEncodedString() -> String {
//    return map { String(format: "%02hhx", $0) }.joined()
//  }
//}

//extension String {
//  func substring(from: Int?, to: Int?) -> String {
//    if let start = from {
//      guard start < self.characters.count else {
//        return ""
//      }
//    }
//    
//    if let end = to {
//      guard end >= 0 else {
//        return ""
//      }
//    }
//    
//    if let start = from, let end = to {
//      guard end - start >= 0 else {
//        return ""
//      }
//    }
//    
//    let startIndex: String.Index
//    if let start = from, start >= 0 {
//      startIndex = self.index(self.startIndex, offsetBy: start)
//    } else {
//      startIndex = self.startIndex
//    }
//    
//    let endIndex: String.Index
//    if let end = to, end >= 0, end < self.characters.count {
//      endIndex = self.index(self.startIndex, offsetBy: end + 1)
//    } else {
//      endIndex = self.endIndex
//    }
//    
//    return self[startIndex ..< endIndex]
//  }
//}
