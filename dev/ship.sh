#!/bin/bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

echo "🚢 Shipping build..."

git add -A

if git diff-index --quiet HEAD --; then
  echo "No changes to ship."
  exit 0
fi

git commit -m "ship: update ($TIMESTAMP)"
git push origin $BRANCH

echo "✅ Deploy pushed. Netlify should deploy automatically."
