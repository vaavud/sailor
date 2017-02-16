package com.sailing;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.vaavud.vaavudSDK.Config;
import com.vaavud.vaavudSDK.VaavudSDK;
import com.vaavud.vaavudSDK.core.VaavudError;
import com.vaavud.vaavudSDK.model.WindMeter;

public class MainActivity extends ReactActivity {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        VaavudSDK.init(this).onActivityResult(requestCode,resultCode,data);
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "sailing";
    }

    @Override
    protected void onCreate(Bundle savedInstance) {
//        Log.d("MainActivity","onCreates");
//        try {
////
////            Config config = new Config(null);
////            config.setWindMeter(WindMeter.AEGIR);
////            VaavudSDK.init(this).setConfig(config);
////            VaavudSDK.init(this).initBLE();
////            VaavudSDK.init(this).startSession();
//        } catch (VaavudError vaavudError) {
//            vaavudError.printStackTrace();
//        }
        super.onCreate(savedInstance);
    }
}
