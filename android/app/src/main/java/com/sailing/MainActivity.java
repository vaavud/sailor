package com.sailing;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.vaavud.vaavudSDK.core.aegir.AegirController;
import com.vaavud.vaavudSDK.core.location.LocationManager;

public class MainActivity extends ReactActivity {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        AegirController.init(this).onActivityResult(requestCode,resultCode,data);
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
        super.onCreate(savedInstance);
        LocationManager.getInstance().init(this);
    }
}
