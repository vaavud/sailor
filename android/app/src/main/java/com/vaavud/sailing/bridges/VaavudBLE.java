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
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.goebl.simplify.PointExtractor;
import com.vaavud.vaavudSDK.core.VaavudError;
import com.vaavud.vaavudSDK.core.aegir.AegirController;
import com.vaavud.vaavudSDK.core.listener.VaavudDataListener;
import com.vaavud.vaavudSDK.model.LatLng;
import com.vaavud.vaavudSDK.model.event.LocationEvent;
import com.vaavud.vaavudSDK.model.MeasurementData;
import com.vaavud.vaavudSDK.model.event.TrueDirectionEvent;
import com.vaavud.vaavudSDK.model.event.TrueSpeedEvent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.logging.Handler;
import java.util.logging.LogRecord;

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
        Log.d(TAG, "Emit: " + event + " " + this.toString());
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event,data);


    }

    private void initSDK(){
        if (aegirSDK==null) {
            aegirSDK = AegirController.init(getCurrentActivity());
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
        Log.d(TAG, "Read Row Data from React "+this.toString());
        initBle();
        aegirSDK.onStartSDK("D4:8D:36:A5:73:35",readableMapToHashMap(map),fromSDK);
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
        Log.d(TAG, "Starting from React");
        initBle();
        aegirSDK.onStartSDK(null,readableMapToHashMap(map),true);
        callback.resolve(aegirSDK.startSession());
    }

    @ReactMethod
    public void onStopSDK(Promise callback){
        Log.d(TAG, "Stoping from React");
        aegirSDK.onStopSDK();
        mdata = aegirSDK.stopSession();

        ArrayList<HashMap<String,Double>> simplifiedLocation = new ArrayList<>();
        ArrayList<HashMap<String,Double>> simplifiedSpeed = new ArrayList<>();
        ArrayList<HashMap<String,Integer>> simplifiedDirection = new ArrayList<>();

//        Location[] coords = mdata.getLocations(); // the array of your "original" points
//
//        Simplify<LatLng> simplify = new Simplify<LatLng>(new LatLng[0], latLngPointExtractor);
//
//        LatLng[] simplified = simplify.simplify(coords, 20f, false);



        HashMap<String, Object> data = new HashMap<>();
        data.put("points",mdata.getMeasurementPoints());
        data.put("locations",simplifiedLocation);
        data.put("speeds",simplifiedSpeed);
        data.put("directions",simplifiedDirection);

        emitData("onFinalData",hashMapToWritableMap(data));
        callback.resolve(null);
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
        Log.d(TAG, "Stoping from React");
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
                    case "java.util.HashMap<K,V>":
                        map.putMap(next,(WritableMap) hash.get(next));
                        break;
                    case "com.facebook.react.bridge.WritableNativeMap":
                        map.putMap(next,(WritableMap) hash.get(next));
                        break;
                }
            }
        }
        return map;
    }

    private HashMap<String,Object> readableMapToHashMap(ReadableMap map){
        HashMap<String,Object> hashMap = new HashMap<>();
        if (!map.keySetIterator().hasNextKey()) {
            ReadableMapKeySetIterator it = map.keySetIterator();
            while (it.hasNextKey()){
                String next = (String) it.nextKey();
                Log.d(TAG,map.getType(next).name());
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
