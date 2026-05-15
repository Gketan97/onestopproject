#!/bin/bash
# Run from repo root: bash trim-hero-sub.sh

python3 << 'PYEOF'
path = 'src/components/Hero.tsx'
with open(path, 'r') as f:
    src = f.read()

# Find and tighten the hero sub — remove the second sentence about freshers/teams
# whatever variant is currently there
import re

# Replace any hero-sub paragraph content with the tight version
src = re.sub(
    r'(<p data-reveal className="hero-sub">)[\s\S]*?(</p>)',
    r'''\1
            Companies are now hiring for one thing above everything else —
            <strong>can you make good decisions using AI?</strong>
            Not just use the tools. Actually think.
            This free test shows you where you stand.
          \2''',
    src,
    count=1
)

with open(path, 'w') as f:
    f.write(src)
print('✓ Hero sub tightened')
PYEOF

npm run build
