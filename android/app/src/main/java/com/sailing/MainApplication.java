package com.sailing;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.crashlytics.android.Crashlytics;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.joshblour.reactnativeheading.ReactNativeHeadingPackage;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.sailing.packages.VaavudPackage;
import com.smixx.fabric.FabricPackage;
import com.vaavud.vaavudSDK.core.location.LocationManager;

import java.util.Arrays;
import java.util.List;

import io.fabric.sdk.android.Fabric;
import io.realm.react.RealmReactPackage;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.asList(new MainReactPackage(),
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new SnackbarPackage(),
            new MapsPackage(),
            new ReactNativeI18n(),
            new ReactNativeHeadingPackage(),
              new FabricPackage(),
              new LinearGradientPackage(),
              new ReactNativePermissionsPackage(),
              new FBSDKPackage(mCallbackManager),
              new VaavudPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    //FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
    Fabric.with(this, new Crashlytics());
  }
}
