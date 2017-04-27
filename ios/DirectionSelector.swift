//
//  DirectionSelector.swift
//  kitesurf
//
//  Created by Diego Galindo on 2/29/16.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit


extension CGSize {
  func expandX(value: CGFloat) -> CGSize {
    return CGSize(width: width + value, height: height)
  }
  
  func expandY(value: CGFloat) -> CGSize {
    return CGSize(width: width, height: height + value)
  }
  
  var point: CGPoint { return CGPoint(x: width, y: height) }
}

extension CGRect {
  init(center: CGPoint, size: CGSize) {
    self.init(origin: CGPoint(x: center.x - size.width/2, y: center.y - size.height/2), size: size)
  }
  
  func grow(delta: CGFloat) -> CGRect {
    let dw = delta*width
    let dh = delta*height
    
    return CGRect(x: origin.x - dw, y: origin.y - dh, width: width + 2*dw, height: height + 2*dh)
  }
  
  var center: CGPoint { return CGPoint(x: midX, y: midY) }
  
  var lowerRight: CGPoint { return CGPoint(x: maxX, y: maxY) }
  
  var lowerMid: CGPoint { return CGPoint(x: midX, y: maxY) }
  
  var lowerLeft: CGPoint { return CGPoint(x: minX, y: maxY) }
  
  var midLeft: CGPoint { return CGPoint(x: minX, y: midY) }
  
  var upperRight: CGPoint { return CGPoint(x: maxX, y: minY) }
  
  var upperMid: CGPoint { return CGPoint(x: midX, y: minY) }
  
  var upperLeft: CGPoint { return CGPoint(x: minX, y: minY) }
  
  var midRight: CGPoint { return CGPoint(x: maxX, y: midY) }
  
  func insetX(dx: CGFloat) -> CGRect {
    return CGRect(x: origin.x + dx, y: origin.y, width: width - 2*dx, height: height)
  }
  
  func insetY(dy: CGFloat) -> CGRect {
    return CGRect(x: origin.x, y: origin.y + dy, width: width, height: height - 2*dy)
  }
  
  func move(dr: CGPoint) -> CGRect {
    return CGRect(origin: origin + dr, size: size)
  }
  
  func moveX(value: CGFloat) -> CGRect {
    return CGRect(origin: origin + CGPoint(x: value, y: 0), size: size)
  }
  
  func moveY(value: CGFloat) -> CGRect {
    return CGRect(origin: origin + CGPoint(x: 0, y: value), size: size)
  }
  
  func width(value: CGFloat) -> CGRect {
    return CGRect(origin: origin, size: CGSize(width: value, height: height))
  }
  
  func height(value: CGFloat) -> CGRect {
    return CGRect(origin: origin, size: CGSize(width: width, height: value))
  }
}


// MARK: Points

func + (lhs: CGPoint, rhs: CGPoint) -> CGPoint {
  return CGPoint(x: lhs.x + rhs.x, y: lhs.y + rhs.y)
}

func * (lhs: CGFloat, rhs: CGPoint) -> CGPoint {
  return CGPoint(x: lhs*rhs.x, y: lhs*rhs.y)
}

func - (lhs: CGPoint, rhs: CGPoint) -> CGPoint {
  return CGPoint(x: lhs.x - rhs.x, y: lhs.y - rhs.y)
}

func * (lhs: Polar, rhs: Polar) -> Polar {
  return Polar(r: lhs.r*rhs.r, phi: lhs.phi + rhs.phi)
}

func dist(p: CGPoint, q: CGPoint) -> CGFloat {
  return (p - q).length
}

// CGSize

func * (lhs: CGFloat, rhs: CGSize) -> CGSize {
  return CGSize(width: lhs*rhs.width, height: lhs*rhs.height)
}


struct Polar {
  var r: CGFloat
  var phi: CGFloat
  
  init(r: Double, phi: Double) {
    self.r = CGFloat(r)
    self.phi = CGFloat(phi)
  }
  
  init(r: CGFloat, phi: CGFloat) {
    self.r = r
    self.phi = phi
  }
  
  var cartesian: CGPoint {
    return CGPoint(x: r*cos(phi), y: r*sin(phi))
  }
  
  func cartesian(center: CGPoint) -> CGPoint {
    return CGPoint(x: center.x + r*cos(phi), y: center.y + r*sin(phi))
  }
  
  func rotated(phi: CGFloat) -> Polar {
    return self*Polar(r: 1, phi: phi)
  }
  
