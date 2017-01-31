//
//  DirectionSelectorView.swift
//  sailing
//
//  Created by Diego Galindo on 1/27/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit

@objc(SelectorViewSwift)
class SelectorView: RCTViewManager {
  
  override func view() -> UIView! {
    let direction = DirectionSelector()
    return direction
  }
    
}

