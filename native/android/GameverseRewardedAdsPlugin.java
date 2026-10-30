package com.joaogdbg.alchemy35k;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

/**
 * Alchemy 10K rewarded ads (Google Mobile Ads SDK + UMP consent).
 *
 * Contract with client/src/app.js: showRewarded() resolves {earned:true} ONLY when the
 * SDK's OnUserEarnedRewardListener fired, and only after the ad was closed. Load
 * failures, timeouts, dismissals and show failures never grant a reward.
 *
 * TEST BUILD: uses Google's public rewarded TEST ad unit. Replace AD_UNIT_ID (and the
 * APPLICATION_ID meta-data written by tools/configure-android-admob.py) with your own
 * AdMob IDs before any Play Store release. Never click your own live ads.
 */
@CapacitorPlugin(name = "GameverseRewardedAds")
public class GameverseRewardedAdsPlugin extends Plugin {
    private static final String TAG = "AlchemyAds";
    // Google's official rewarded test unit: https://developers.google.com/admob/android/test-ads
    static final String AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";
    static final boolean TEST_ADS = true;
    private static final long LOAD_TIMEOUT_MS = 15000;

    private final Handler main = new Handler(Looper.getMainLooper());
    private ConsentInformation consent;
    private RewardedAd cachedAd;
    private PluginCall waitingCall;
    private Runnable waitingTimeout;
    private boolean sdkStarted = false;
    private boolean sdkReady = false;
    private boolean loading = false;
    private boolean showing = false;
    private String lastError = "";

    @Override
    public void load() {
        main.post(this::gatherConsentThenStart);
    }

    // EEA/UK: ask for consent (UMP) before requesting ads. If no consent form is
    // configured yet (test app), continue so that Google's test ads can be checked.
    private void gatherConsentThenStart() {
        Activity activity = getActivity();
        if (activity == null) return;
        try {
            consent = UserMessagingPlatform.getConsentInformation(activity);
            ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
            consent.requestConsentInfoUpdate(activity, params,
                () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity, formError -> {
                    if (formError != null) lastError = "consent_form_" + formError.getErrorCode();
                    startSdk();
                }),
                requestError -> {
                    lastError = "consent_info_" + requestError.getErrorCode();
                    startSdk();
                });
            if (consent.canRequestAds()) startSdk();
        } catch (Exception e) {
            Log.w(TAG, "Consent flow unavailable", e);
            lastError = "consent_exception";
            startSdk();
        }
    }

    private void startSdk() {
        if (sdkStarted) return;
        sdkStarted = true;
        final Activity activity = getActivity();
        if (activity == null) { sdkStarted = false; return; }
        new Thread(() -> MobileAds.initialize(activity.getApplicationContext(), status -> main.post(() -> {
            sdkReady = true;
            preload();
        }))).start();
    }

    private void preload() {
        if (!sdkReady || loading || showing || cachedAd != null) return;
        Activity activity = getActivity();
        if (activity == null) return;
        loading = true;
        RewardedAd.load(activity, AD_UNIT_ID, new AdRequest.Builder().build(), new RewardedAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull RewardedAd ad) {
                loading = false;
                cachedAd = ad;
                PluginCall call = takeWaiting();
                if (call != null) present(call);
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError error) {
                loading = false;
                lastError = "load_" + error.getCode();
                PluginCall call = takeWaiting();
                if (call != null) call.reject("Rewarded ad unavailable (" + error.getCode() + ")", "AD_LOAD_FAILED");
            }
        });
    }

    private PluginCall takeWaiting() {
        PluginCall call = waitingCall;
        waitingCall = null;
        if (waitingTimeout != null) { main.removeCallbacks(waitingTimeout); waitingTimeout = null; }
        return call;
    }

    @PluginMethod
    public void showRewarded(PluginCall call) {
        main.post(() -> {
            if (showing || waitingCall != null) { call.reject("Rewarded ad already in progress", "AD_BUSY"); return; }
            if (cachedAd != null) { present(call); return; }
            waitingCall = call;
            waitingTimeout = () -> {
                if (waitingCall == call) {
                    waitingCall = null;
                    waitingTimeout = null;
                    call.reject("Rewarded ad timed out", "AD_TIMEOUT");
                }
            };
            main.postDelayed(waitingTimeout, LOAD_TIMEOUT_MS);
            if (!sdkStarted) startSdk(); else preload();
        });
    }

    private void present(PluginCall call) {
        Activity activity = getActivity();
        RewardedAd ad = cachedAd;
        cachedAd = null;
        if (activity == null || ad == null) { call.reject("Rewarded ad unavailable", "AD_UNAVAILABLE"); preload(); return; }
        showing = true;
        final boolean[] earned = {false};
        final String kind = call.getString("kind", "");
        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override
            public void onAdDismissedFullScreenContent() {
                showing = false;
                JSObject result = new JSObject();
                result.put("earned", earned[0]);
                result.put("kind", kind);
                result.put("test", TEST_ADS);
                call.resolve(result);
                preload();
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError error) {
                showing = false;
                lastError = "show_" + error.getCode();
                call.reject("Rewarded ad failed to show (" + error.getCode() + ")", "AD_SHOW_FAILED");
                preload();
            }
        });
        ad.show(activity, rewardItem -> {
            earned[0] = true;
            Log.i(TAG, "Reward earned for " + kind);
        });
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        main.post(() -> {
            JSObject s = new JSObject();
            s.put("sdkReady", sdkReady);
            s.put("adReady", cachedAd != null);
            s.put("loading", loading);
            s.put("test", TEST_ADS);
            s.put("canRequestAds", consent == null || consent.canRequestAds());
            s.put("privacyOptionsRequired", consent != null
                && consent.getPrivacyOptionsRequirementStatus() == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED);
            s.put("lastError", lastError);
            call.resolve(s);
            preload();
        });
    }

    @PluginMethod
    public void showPrivacyOptions(PluginCall call) {
        main.post(() -> {
            Activity activity = getActivity();
            if (activity == null) { call.reject("No activity"); return; }
            UserMessagingPlatform.showPrivacyOptionsForm(activity, formError -> {
                JSObject r = new JSObject();
                r.put("shown", formError == null);
                if (formError != null) r.put("error", formError.getMessage());
                call.resolve(r);
            });
        });
    }
}
