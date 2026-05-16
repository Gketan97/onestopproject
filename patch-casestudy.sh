#!/bin/bash
# Run from repo root: bash patch-casestudy.sh

python3 << 'PYEOF'
path = 'src/App.tsx'
with open(path, 'r') as f:
    src = f.read()

if 'CaseStudy' not in src:
    src = src.replace(
        "import Lab from './pages/Lab'",
        "import Lab from './pages/Lab'\nimport CaseStudy from './pages/CaseStudy'"
    )
    src = src.replace(
        "<Route path=\"/lab\" element={<Lab />} />",
        "<Route path=\"/lab\" element={<Lab />} />\n        <Route path=\"/case-study\" element={<CaseStudy />} />"
    )
    with open(path, 'w') as f:
        f.write(src)
    print('✓ /case-study route added to App.tsx')
else:
    print('✓ Already exists')
PYEOF

npm run build && echo "✅ Done — push to deploy"
