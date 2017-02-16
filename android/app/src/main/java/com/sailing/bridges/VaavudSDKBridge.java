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
import android.util.Pair;

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
import com.vaavud.vaavudSDK.core.aegir.ble.BleMessages;
import com.vaavud.vaavudSDK.core.listener.DirectionListener;
import com.vaavud.vaavudSDK.core.listener.SpeedListener;
import com.vaavud.vaavudSDK.core.listener.VaavudDataListener;
import com.vaavud.vaavudSDK.core.location.LocationManager;
import com.vaavud.vaavudSDK.core.model.MeasurementPoint;
import com.vaavud.vaavudSDK.core.model.event.DirectionEvent;
import com.vaavud.vaavudSDK.core.model.event.LocationEvent;
import com.vaavud.vaavudSDK.core.model.event.SpeedEvent;
import com.vaavud.vaavudSDK.model.MeasurementSession;
import com.vaavud.vaavudSDK.model.WindMeter;
import com.vaavud.vaavudSDK.model.event.TrueDirectionEvent;
import com.vaavud.vaavudSDK.model.event.TrueSpeedEvent;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class VaavudSDKBridge extends ReactContextBaseJavaModule implements VaavudDataListener {

    private static final String TAG = "VaavudAPI";
    private VaavudSDK vaavudSDK;
    private Context mContext;
    private DeviceEventManagerModule.RCTDeviceEventEmitter module;
    private MeasurementSession session;

    public VaavudSDKBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext.getApplicationContext();
        initSDK();
    }

    @Override
    public String getName() {
        return "VaavudBle";
    }

//    @Override
//    public void speedChanged(SpeedEvent event) {
//        WritableMap data = Arguments.createMap();
//        data.putDouble("time", event.getTime());
//        data.putDouble("speed", event.getSpeed());
//        data.putDouble("windMean",session.getWindMean());
//        emitData(data);
//    }
//
//    @Override
//    public void trueSpeedChanged(TrueSpeedEvent event) {
//        WritableMap data = Arguments.createMap();
//        data.putDouble("time", event.getTime());
//        data.putDouble("trueSpeed", event.getTrueSpeed());
//        data.putDouble("windMean",session.getWindMean());
//        emitData(data);
//
//    }
//
//    @Override
//    public void newDirectionEvent(DirectionEvent event) {
//        WritableMap data = Arguments.createMap();
//        data.putDouble("time", event.getTime());
//        data.putDouble("direction", event.getDirection());
//        emitData(data);
//    }
//
//    @Override
//    public void trueDirectionEvent(TrueDirectionEvent event) {
//        WritableMap data = Arguments.createMap();
//        data.putDouble("time", event.getTime());
//        data.putDouble("trueDirection", event.getTrueDirection());
//        emitData(data);
//
//    }

    private void emitData(String event, WritableMap data) {
        Log.d(TAG, "Emit: " + event + " " );
        module.emit(event, data);
    }

    private void initSDK(){
        if (vaavudSDK==null) {
            vaavudSDK = VaavudSDK.init(mContext);
            vaavudSDK.setListener(this);
        }
    }

    private void initEmmiter(){
        if (module == null) {
            module = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
    }

    @ReactMethod
    public void initBle(){
        Log.d(TAG, "initBle from React");
        initSDK();
        initEmmiter();
        Config config = new Config(null);
        config.setWindMeter(WindMeter.AEGIR);
        vaavudSDK.setConfig(config);
        LocationManager.getInstance().connect();
        try {
            vaavudSDK.initBLE(getCurrentActivity());
            emitData("onReadyToWork",null);
        } catch (VaavudError vaavudError) {
            emitData("onError",null);
        }

    }

    @ReactMethod
    public void onConnect() {
        Log.d(TAG, "Starting from React");
        initSDK();
        initEmmiter();
        try {
            session = vaavudSDK.startSession();
        } catch (VaavudError vaavudError) {
            emitData("onError",null);
        }
    }

    @ReactMethod
    public void isVaavudBLEConnected(){
        WritableMap map = new WritableNativeMap();
        if (VaavudSDK.init(mContext).isAegirAvailable()){
            map.putBoolean("available",true);
        }else{
            map.putBoolean("available",false);
        }
        emitData("onVaavudBLEFound",map);
    }

    @ReactMethod
    public void onDisconnect() {
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
                locationMap.putDouble("lat", 0.0);//session.getLastLocationEvent().getLocation().getLatitude());
                locationMap.putDouble("lon", 0.0);//session.getLastLocationEvent().getLocation().getLongitude());
                map.putMap("location", locationMap);
//                }
                emitData("onFinalData",map);
            } catch (VaavudError vaavudError) {
//                callback.reject(vaavudError);
                emitData("onError",null);
            }
        }


    }

    @Override
    public void onNewLocation(LocationEvent event){
        WritableMap map = Arguments.createMap();
        map.putBoolean("available",true);
        emitData("onLocationWorking",map);
    }

    @Override
    public void onNewData(HashMap data) {
//        WritableMap map = Arguments.createMap();
//        map = (WritableMap)data;
        emitData((String)data.get("message"),hashMapToWritableMap((HashMap<String,Object>)data.get("data")));
    }

//    @Override
//    public void onNewMessage(BleMessages message){
//        emitData("onNewRead",data);
//    }

    private WritableMap hashMapToWritableMap(HashMap<String,Object> hash){
        WritableMap map = Arguments.createMap();
        if (!hash.keySet().isEmpty()) {
            Iterator it = hash.keySet().iterator();
            while (it.hasNext()){
                String next = (String) it.next();
                switch (hash.get(next).getClass().getName()){
                    case "java.lang.Boolean":
                        map.putBoolean(next,(boolean)hash.get(next));
                        break;
                    case "java.lang.Integer":
                        map.putInt(next,(int)hash.get(next));
                        break;
                    case "java.lang.Double":
                        map.putDouble(next,(double)hash.get(next));
                        break;
                    case "java.lang.String":
                        map.putString(next,(String)hash.get(next));
                        break;
                    case "com.facebook.react.bridge.WritableNativeMap":
                        map.putMap(next,(WritableMap) hash.get(next));
                        break;
                }
            }
        }
        return map;
    }

    @Override
    public void onError(VaavudError error) {

    }
}
