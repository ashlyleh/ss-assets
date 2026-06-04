#!/usr/bin/env python3
"""
rename-engine.py
Usage: python3 rename-engine.py sqsmods-blog-filter.js > pf-core-engine.js

Applies all sqsmods-bf -> sqpsblog renames to the original minified engine.
Run this once to produce the renamed engine, then concatenate with pf-core-partA.js.
"""
import sys

renames = [
    ("window.SQSMBFConfig",   "window.SQPSBLOGConfig"),
    ('"sqsmods-bf-layout"',   '"sqpsblog-layout"'),
    ("'sqsmods-bf-layout'",   "'sqpsblog-layout'"),
    ('"sqsmods-bf"',          '"sqpsblog"'),
    ("'sqsmods-bf'",          "'sqpsblog'"),
    ("sqsmods-bf-",           "sqpsblog-"),
    ("sqsmods-bf",            "sqpsblog"),
]

with open(sys.argv[1], "r", encoding="utf-8") as f:
    content = f.read()

for old, new in renames:
    content = content.replace(old, new)

sys.stdout.write(content)
