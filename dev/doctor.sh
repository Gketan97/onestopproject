#!/bin/bash
echo "🩺 Running project doctor..."

rm -rf node_modules
rm -rf dist
rm -rf .vite

npm install

echo "✅ Environment reset complete."