  func rotated(phi: Double) -> Polar {
    return self*Polar(r: 1, phi: phi)
  }
}

extension CGPoint {
  var length: CGFloat {
    return sqrt(x*x + y*y)
  }
  
  var unit: CGPoint {
    return (1/length)*self
  }
  
  var polar: Polar {
    return Polar(r: length, phi: atan2(y, x))
  }
  
  init(polar: Polar) {
    x = polar.cartesian.x
    y = polar.cartesian.y
  }
  
  init(r: CGFloat, phi: CGFloat) {
    self.init(polar: Polar(r: r, phi: phi))
  }
  
  func approach(goal: CGPoint, by factor: CGFloat) -> CGPoint {
    return (1 - factor)*self + factor*goal
  }
}

let π = CGFloat(Double.pi)

func mod(i: Int, _ n: Int) -> Int {
  return ((i % n) + n) % n
}

func mod(i: CGFloat, _ n: CGFloat) -> CGFloat {
  return (i.truncatingRemainder(dividingBy: n) + n).truncatingRemainder(dividingBy: n)
}

func mod(i: Double, _ n: Double) -> Double {
  return (i.truncatingRemainder(dividingBy: n) + n).truncatingRemainder(dividingBy: n)
  //  return ((i % n) + n) % n
}

typealias Affine = CGAffineTransform

extension CGAffineTransform {
  static var id: CGAffineTransform { return CGAffineTransform.identity }
  
  init() {
    self = CGAffineTransform.id
  }
  
  func translate(x: CGFloat, _ y: CGFloat) -> CGAffineTransform {
    return self.translatedBy(x: x, y: y)
  }
  
  func rotate(angle: CGFloat) -> CGAffineTransform {
    return self.rotated(by: angle)
  }
  
  func scale(x: CGFloat, _ y: CGFloat) -> CGAffineTransform {
    return self.scaledBy(x: x, y: y)
  }
  
  func scale(r: CGFloat) -> CGAffineTransform {
    return self.scale(x: r, r)
  }
  
  func apply(rect: CGRect) -> CGRect {
    return rect.applying(self)
  }
  
  func apply(point: CGPoint) -> CGPoint {
    return point.applying(self)
  }
  
  var inverse: CGAffineTransform {
    return self.inverted()
  }
  
  static func translation(x: CGFloat, _ y: CGFloat) -> CGAffineTransform {
    return CGAffineTransform(translationX: x, y: y)
  }
  
  static func rotation(angle: CGFloat) -> CGAffineTransform {
    return CGAffineTransform(rotationAngle: angle)
  }
  
  static func scaling(sx: CGFloat, _ sy: CGFloat) -> CGAffineTransform {
    return CGAffineTransform(scaleX: sx, y: sy)
  }
  
  static func scaling(r: CGFloat) -> CGAffineTransform {
    return self.scaling(sx: r, r)
  }
}




struct Directions: OptionSet, CustomStringConvertible {
  let rawValue: Int
  init(rawValue: Int) { self.rawValue = rawValue }
  init(angle: CGFloat) { self = Directions.number(i: Int(round(CGFloat(Directions.count)*angle/(2*π)))) }
  
  static let None = Directions(rawValue: 0)
  static let N = Directions(rawValue: 1)
  static let NW = Directions(rawValue: 2)
  static let W = Directions(rawValue: 4)
  static let SW = Directions(rawValue: 8)
  static let S = Directions(rawValue: 16)
  static let SE = Directions(rawValue: 32)
  static let E = Directions(rawValue: 64)
  static let NE = Directions(rawValue: 128)
  
  static let ordered: [Directions] = [.N, .NW, .W, .SW, .S, .SE, .E, .NE]
  static let count = Directions.ordered.count
  static func number(i: Int) -> Directions { return ordered[mod(i:i, 8)] }
  
  var angle: CGFloat { return CGFloat(index)*2*π/CGFloat(Directions.count) }
  
  var index: Int { return Directions.ordered.index(of: self)! }
  
  var name: String { return ["N", "NW", "W", "SW", "S", "SE", "E", "NE"][index] }
  
  var description: String { return name }
  
  var local: String { return name }
}

func sectorBezierPath(direction: Directions) -> UIBezierPath {
  let total = 8
  let phi = 2*π/CGFloat(total)
  let path = UIBezierPath()
  path.move(to: CGPoint())
  path.addLine(to: CGPoint(r: 0.5, phi: -phi/2))
  path.addArc(withCenter: CGPoint(), radius: 0.5, startAngle: -phi/2, endAngle: phi/2, clockwise: true)
  path.close()
  
  path.apply(Affine.rotation(angle: -π/2 - CGFloat(direction.index)*phi))
  path.apply(Affine.translation(x: 0.5, 0.5))
  return path
}

