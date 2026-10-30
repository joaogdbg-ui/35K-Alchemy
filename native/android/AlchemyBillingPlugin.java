package com.joaogdbg.alchemy35k;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Collections;
import java.util.List;

/**
 * Alchemy 10K "Remove ads" one-time purchase (Google Play Billing).
 *
 * Product: an in-app, non-consumable product with ID {@link #PRODUCT_ID}, created by the
 * owner in Play Console (Monetize > Products > In-app products, price EUR 1.50).
 * Until that product exists and the app is installed from a Play track, Play returns
 * ITEM_UNAVAILABLE and the game simply keeps its free (ad-supported) behaviour.
 *
 * The entitlement is reported to JS only from Play's own purchase records
 * (PURCHASED state); purchases are acknowledged so Play does not refund them.
 */
@CapacitorPlugin(name = "AlchemyBilling")
public class AlchemyBillingPlugin extends Plugin implements PurchasesUpdatedListener {
    static final String PRODUCT_ID = "no_ads";
    private BillingClient client;
    private ProductDetails details;
    private PluginCall pendingPurchase;

    @Override
    public void load() {
        client = BillingClient.newBuilder(getContext())
            .setListener(this)
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .build();
    }

    private interface Ready { void run(); }

    private void withConnection(PluginCall call, Ready ready) {
        if (client.isReady()) { ready.run(); return; }
        client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult r) {
                if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) ready.run();
                else call.reject("Billing unavailable (" + r.getResponseCode() + ")");
            }
            @Override public void onBillingServiceDisconnected() { /* reconnect on next call */ }
        });
    }

    private void loadDetails(Ready then) {
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(Collections.singletonList(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(PRODUCT_ID).setProductType(BillingClient.ProductType.INAPP).build()))
            .build();
        client.queryProductDetailsAsync(params, (r, result) -> {
            List<ProductDetails> list = result == null ? null : result.getProductDetailsList();
            if (list != null && !list.isEmpty()) details = list.get(0);
            then.run();
        });
    }

    private boolean owns(List<Purchase> purchases) {
        if (purchases == null) return false;
        boolean owned = false;
        for (Purchase p : purchases) {
            if (!p.getProducts().contains(PRODUCT_ID)) continue;
            if (p.getPurchaseState() != Purchase.PurchaseState.PURCHASED) continue;
            owned = true;
            if (!p.isAcknowledged()) {
                client.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder()
                    .setPurchaseToken(p.getPurchaseToken()).build(), ack -> { });
            }
        }
        return owned;
    }

    private JSObject status(boolean owned) {
        JSObject o = new JSObject();
        o.put("noAds", owned);
        o.put("available", details != null);
        if (details != null && details.getOneTimePurchaseOfferDetails() != null)
            o.put("price", details.getOneTimePurchaseOfferDetails().getFormattedPrice());
        return o;
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        withConnection(call, () -> loadDetails(() -> client.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
            (r, purchases) -> call.resolve(status(owns(purchases))))));
    }

    @PluginMethod
    public void purchaseNoAds(PluginCall call) {
        withConnection(call, () -> loadDetails(() -> {
            if (details == null) { call.reject("Product not available yet"); return; }
            pendingPurchase = call;
            BillingFlowParams flow = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(Collections.singletonList(
                    BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(details).build()))
                .build();
            getActivity().runOnUiThread(() -> {
                BillingResult r = client.launchBillingFlow(getActivity(), flow);
                if (r.getResponseCode() != BillingClient.BillingResponseCode.OK && pendingPurchase != null) {
                    PluginCall c = pendingPurchase; pendingPurchase = null;
                    if (r.getResponseCode() == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) c.resolve(status(true));
                    else c.reject("Purchase not started (" + r.getResponseCode() + ")");
                }
            });
        }));
    }

    @Override
    public void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        PluginCall c = pendingPurchase; pendingPurchase = null;
        int code = result.getResponseCode();
        boolean owned = owns(purchases);
        JSObject o = status(owned || code == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED);
        o.put("cancelled", code == BillingClient.BillingResponseCode.USER_CANCELED);
        o.put("pending", purchases != null && !owned && !purchases.isEmpty());
        notifyListeners("billingChanged", o);
        if (c != null) c.resolve(o);
    }
}
