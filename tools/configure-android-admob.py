#!/usr/bin/env python3
"""Add Alchemy 10K native plugins to the generated Capacitor Android project:
Google Mobile Ads (rewarded, TEST IDs) and the backup share-sheet plugin.

Run after `npx cap add android && npx cap sync android` and AFTER
tools/configure-android-edge-to-edge.py (it adds MainActivity.onCreate).

- copies every native/android/*Plugin.java into the app package (ads + backup)
- checks that Capacitor's FileProvider shares the cache directory (backup export)
- adds play-services-ads + UMP dependencies to android/app/build.gradle
- writes the AdMob APPLICATION_ID meta-data into AndroidManifest.xml
- registers the plugin in MainActivity before super.onCreate()

The IDs below are Google's public TEST IDs. Replace them with your own AdMob app ID
and ad unit ID (see GameverseRewardedAdsPlugin.AD_UNIT_ID) only for a real release.
"""
from pathlib import Path
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = "com.joaogdbg.alchemy35k"
TEST_APP_ID = "ca-app-pub-3940256099942544~3347511713"  # Google sample AdMob app ID
ADS_DEP = 'implementation "com.google.android.gms:play-services-ads:25.5.0"'
UMP_DEP = 'implementation "com.google.android.ump:user-messaging-platform:3.2.0"'


def fail(msg):
    raise SystemExit("configure-android-admob: " + msg)


def main():
    app = ROOT / "android/app"
    if not app.is_dir():
        fail("android/app missing; run npx cap add android first")

    # 1) Plugin source into the application package.
    pkg_dir = app / "src/main/java" / Path(*PACKAGE.split("."))
    if not pkg_dir.is_dir():
        fail(f"unexpected package directory {pkg_dir}")
    plugins = sorted((ROOT / "native/android").glob("*Plugin.java"))
    names = [p.stem for p in plugins]
    if "GameverseRewardedAdsPlugin" not in names or "AlchemyBackupPlugin" not in names:
        fail(f"missing native plugin sources: {names}")
    for src in plugins:
        shutil.copyfile(src, pkg_dir / src.name)

    # 2) Gradle dependencies.
    gradle = app / "build.gradle"
    g = gradle.read_text(encoding="utf-8")
    if "play-services-ads" not in g:
        g, n = re.subn(r"(?m)^dependencies\s*\{", "dependencies {\n    " + ADS_DEP + "\n    " + UMP_DEP, g, count=1)
        if n != 1:
            fail("no top-level dependencies block in app/build.gradle")
        gradle.write_text(g, encoding="utf-8")

    # 3) Manifest meta-data (AdMob refuses to start without it).
    manifest = app / "src/main/AndroidManifest.xml"
    m = manifest.read_text(encoding="utf-8")
    if "com.google.android.gms.ads.APPLICATION_ID" not in m:
        meta = ('\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID"'
                f' android:value="{TEST_APP_ID}"/>')
        m, n = re.subn(r"(<application\b[^>]*>)", lambda mm: mm.group(1) + meta, m, count=1)
        if n != 1:
            fail("no <application> tag in AndroidManifest.xml")
        manifest.write_text(m, encoding="utf-8")

    # 3b) Backup export shares a cache file through Capacitor's FileProvider.
    if "androidx.core.content.FileProvider" not in m or ".fileprovider" not in m:
        fail("Capacitor FileProvider missing from AndroidManifest.xml")
    paths = app / "src/main/res/xml/file_paths.xml"
    if not paths.is_file():
        fail("res/xml/file_paths.xml missing")
    x = paths.read_text(encoding="utf-8")
    if "<cache-path" not in x:
        x, n = re.subn(r"</paths>", '    <cache-path name="alchemy_cache" path="." />\n</paths>', x, count=1)
        if n != 1:
            fail("unexpected file_paths.xml")
        paths.write_text(x, encoding="utf-8")

    # 4) Register the local plugins before the bridge starts.
    acts = list((app / "src/main/java").rglob("MainActivity.java"))
    if len(acts) != 1:
        fail(f"expected one MainActivity.java, found {len(acts)}")
    a = acts[0].read_text(encoding="utf-8")
    regs = "".join(f"registerPlugin({n}.class);\n        " for n in names if f"registerPlugin({n}.class)" not in a)
    if regs:
        if "super.onCreate(savedInstanceState);" in a:
            a = a.replace("super.onCreate(savedInstanceState);", regs + "super.onCreate(savedInstanceState);", 1)
        else:
            a, n = re.subn(r"(public\s+class\s+MainActivity\s+extends\s+BridgeActivity\s*\{)",
                           lambda mm: mm.group(1) + "\n    @Override\n    public void onCreate(android.os.Bundle savedInstanceState) {\n        "
                           + regs + "super.onCreate(savedInstanceState);\n    }\n", a, count=1)
            if n != 1:
                fail("unknown MainActivity shape")
        acts[0].write_text(a, encoding="utf-8")

    print("Native plugins configured (AdMob TEST ads + backup):", ", ".join(names))


if __name__ == "__main__":
    sys.exit(main())
