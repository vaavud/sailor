package com.sailing;

import android.content.Intent;

import com.facebook.react.ReactActivity;
import com.horcrux.svg.SvgPackage;
import io.realm.react.RealmReactPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import it.innove.BleManagerPackage;
import com.horcrux.svg.SvgPackage;
import com.airbnb.android.react.maps.MapsPackage;
import io.realm.react.RealmReactPackage;

public class MainActivity extends ReactActivity {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
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
