package com.vaavud.sailor.packages;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.vaavud.sailor.bridges.VaavudBLE;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by juan on 14/02/2017.
 */

public class VaavudPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {

        List<NativeModule> modules = new ArrayList<>();

        modules.add(new VaavudBLE(reactContext));

        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(
            ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
