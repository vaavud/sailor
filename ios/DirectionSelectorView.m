//
//  DirectionSelectorView.m
//  sailing
//
//  Created by Diego Galindo on 1/27/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import "DirectionSelectorView.h"


@interface RCT_EXTERN_MODULE(SelectorViewSwift, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(directions, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
@end
