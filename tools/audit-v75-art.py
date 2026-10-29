#!/usr/bin/env python3
"""Strict structural SVG inspection: never substitute generic shapes on failure."""
import hashlib
import json
from pathlib import Path
from xml.etree import ElementTree as ET

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "shared/v75-approved.json").read_text(encoding="utf-8"))
assert len(manifest["new_items"]) == 68
seen = set()
ns = "{http://www.w3.org/2000/svg}"
allowed = {"svg", "g", "path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "defs", "linearGradient", "stop"}
for item in manifest["new_items"]:
    p = root / item["path"]
    raw = p.read_text(encoding="utf-8")
    tree = ET.fromstring(raw)
    assert tree.tag == ns + "svg", f"Unexpected SVG root {p}"
    assert tree.get("viewBox") == "0 0 100 100", f"Wrong art coordinates {p}"
    graphics = 0
    for element in tree.iter():
        tag = element.tag.split("}")[-1]
        assert tag in allowed, f"Unexpected SVG tag {tag} in {p}"
        for key, value in element.attrib.items():
            assert not key.startswith("on") and "url(http" not in value.lower(), f"External or event code in {p}"
        graphics += int(tag in {"path", "rect", "circle", "ellipse", "line", "polygon", "polyline"})
    assert graphics >= 5, f"Not enough individually meaningful vector features in {p}"
    sha = hashlib.sha256(raw.encode()).hexdigest()
    assert sha not in seen, f"Identical SVG: {p}"
    seen.add(sha)
print(f"V75 visual-structure PASS: {len(seen)} unique, well-formed individual SVG assets.")