protocol IDirectionDelegate {
  func onDirectionSelected(tot: Int, current: Directions)
}



@objc(DirectionSelector)
@IBDesignable class DirectionSelector: UIControl {
  
  
  var onChange:RCTBubblingEventBlock? = nil
  
  @IBInspectable var fontSize: CGFloat = 9
  
  var delegate: IDirectionDelegate?
  
  @objc(setDirections:)
  func setDirections(directions: [String:Bool]) {
    
    var actualDirections: Directions = []
    
    for dir in Array(directions.keys) {
      
      var direction: Directions
      switch dir {
      case "N": direction = .N; break
      case "NW": direction = .NW; break
      case "W": direction = .W; break
      case "SW": direction = .SW; break
      case "S": direction = .S; break
      case "SE": direction = .SE; break
      case "E": direction = .E; break
      case "NE": direction = .NE; break
      default: fatalError("Unknown Direction")
      }
      
      actualDirections.insert(direction)
    }
    
  
    
    self.areas = directions
    self.selection = actualDirections
    self.setNeedsDisplay()
//    self.isUserInteractionEnabled = false
  }
  
    
  enum State {
    case Adding, Removing, Default
  }
  
  let lineWidth: CGFloat = 1
  
  var selection: Directions = []
  let paths = Directions.ordered.map({sectorBezierPath(direction: $0)})
  var laidOut = false
  var touchState = State.Default
  var areas : [String:Bool] = [:]
  
  override func layoutSubviews() {
    if laidOut { return }
    
    let scaling = Affine.scaling(sx: frame.width - lineWidth, frame.height - lineWidth)
    let translation = Affine.translation(x: lineWidth/2, lineWidth/2)
    for path in paths {
      path.lineWidth = lineWidth
      path.apply(scaling)
      path.apply(translation)
    }
    
    laidOut = true
  }
  
  func updateSelection(direction: Directions) {
    
    if touchState == .Adding {
      selection.insert(direction)
      areas[direction.description] = true
    }
    else {
      selection.remove(direction)
      areas[direction.description] = nil
    }
    
    if let delegate = self.delegate {
      delegate.onDirectionSelected(tot: areas.count,current: direction)
    }
    
    onChange?(areas)
    
    setNeedsDisplay()
  }
  
  override func beginTracking(_ touch: UITouch, with event: UIEvent?) -> Bool {
    if let current = direction(at: touch.location(in: self)) {
      touchState = selection.contains(current) ? .Removing : .Adding
      updateSelection(direction: current)
      
      return true
    }
    
    return false
  }
  
  override func continueTracking(_ touch: UITouch, with event: UIEvent?) -> Bool {
    if let current = direction(at: touch.location(in: self)) {
      updateSelection(direction: current)
    }
    
    return true
  }
  
  override func endTracking(_ touch: UITouch?, with event: UIEvent?) {
    touchState = .Default
  }
  
  func direction(at point: CGPoint) -> Directions? {
    if (point - bounds.center).polar.r > bounds.width/2 {
      return nil
    }
    return Directions(angle: -π/2 - (point - bounds.center).polar.phi)
  }
  
  override func draw(_ rect: CGRect) {
    for (i, direction) in Directions.ordered.enumerated() {
      
      
      UIColor(red: 222/255, green: 222/255, blue: 222/255, alpha: 255/255).setStroke()
      UIColor(red: 0/255, green: 161/255, blue: 225/255, alpha: 255/255).setFill()
      
      paths[i].stroke()
      
      let selected = selection.contains(direction)
      if selected {
        paths[i].fill()
      }
      
      drawlabel(direction: direction, selected: selected)
    }
  }
  
  func drawlabel(direction: Directions, selected: Bool) {
    let color = selected ? UIColor.white : UIColor(red: 222/255, green: 222/255, blue: 222/255, alpha: 255/255)
    let font = UIFont(name: "Helvetica Neue", size: fontSize)!
    let attributes = [NSForegroundColorAttributeName : color, NSFontAttributeName : font]
    
    let size = direction.local.size(attributes: attributes)
    direction.local.draw(at: bounds.center + CGPoint(r: 0.35*bounds.width, phi: -π/2 - direction.angle) - 0.5*size.point, withAttributes: attributes)
  }
}
