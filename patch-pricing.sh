#!/bin/bash
# Run from repo root: bash patch-pricing.sh

python3 << 'PYEOF'
import os

files = [
    'src/components/CohortDetails.tsx',
    'src/pages/Evaluation.tsx',
    'src/components/InterestForm.tsx',
]

for path in files:
    if not os.path.exists(path):
        continue
    with open(path, 'r') as f:
        src = f.read()

    original = src

    # Price updates
    src = src.replace('₹2,500', '₹2,999')
    src = src.replace('₹2500', '₹2999')
    src = src.replace('per session', 'per person · full cohort')
    src = src.replace('PER SESSION', 'PER PERSON')

    # Add crossed-out price near ₹2,999 in CohortDetails card
    if 'cohort-card-price' in src and '₹4,999' not in src:
        src = src.replace(
            '<div className="cohort-card-price">₹2,999</div>',
            '<div style={{display:"flex",alignItems:"baseline",gap:10}}>'
            '<div className="cohort-card-price" style={{textDecoration:"line-through",opacity:0.4,fontSize:"clamp(28px,3vw,36px)"}}>₹4,999</div>'
            '<div className="cohort-card-price">₹2,999</div>'
            '</div>'
        )

    # Session mode note
    src = src.replace(
        'No auto-renewal · Pay per session',
        'Group session · Max 5 · Runs with even 1 person'
    )

    if src != original:
        with open(path, 'w') as f:
            f.write(src)
        print(f'✓ {path}')
    else:
        print(f'  no changes: {path}')
PYEOF

npm run build
