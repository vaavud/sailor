package com.sailing;

import android.content.Intent;

import com.facebook.react.ReactActivity;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.vaavud.vaavudSDK.VaavudSDK;

public class MainActivity extends ReactActivity {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        VaavudSDK.init(getApplicationContext()).onActivityResult(this,requestCode,resultCode,data);

    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "sailing";
    }
}
