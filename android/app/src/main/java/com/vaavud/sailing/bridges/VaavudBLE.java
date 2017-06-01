package com.vaavud.sailing.bridges;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.goebl.simplify.PointExtractor;
import com.goebl.simplify.Simplify;
import com.vaavud.vaavudSDK.core.VaavudError;
import com.vaavud.vaavudSDK.core.aegir.AegirController;
import com.vaavud.vaavudSDK.core.listener.VaavudDataListener;
import com.vaavud.vaavudSDK.model.LatLng;
import com.vaavud.vaavudSDK.model.event.LocationEvent;
import com.vaavud.vaavudSDK.model.MeasurementData;
import com.vaavud.vaavudSDK.model.event.SpeedEvent;
import com.vaavud.vaavudSDK.model.event.TrueDirectionEvent;
import com.vaavud.vaavudSDK.model.event.TrueSpeedEvent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Handler;
import java.util.logging.LogRecord;
import java.util.Date;

/**
 * Created by juan on 13/02/2017.
 * <p>
 * Created by juan on 21/01/16.
 */
/**
 * Created by juan on 21/01/16.
 */

public class VaavudBLE extends ReactContextBaseJavaModule implements VaavudDataListener {

    private static final String TAG = "VaavudBle";
    private AegirController aegirSDK;
    private Context mContext;
    private ReactContext reactContext;
    private DeviceEventManagerModule.RCTDeviceEventEmitter module;
    private MeasurementData mdata;

    private long lastEvent = 0;

    public VaavudBLE(ReactApplicationContext _reactContext) {
        super(_reactContext);
        mContext = _reactContext.getBaseContext();
        reactContext = _reactContext;
    }

    @Override
    public String getName() {
        return "VaavudBle";
    }

    private void emitData(final String event, final WritableMap data) {
        long time = new Date().getTime();
//        Log.d(TAG, "Time: "+time+ " Emit: " + event + " " + this.toString());
        module.emit(event, data);
    }

    private void initSDK(){
        if (aegirSDK==null) {
            aegirSDK = AegirController.init(reactContext,reactContext.getCurrentActivity());
            aegirSDK.setVaavudDataListener(this);
        }
    }

