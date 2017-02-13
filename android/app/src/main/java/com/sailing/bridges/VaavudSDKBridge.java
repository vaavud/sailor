package com.sailing.bridges;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

/**
 * Created by juan on 13/02/2017.
 */

/**
 * Created by juan on 21/01/16.
 */


import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.vaavud.vaavudSDK.Config;
import com.vaavud.vaavudSDK.VaavudSDK;

import com.vaavud.vaavudSDK.core.VaavudError;
import com.vaavud.vaavudSDK.core.listener.DirectionListener;
import com.vaavud.vaavudSDK.core.listener.SpeedListener;
import com.vaavud.vaavudSDK.core.model.event.DirectionEvent;
import com.vaavud.vaavudSDK.core.model.event.SpeedEvent;
import com.vaavud.vaavudSDK.model.MeasurementSession;
import com.vaavud.vaavudSDK.model.WindMeter;
import com.vaavud.vaavudSDK.model.event.TrueDirectionEvent;
import com.vaavud.vaavudSDK.model.event.TrueSpeedEvent;

public class VaavudSDKBridge extends ReactContextBaseJavaModule implements SpeedListener, DirectionListener {

    private static final String TAG = "VaavudAPI";
    private VaavudSDK vaavudSDK;
    private Context mContext;
    private DeviceEventManagerModule.RCTDeviceEventEmitter module;
    private MeasurementSession session;



    public VaavudSDKBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext.getApplicationContext();
//        vaavudSDK = VaavudSDK.init(reactContext.getApplicationContext());
    }

    @Override
    public String getName() {
        return "VaavudAPI";
    }

    @Override
    public void speedChanged(SpeedEvent event) {
        WritableMap data = Arguments.createMap();
        data.putDouble("time", event.getTime());
        data.putDouble("speed", event.getSpeed());
        data.putDouble("windMean",session.getWindMean());
        emitData(data);
    }

    @Override
    public void trueSpeedChanged(TrueSpeedEvent event) {
        WritableMap data = Arguments.createMap();
        data.putDouble("time", event.getTime());
        data.putDouble("trueSpeed", event.getTrueSpeed());
        data.putDouble("windMean",session.getWindMean());
        emitData(data);

    }

    @Override
    public void newDirectionEvent(DirectionEvent event) {
        WritableMap data = Arguments.createMap();
        data.putDouble("time", event.getTime());
        data.putDouble("direction", event.getDirection());
        emitData(data);
    }

    @Override
    public void trueDirectionEvent(TrueDirectionEvent event) {
        WritableMap data = Arguments.createMap();
        data.putDouble("time", event.getTime());
        data.putDouble("trueDirection", event.getTrueDirection());
        emitData(data);

    }

    private void emitData(WritableMap data) {
        //Log.d(TAG, "Emit: " + data);
        module.emit("VaavudWindEvent", data);
    }

    private void initSDK(){
        vaavudSDK = VaavudSDK.init(getReactApplicationContext());
        if (module == null) {
            module = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
    }

    @ReactMethod
    public void initBLE(Promise callback){
        initSDK();
        Config config = new Config(null);
        config.setWindMeter(WindMeter.AEGIR);
        vaavudSDK.setConfig(config);
        try {
            vaavudSDK.initBLE();
            callback.resolve(null);
        } catch (VaavudError vaavudError) {
            callback.reject(vaavudError.getMessage(), vaavudError);
        }
    }

    @ReactMethod
    public void start(Promise callback) {
        //Log.d(TAG, "Starting from React");
//        LocationManager.getInstance().connect();
        if(vaavudSDK==null) {
            initSDK();
        }
        try {
            session = vaavudSDK.startSession();
            callback.resolve(null);
        } catch (VaavudError vaavudError) {
            callback.reject(vaavudError.getMessage(), vaavudError);
        }
    }

    @ReactMethod
    public void stop(Promise callback) {
//        Log.d(TAG, "Stoping from React");
//        LocationManager.getInstance().onPause();
        if (vaavudSDK != null) {
            try {
                MeasurementSession session = vaavudSDK.stopSession();
                WritableMap map = new WritableNativeMap();
                map.putDouble("timeStart", session.getStartTime());
                map.putDouble("timeEnd", session.getEndTime());
                map.putDouble("windMax", session.getWindMax());
                map.putDouble("windMean", session.getWindMean());
                map.putDouble("trueWindMax", session.getTrueWindMax());
                map.putDouble("trueWindMean", session.getTrueWindMean());
                if (session.getWindDirection() != -1) {
                    map.putString("windMeter", WindMeter.SLEIPNIR.name());
                    map.putDouble("windDirection", session.getWindDirection());
                    map.putDouble("trueWindDirection", session.getTrueWindDirection());
                } else {
                    map.putString("windMeter", WindMeter.MJOLNIR.name());
                }
//                LocationEvent locationEvent = session.getLastLocationEvent();
//                if (LocationManager.getInstance().getLastLocation() != null) {
//                    Log.e("latlon",LocationManager.getInstance().getLastLocation().toString());
                WritableMap locationMap = new WritableNativeMap();
                locationMap.putDouble("lat", session.getLastLocationEvent().getLocation().getLatitude());
                locationMap.putDouble("lon", session.getLastLocationEvent().getLocation().getLongitude());
                map.putMap("location", locationMap);
//                }
                callback.resolve(map);
            } catch (VaavudError vaavudError) {
                callback.reject(vaavudError);
            }
        } else {
            callback.reject(new VaavudError("SDK not available"));
        }


    }



}
