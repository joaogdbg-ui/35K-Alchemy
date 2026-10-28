#!/usr/bin/env python3
"""Configure generated Capacitor MainActivity for 35K Alchemy immersive Android.

The app intentionally hides both system bars; Android navigation/notifications
remain available temporarily with edge swipes. Keep Capacitor's edge-to-edge
insets handling for cutouts, keyboard transitions and modern WebViews.
Run after npx cap add android / npx cap sync android.
"""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
candidates = list((root / "android/app/src/main/java").rglob("MainActivity.java"))
if len(candidates) != 1:
    raise SystemExit(f"Expected one MainActivity.java, found {len(candidates)}")
path = candidates[0]
src = path.read_text(encoding="utf-8")
if "hideSystemBarsForGame()" in src:
    if "BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE" not in src:
        raise SystemExit("Existing immersive patch is incomplete")
    print("Android immersive mode already configured:", path)
    raise SystemExit(0)

if "extends BridgeActivity" not in src or "import com.getcapacitor.BridgeActivity;" not in src:
    raise SystemExit("Unknown Capacitor MainActivity: refusing to modify")
if "onCreate(" in src or "onWindowFocusChanged(" in src:
    raise SystemExit("Activity already overrides lifecycle: manual review needed")
if not re.search(r"\bpackage\s+com\.joaogdbg\.alchemy35k\s*;", src):
    raise SystemExit("Unexpected Android application ID")

src = src.replace(
    "import com.getcapacitor.BridgeActivity;",
    "import com.getcapacitor.BridgeActivity;\n"
    "import android.os.Build;\n"
    "import android.os.Bundle;\n"
    "import android.view.View;\n"
    "import android.view.WindowInsets;\n"
    "import android.view.WindowInsetsController;\n"
    "import androidx.activity.EdgeToEdge;",
    1,
)
pattern = r"(public\s+class\s+MainActivity\s+extends\s+BridgeActivity\s*\{)"
replacement = """
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Capacitor 8 SystemBars supplies correct WebView insets for cutouts.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            EdgeToEdge.enable(this);
        }
        hideSystemBarsForGame();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // A system dialog or screen switch can restore bars: re-enter immersive
        // mode only when the game regains focus.
        if (hasFocus) hideSystemBarsForGame();
    }

    private void hideSystemBarsForGame() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.setSystemBarsBehavior(
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
                controller.hide(
                    WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars()
                );
            }
        } else {
            // Android 7-10 legacy immersive sticky (Capacitor 8 minSdk 24).
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            );
        }
    }
"""
src, count = re.subn(pattern, lambda m: m.group(0) + replacement, src, count=1)
if count != 1:
    raise SystemExit("Cannot inject fullscreen Android Activity")
path.write_text(src, encoding="utf-8")
print("Configured full immersive 35K Alchemy Android:", path)
