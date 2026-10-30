package com.joaogdbg.alchemy35k;

import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Alchemy 10K backup export. Android WebViews ignore <a download>, so the backup JSON
 * is written to the app cache and offered through the system share sheet (Drive,
 * Files, e-mail, messaging). Uses Capacitor's own FileProvider (<applicationId>.fileprovider,
 * cache-path checked by tools/configure-android-admob.py).
 */
@CapacitorPlugin(name = "AlchemyBackup")
public class AlchemyBackupPlugin extends Plugin {
    private static final int MAX_CHARS = 3_000_000;

    @PluginMethod
    public void shareFile(PluginCall call) {
        String content = call.getString("content");
        String requested = call.getString("filename", "Alchemy_10K_Backup.json");
        if (content == null || content.isEmpty() || content.length() > MAX_CHARS) {
            call.reject("Invalid backup content");
            return;
        }
        String name = requested.replaceAll("[^A-Za-z0-9._-]", "_");
        if (!name.endsWith(".json")) name = name + ".json";
        try {
            File dir = new File(getContext().getCacheDir(), "backups");
            if (!dir.isDirectory() && !dir.mkdirs()) throw new IllegalStateException("cache directory");
            File file = new File(dir, name);
            try (FileOutputStream out = new FileOutputStream(file)) {
                out.write(content.getBytes(StandardCharsets.UTF_8));
            }
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", file);
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("application/json");
            send.putExtra(Intent.EXTRA_STREAM, uri);
            send.putExtra(Intent.EXTRA_SUBJECT, name);
            send.setClipData(ClipData.newRawUri(name, uri));
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Intent chooser = Intent.createChooser(send, "Save Alchemy 10K backup");
            chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            getActivity().startActivity(chooser);
            JSObject result = new JSObject();
            result.put("shared", true);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Backup share failed: " + e.getMessage());
        }
    }
}
