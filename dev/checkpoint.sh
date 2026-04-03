#!/bin/bash
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

git add -A
git commit -m "checkpoint: progress ($TIMESTAMP)"

echo "📍 Progress checkpoint saved."
