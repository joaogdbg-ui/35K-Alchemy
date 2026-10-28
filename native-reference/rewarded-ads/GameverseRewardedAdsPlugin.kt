package com.gameverse.alchemy

import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

/** Example native Capacitor adapter. Compile and integrate only when Android AdMob is configured.
 * Does not grant rewards for viewing, loading, dismissal or simulated callbacks.
 * Only the SDK onUserEarnedReward listener credits the user.
 */
@CapacitorPlugin(name = "GameverseRewardedAds")
class GameverseRewardedAdsPlugin : Plugin() {
    // Google's rewarded test ad unit for Android. Replace before release.
    // THIS ID MUST NEVER BE USED IN A PRODUCTION MONETIZED RELEASE.
    private val testAdUnitId = "ca-app-pub-3940256099942544/5224354917"
    private var pending = false

    @PluginMethod
    fun showRewarded(call: PluginCall) {
        activity.runOnUiThread {
            if (pending) {
                call.reject("Rewarded ad already in progress")
                return@runOnUiThread
            }
            pending = true
            RewardedAd.load(
                activity, testAdUnitId, AdRequest.Builder().build(),
                object : RewardedAdLoadCallback() {
                    override fun onAdFailedToLoad(error: LoadAdError) {
                        pending = false
                        call.reject("Rewarded ad unavailable: ${error.code}")
                    }
                    override fun onAdLoaded(ad: RewardedAd) {
                        var resolved = false
                        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                            override fun onAdDismissedFullScreenContent() {
                                pending = false
                                if (!resolved) {
                                    resolved = true
                                    call.resolve(JSObject().put("earned", false))
                                }
                            }
                            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                                pending = false
                                if (!resolved) {
                                    resolved = true
                                    call.reject("Rewarded ad failed to show: ${error.code}")
                                }
                            }
                        }
                        ad.show(activity) { reward ->
                            if (!resolved) {
                                resolved = true
                                call.resolve(JSObject().put("earned", true))
                                Log.i("GameverseAds", "Reward granted by SDK: ${reward.amount} ${reward.type}")
                            }
                        }
                    }
                }
            )
        }
    }
}
