#!/usr/bin/env python3
"""Configure Capacitor's generated MainActivity for Android 16+ system bars.

Run *after* npx cap add android / npx cap sync android. Intentionally kept as
an explicit Android packaging step, not a change to the offline game.
"""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
candidates = list((root / "android/app/src/main/java").rglob("MainActivity.java"))
if len(candidates) != 1:
    raise SystemExit(f"Expected one Capacitor MainActivity.java, found {len(candidates)}")
path = candidates[0]
src = path.read_text(encoding="utf-8")
if "EdgeToEdge.enable(this)" in src:
    print("Already configured:", path)
    raise SystemExit(0)
if "extends BridgeActivity" not in src or "import com.getcapacitor.BridgeActivity;" not in src:
    raise SystemExit("Unrecognized Capacitor MainActivity: refusing to alter")
if "onCreate(" in src:
    raise SystemExit("MainActivity already has onCreate: review manually before patching")
if not re.search(r"\bpackage\s+com\.joaogdbg\.alchemy35k\s*;", src):
    raise SystemExit("Unexpected Android application package")
src = src.replace(
    "import com.getcapacitor.BridgeActivity;",
    "import com.getcapacitor.BridgeActivity;\n"
    "import android.os.Build;\n"
    "import android.os.Bundle;\n"
    "import androidx.activity.EdgeToEdge;",
    1,
)
pattern = r"(public\s+class\s+MainActivity\s+extends\s+BridgeActivity\s*\{)"
replacement = (
    r"\1\n"
    "    @Override\n"
    "    public void onCreate(Bundle savedInstanceState) {\n"
    "        super.onCreate(savedInstanceState);\n"
    "        // API 36 enforces edge-to-edge. SystemBars passes accurate window\n"
    "        // insets to CSS; no fake fullscreen or fixed pixel offsets.\n"
    "        // Old Android versions keep the original non-overlaid layout.\n"
    "        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {\n"
    "            EdgeToEdge.enable(this);\n"
    "        }\n"
    "    }\n"
)
src, count = re.subn(pattern, lambda m: m.group(0) + replacement.split(r"\1", 1)[1], src, count=1)
if count != 1:
    raise SystemExit("Failed to insert Android window-insets support")
path.write_text(src, encoding="utf-8")
print("Configured MainActivity edge-to-edge support:", path)