    private void initEmmiter(){
        if (module == null) {
            module = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
    }

    private void initBle(){
        initSDK();
        initEmmiter();
    }


    @ReactMethod
    public void readRowData(boolean fromSDK, ReadableMap map, Promise callback){
        //Log.d(TAG, "Read Row Data from React "+this.toString());
        initBle();
        aegirSDK.onStartSDK(null,readableMapToHashMap(map),fromSDK);
        if (fromSDK) aegirSDK.startSession();
//        Log.d(TAG,"readRowData");
        callback.resolve(null);
    }

    @ReactMethod
    public void addOffset(int offset, Promise callback){
        aegirSDK.addOffset(offset);
        callback.resolve(null);
    }

    @ReactMethod
    public void calibrateCompass(boolean enable, Promise callback){
        aegirSDK.calibrateCompass(enable);
        callback.resolve(null);
    }

    @ReactMethod
    public void onStartSDK(ReadableMap map, Promise callback){
        //Log.d(TAG, "Starting from React");
        initBle();
        aegirSDK.onStartSDK(null,readableMapToHashMap(map),true);
        callback.resolve(aegirSDK.startSession());
    }


    @ReactMethod
    public void onStopSdk(){
        //Log.d(TAG, "Stoping from React");
        aegirSDK.onStopSDK();
        mdata = aegirSDK.stopSession();


        LatLng[] cords = mdata.getLocationsArray(); // the array of your "original" points
        TrueSpeedEvent[] speeds = mdata.getTrueWindSpeedsArray();
        TrueDirectionEvent[] directions = mdata.getTrueWindDirectionsArray();


        Simplify<LatLng> simplifyLatLng = new Simplify<LatLng>(new LatLng[0], latLngPointExtractor);
        Simplify<TrueSpeedEvent> simplifyTrueSpeed = new Simplify<TrueSpeedEvent>(new TrueSpeedEvent[0], speedPointExtractor);
        Simplify<TrueDirectionEvent> simplifyTrueDirection = new Simplify<TrueDirectionEvent>(new TrueDirectionEvent[0], directionPointExtractor);

        LatLng[] simplifiedLatLng = simplifyLatLng.simplify(cords, 0.0001f, false);
        TrueSpeedEvent[] simplifiedTrueSpeed = simplifyTrueSpeed.simplify(speeds, 0.5f, false);
        TrueDirectionEvent[] simplifiedTrueDirection = simplifyTrueDirection.simplify(directions, 22.5f, false);

        Log.d(TAG, "Sizes:" + simplifiedLatLng.length +" "+ simplifiedTrueDirection.length + " " + simplifiedTrueSpeed.length);

        WritableArray simplifiedLatLngDict = Arguments.createArray();
        for (int i=0;i<simplifiedLatLng.length;i++){
            WritableMap map = Arguments.createMap();
            map.putDouble("lat",simplifiedLatLng[i].getLatitude());
            map.putDouble("lon",simplifiedLatLng[i].getLongitude());
            simplifiedLatLngDict.pushMap(map);
        }
        WritableArray simplifiedTrueSpeedDict = Arguments.createArray();
        for (int i=0;i<simplifiedTrueSpeed.length;i++){
            WritableMap map = Arguments.createMap();
            map.putDouble("timestamp",simplifiedTrueSpeed[i].getTime());
            map.putDouble("windSpeed",simplifiedTrueSpeed[i].getTrueSpeed());
            simplifiedTrueSpeedDict.pushMap(map);
        }
        WritableArray simplifiedTrueDirectionDict = Arguments.createArray();
        for (int i=0;i<simplifiedTrueDirection.length;i++){
            WritableMap map = Arguments.createMap();
            map.putDouble("timestamp",simplifiedTrueDirection[i].getTime());
            map.putDouble("windDirection",simplifiedTrueDirection[i].getTrueDirection());
            simplifiedTrueDirectionDict.pushMap(map);
        }

        //Log.d(TAG,"Arguments "+ Arguments.fromJavaArgs(simplifiedTrueDirectionDict));
        HashMap<String, Object> data = new HashMap<>();
        data.put("measurementPoints",mdata.getMeasurementPoints());
        data.put("locations",simplifiedLatLngDict);
        data.put("speeds",simplifiedTrueSpeedDict);
        data.put("directions",simplifiedTrueDirectionDict);
        data.put("session",mdata.getSession());

        emitData("onFinalData",hashMapToWritableMap(data));
//        callback.resolve(null);
    }

    @ReactMethod
    public void isVaavudBLEConnected(Promise callback){
        WritableMap map = new WritableNativeMap();
        if (aegirSDK.isConnected()){
            map.putBoolean("available",true);
        }else{
            map.putBoolean("available",false);
        }
        emitData("onVaavudBLEFound",map);
        callback.resolve(null);
    }

    @ReactMethod
    public void onDisconnect(Promise callback) {
        //Log.d(TAG, "Stoping from React");
        if (aegirSDK != null) {
            aegirSDK.onDisconnect();
        }
        emitData("onCompleted", hashMapToWritableMap(new HashMap<String,Object>()));
        callback.resolve(null);
    }

    @Override
    public void onNewLocation(LocationEvent event){
        WritableMap map = Arguments.createMap();
        map.putBoolean("available",true);
        emitData("onLocationWorking",map);
    }

    @Override
    public void onNewData(final String message,final HashMap data) {
//        WritableMap map = Arguments.createMap();
//        map = (WritableMap)data;
//        Log.d(TAG,"Data: "+data.toString());
        emitData(message,hashMapToWritableMap(data));
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
                //Log.d(TAG,next + " " + hash.get(next).getClass().getName());
                switch (hash.get(next).getClass().getName()){
                    case "java.lang.Boolean":
                        map.putBoolean(next,(boolean)hash.get(next));
                        break;
                    case "java.lang.Integer":
                        map.putInt(next,(int)hash.get(next));
                        break;
                    case "java.lang.Long":
                        map.putDouble(next,((Long)hash.get(next)).doubleValue());
                        break;
                    case "java.lang.Double":
                        //Log.d(TAG,next + " "+ (double)hash.get(next));
                        map.putDouble(next,(double)hash.get(next));
                        break;
                    case "java.lang.String":
                        map.putString(next,(String)hash.get(next));
                        break;
                    case "java.lang.Object[]":
                        Log.d(TAG,"Next_java.lang.Object[] " + next);
                        map.putArray(next,Arguments.fromJavaArgs((Object[]) hash.get(next)));
                        break;
                    case "java.util.ArrayList":
                        map.putArray(next,arrayListToWritableArray((ArrayList<Object>)hash.get(next)));
                        break;
                    case "java.util.HashMap":
                        map.putMap(next,hashMapToWritableMap((HashMap<String,Object>)hash.get(next)));
                        break;
                    case "com.facebook.react.bridge.WritableNativeMap":
                        map.putMap(next,(WritableMap) hash.get(next));
                        break;
                    case "com.facebook.react.bridge.WritableNativeArray":
                        map.putArray(next,(WritableArray) hash.get(next));
                        break;
                    default:
                        Log.d(TAG,"Default: " + next);
                        map.putArray(next,Arguments.fromJavaArgs((Object[]) hash.get(next)));
                }
            }
        }
        return map;
    }

    private WritableArray arrayListToWritableArray(ArrayList<Object> array){

        WritableNativeArray arguments = new WritableNativeArray();
        for (int i = 0; i < array.size(); i++) {
            Object argument = array.get(i);
            if (argument == null) {
                arguments.pushNull();
                continue;
            }
            Class argumentClass = argument.getClass();
            if (argumentClass == Boolean.class) {
                arguments.pushBoolean(((Boolean) argument).booleanValue());
            } else if (argumentClass == Integer.class) {
                arguments.pushDouble(((Integer) argument).doubleValue());
            } else if (argumentClass == Double.class) {
                arguments.pushDouble(((Double) argument).doubleValue());
            } else if (argumentClass == Float.class) {
                arguments.pushDouble(((Float) argument).doubleValue());
            } else if (argumentClass == String.class) {
                arguments.pushString(argument.toString());
            } else if (argumentClass == ArrayList.class) {
                arguments.pushArray(arrayListToWritableArray((ArrayList<Object>) argument));
            } else if (argumentClass == HashMap.class) {
                arguments.pushMap(hashMapToWritableMap((HashMap<String, Object>) argument));
            } else if (argumentClass == WritableNativeMap.class) {
                arguments.pushMap((WritableNativeMap) argument);
            } else if (argumentClass == WritableNativeArray.class) {
                arguments.pushArray((WritableNativeArray) argument);
            } else {
            throw new RuntimeException("Cannot convert argument of type " + argumentClass);
          }
        }
        return arguments;



    }

    private HashMap<String,Object> readableMapToHashMap(ReadableMap map){
        HashMap<String,Object> hashMap = new HashMap<>();
        if (!map.keySetIterator().hasNextKey()) {
            ReadableMapKeySetIterator it = map.keySetIterator();
            while (it.hasNextKey()){
                String next = (String) it.nextKey();
                //Log.d(TAG,map.getType(next).name());
//                switch (map.getType(next)){
//
//                    case "java.lang.Boolean":
//                        map.putBoolean(next,(boolean)hash.get(next));
//                        break;
//                    case "java.lang.Integer":
//                        map.putInt(next,(int)hash.get(next));
//                        break;
//                    case "java.lang.Double":
//                        map.putDouble(next,(double)hash.get(next));
//                        break;
//                    case "java.lang.String":
//                        map.putString(next,(String)hash.get(next));
//                        break;
//                    case "com.facebook.react.bridge.WritableNativeMap":
//                        map.putMap(next,(WritableMap) hash.get(next));
//                        break;
//                }
            }
        }
        return hashMap;
    }

    @Override
    public void onError(VaavudError error) {

    }

    private static PointExtractor<LatLng> latLngPointExtractor = new PointExtractor<LatLng>() {
        @Override
        public double getX(LatLng point) {
            return point.getLatitude() * 1000000;
        }

        @Override
        public double getY(LatLng point) {
            return point.getLongitude() * 1000000;
        }
    };

    private static PointExtractor<TrueSpeedEvent> speedPointExtractor = new PointExtractor<TrueSpeedEvent>() {
        @Override
        public double getX(TrueSpeedEvent point) {
            return point.getTime();
        }

        @Override
        public double getY(TrueSpeedEvent point) {
            return point.getTrueSpeed();
        }
    };

    private static PointExtractor<TrueDirectionEvent> directionPointExtractor = new PointExtractor<TrueDirectionEvent>() {
        @Override
        public double getX(TrueDirectionEvent point) {
            return point.getTime();
        }

        @Override
        public double getY(TrueDirectionEvent point) {
            return point.getTrueDirection();
        }
    };

}
