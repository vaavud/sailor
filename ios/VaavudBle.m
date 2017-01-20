//
//  VaavudBle.m
//  sailing
//
//  Created by Diego Galindo on 1/19/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTEventEmitter.h>



@interface RCT_EXTERN_MODULE(VaavudBle, RCTEventEmitter <RCTBridgeModule>)

//RCT_EXTERN_METHOD(getInformation:(NSString*)foo callback:(RCTResponseSenderBlock *)successCallback)
//RCT_EXTERN_METHOD(deviceStatus:(RCTResponseSenderBlock)callback)
//RCT_EXTERN_METHOD(startReading:(RCTResponseSenderBlock)callback)
//RCT_EXTERN_METHOD(stopReading:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(initBle)
RCT_EXTERN_METHOD(onConnect)
RCT_EXTERN_METHOD(onDisconnect)

@end

