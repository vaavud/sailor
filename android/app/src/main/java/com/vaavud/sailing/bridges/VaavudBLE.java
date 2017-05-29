package com.vaavud.sailing.bridges;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
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
import com.vaavud.vaavudSDK.model.WindMeter;
import com.vaavud.vaavudSDK.model.event.SpeedEvent;
import com.vaavud.vaavudSDK.model.event.TrueDirectionEvent;
import com.vaavud.vaavudSDK.model.event.TrueSpeedEvent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

/**
 * Created by juan on 13/02/2017.
 * <p>
 * Created by juan on 21/01/16.
 */
/**
 * Created by juan on 21/01/16.
 */

public class VaavudBLE extends ReactContextBaseJavaModule implements VaavudDataListener {

    private static final String TAG = "VaavudAPI";
    private AegirController aegirSDK;
    private Context mContext;
    private DeviceEventManagerModule.RCTDeviceEventEmitter module;
    private MeasurementData mdata;

    public VaavudBLE(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext.getBaseContext();
//        initSDK();
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
        if (aegirSDK==null) {
            aegirSDK = AegirController.init(getCurrentActivity());
        }
    }

    private void initEmmiter(){
        if (module == null) {
            module = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
            aegirSDK.setVaavudDataListener(this);
        }
    }

    private void initBle(){
        initSDK();
        initEmmiter();
    }


    @ReactMethod
    public void readRowData(boolean fromSDK,ReadableMap map){
        initBle();
        aegirSDK.onStartSDK(null,readableMapToHashMap(map),fromSDK);
//        Log.d(TAG,"readRowData");

    }

    @ReactMethod
    public void addOffset(int offset){
        aegirSDK.addOffset(offset);
    }

    @ReactMethod
    public void calibrateCompass(boolean enable){
        aegirSDK.calibrateCompass(enable);
    }

    @ReactMethod
    public void onStartSDK(ReadableMap map){
        Log.d(TAG, "Starting from React");
        initBle();
        aegirSDK.onStartSDK(null,readableMapToHashMap(map),false);
        aegirSDK.startSession();
    }

    @ReactMethod
    public void onStopSDK(){
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
    }


    @ReactMethod
    public void isVaavudBLEConnected(){
        WritableMap map = new WritableNativeMap();
        if (aegirSDK.isConnected()){
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
        if (aegirSDK != null) {
            aegirSDK.onDisconnect();
        }
        emitData("onCompleted", hashMapToWritableMap(new HashMap<String,Object>()));


    }

    @Override
    public void onNewLocation(LocationEvent event){
        WritableMap map = Arguments.createMap();
        map.putBoolean("available",true);
        emitData("onLocationWorking",map);
    }

    @Override
    public void onNewData(String message,HashMap data) {
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
