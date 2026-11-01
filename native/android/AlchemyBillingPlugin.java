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

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Alchemy 10K one-time purchases (Google Play Billing): "Remove ads" ({@link #PRODUCT_ID}) and,
 * since V125, the second on-screen companion slot ({@link #SLOT_ID}, owner price EUR 1.00).
 *
 * Product: an in-app, non-consumable product with ID {@link #PRODUCT_ID}, created by the
 * owner in Play Console (Monetize > Products > In-app products, price EUR 2.00 since V126).
 * Until that product exists and the app is installed from a Play track, Play returns
 * ITEM_UNAVAILABLE and the game simply keeps its free (ad-supported) behaviour.
 *
 * The entitlement is reported to JS only from Play's own purchase records
 * (PURCHASED state); purchases are acknowledged so Play does not refund them.
 */
@CapacitorPlugin(name = "AlchemyBilling")
public class AlchemyBillingPlugin extends Plugin implements PurchasesUpdatedListener {
    static final String PRODUCT_ID = "no_ads";
    static final String SLOT_ID = "companion_slot";
    private BillingClient client;
    private ProductDetails details;
    private final Map<String, ProductDetails> all = new HashMap<>();
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
        List<QueryProductDetailsParams.Product> products = new ArrayList<>();
        for (String id : new String[]{PRODUCT_ID, SLOT_ID})
            products.add(QueryProductDetailsParams.Product.newBuilder().setProductId(id).setProductType(BillingClient.ProductType.INAPP).build());
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder().setProductList(products).build();
        client.queryProductDetailsAsync(params, (r, result) -> {
            List<ProductDetails> list = result == null ? null : result.getProductDetailsList();
            if (list != null) for (ProductDetails d : list) all.put(d.getProductId(), d);
            details = all.get(PRODUCT_ID);
            then.run();
        });
    }

    private boolean owns(List<Purchase> purchases) { return owns(purchases, PRODUCT_ID); }

    private boolean owns(List<Purchase> purchases, String productId) {
        if (purchases == null) return false;
        boolean owned = false;
        for (Purchase p : purchases) {
            if (!p.getProducts().contains(productId)) continue;
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
        ProductDetails slot = all.get(SLOT_ID);
        o.put("slotAvailable", slot != null);
        if (slot != null && slot.getOneTimePurchaseOfferDetails() != null)
            o.put("slotPrice", slot.getOneTimePurchaseOfferDetails().getFormattedPrice());
        return o;
    }

    private JSObject fullStatus(List<Purchase> purchases) {
        JSObject o = status(owns(purchases));
        o.put("companionSlot", owns(purchases, SLOT_ID));
        return o;
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        withConnection(call, () -> loadDetails(() -> client.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
            (r, purchases) -> call.resolve(fullStatus(purchases)))));
    }

    @PluginMethod
    public void purchaseNoAds(PluginCall call) { purchase(call, PRODUCT_ID); }

    @PluginMethod
    public void purchaseCompanionSlot(PluginCall call) { purchase(call, SLOT_ID); }

    private void purchase(PluginCall call, String productId) {
        withConnection(call, () -> loadDetails(() -> {
            ProductDetails target = all.get(productId);
            if (target == null) { call.reject("Product not available yet"); return; }
            pendingPurchase = call;
            BillingFlowParams flow = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(Collections.singletonList(
                    BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(target).build()))
                .build();
            getActivity().runOnUiThread(() -> {
                BillingResult r = client.launchBillingFlow(getActivity(), flow);
                if (r.getResponseCode() != BillingClient.BillingResponseCode.OK && pendingPurchase != null) {
                    PluginCall c = pendingPurchase; pendingPurchase = null;
                    if (r.getResponseCode() == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) {
                        JSObject o = status(PRODUCT_ID.equals(productId));
                        if (SLOT_ID.equals(productId)) o.put("companionSlot", true);
                        c.resolve(o);
                    }
                    else c.reject("Purchase not started (" + r.getResponseCode() + ")");
                }
            });
        }));
    }

    @Override
    public void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        PluginCall c = pendingPurchase; pendingPurchase = null;
        int code = result.getResponseCode();
        owns(purchases); owns(purchases, SLOT_ID); // acknowledges whatever was just bought
        boolean anyPending = false;
        if (purchases != null) for (Purchase p : purchases) if (p.getPurchaseState() == Purchase.PurchaseState.PENDING) anyPending = true;
        final boolean pending = anyPending;
        // Report entitlements from ALL owned purchases, so buying one product never hides the other.
        client.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
            (r, owned) -> {
                JSObject o = fullStatus(owned);
                o.put("cancelled", code == BillingClient.BillingResponseCode.USER_CANCELED);
                o.put("pending", pending);
                notifyListeners("billingChanged", o);
                if (c != null) c.resolve(o);
            });
    }
}
