#!/usr/bin/env python3
"""
apply-latest.py — copies the most recently modified version of each
Claude-generated file from Downloads into the correct src location.

Run from repo root:  python3 apply-latest.py
"""

import os, shutil, sys
from pathlib import Path

DOWNLOADS = Path.home() / "Downloads"

# filename → destination in repo
FILES = {
    "Hero.tsx":           "src/components/Hero.tsx",
    "TruthStatement.tsx": "src/components/TruthStatement.tsx",
    "DiagnosticCTA.tsx":  "src/components/DiagnosticCTA.tsx",
    "AboutKetan.tsx":     "src/components/AboutKetan.tsx",
    "Transformation.tsx": "src/components/Transformation.tsx",
    "CohortDetails.tsx":  "src/components/CohortDetails.tsx",
    "InterestForm.tsx":   "src/components/InterestForm.tsx",
    "FAQ.tsx":            "src/components/FAQ.tsx",
    "Home.tsx":           "src/pages/Home.tsx",
    "Evaluation.tsx":     "src/pages/Evaluation.tsx",
    "Diagnostic.tsx":     "src/pages/Diagnostic.tsx",
    "CaseStudy.tsx":      "src/pages/CaseStudy.tsx",
}

copied, skipped = 0, 0

print(f"→ Scanning {DOWNLOADS}\n")

for filename, dest in FILES.items():
    stem = Path(filename).stem   # e.g. "Hero"
    ext  = Path(filename).suffix # e.g. ".tsx"

    # Find all variants: Hero.tsx, Hero (1).tsx, Hero 2.tsx, etc.
    candidates = [
        p for p in DOWNLOADS.iterdir()
        if p.suffix == ext and (
            p.stem == stem or
            p.stem.startswith(stem + " ") or
            p.stem.startswith(stem + "(")
        )
    ]

    if not candidates:
        print(f"  ⊘  SKIP   {filename} — not found in Downloads")
        skipped += 1
        continue

    # Pick the most recently modified
    latest = max(candidates, key=lambda p: p.stat().st_mtime)
    import datetime
    mtime = datetime.datetime.fromtimestamp(latest.stat().st_mtime).strftime("%H:%M:%S")

    shutil.copy2(latest, dest)
    print(f"  ✓  COPIED {filename} → {dest}")
    print(f"            (source: {latest.name}, saved at {mtime})")
    copied += 1

print(f"\n{'─'*50}")
print(f"  Copied: {copied}   Skipped: {skipped}")
print(f"{'─'*50}\n")

if copied > 0:
    print("→ Running build...\n")
    os.system("npm run build")
