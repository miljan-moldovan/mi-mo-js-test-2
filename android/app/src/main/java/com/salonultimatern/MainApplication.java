package com.salonultimatern;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.zyu.ReactNativeWheelPickerPackage;
import com.beefe.picker.PickerViewPackage;
import io.sentry.RNSentryPackage;
import com.actionsheet.ActionSheetPackage;
import com.horcrux.svg.SvgPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeWheelPickerPackage(),
            new PickerViewPackage(),
            new RNSentryPackage(MainApplication.this),
            new ActionSheetPackage(),
            new SvgPackage(),
            new FingerprintAuthPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
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
  }
}
