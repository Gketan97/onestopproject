#!/bin/bash
echo "⚠️ Rolling back last commit..."

git reset --hard HEAD~1

echo "Rollback complete."
