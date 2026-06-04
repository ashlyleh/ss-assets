#!/usr/bin/env python3
"""
rename-engine.py
Builds the complete pf-core.js from the original sqsmods-blog-filter.js.

Usage:
  python3 rename-engine.py sqsmods-blog-filter.js

Output:
  pf-core.js  (ready to upload to GitHub)
  Place this script in the same folder as pf-core-partA.js.
"""
import sys, os, re

if len(sys.argv) < 2:
    print("Usage: python3 rename-engine.py sqsmods-blog-filter.js")
    sys.exit(1)

renames = [
    ("window.SQSMBFConfig",    "window.SQPSBLOGConfig"),
    ('"sqsmods-bf-layout"',    '"sqpsblog-layout"'),
    ("'sqsmods-bf-layout'",    "'sqpsblog-layout'"),
    ('"sqsmods-bf"',           '"sqpsblog"'),
    ("'sqsmods-bf'",           "'sqpsblog'"),
    ("sqsmods-bf-",            "sqpsblog-"),
    ("sqsmods-bf",             "sqpsblog"),
]

# Read original engine
with open(sys.argv[1], "r", encoding="utf-8") as f:
    engine = f.read()

# Apply renames
for old, new in renames:
    engine = engine.replace(old, new)

# Verify
remaining = re.findall(r'sqsmods|SQSMBF', engine)
if remaining:
    print(f"WARNING: unrenamed strings found: {set(remaining)}", file=sys.stderr)
else:
    print("Engine rename: clean", file=sys.stderr)

# Read Part A (override injection logic) from same directory
script_dir = os.path.dirname(os.path.abspath(__file__))
part_a_path = os.path.join(script_dir, "pf-core-partA.js")

if os.path.exists(part_a_path):
    with open(part_a_path, "r") as f:
        part_a = f.read()
    part_a = re.sub(r'\n// .* PART B.*', '', part_a, flags=re.DOTALL).rstrip()
    output = part_a + "\n\n// ── PART B: Blog filter engine ──────────────────────────────────────────\n" + engine
    print("Part A prepended.", file=sys.stderr)
else:
    print("pf-core-partA.js not found — writing engine only.", file=sys.stderr)
    output = engine

out_path = os.path.join(script_dir, "pf-core.js")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(output)

print(f"Done. pf-core.js written ({len(output):,} bytes)", file=sys.stderr)
