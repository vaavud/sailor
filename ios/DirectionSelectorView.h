//
//  Header.h
//  sailing
//
//  Created by Diego Galindo on 1/27/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <React/RCTView.h>

@interface SelectorView : RCTView
@property (nonatomic, assign) NSDictionary *directions;
@property (nonatomic, copy) RCTBubblingEventBlock onChange;
@end
