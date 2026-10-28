#!/usr/bin/env python3
"""Legacy entrypoint: V39 supersedes the snapshot-only V38 audit."""
from pathlib import Path
import subprocess
root=Path(__file__).resolve().parents[1]
print('V39 catalog integrity validator (supersedes V38 duplicate-name inventory)')
subprocess.run(['node','tools/validate-catalog.mjs'],cwd=root,check=True)
