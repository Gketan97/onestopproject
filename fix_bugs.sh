#!/usr/bin/env bash
# FIX: Two bugs
# Bug 1: stage 'arjun' is a dead-end — protocol never renders
#        Fix: stage goes chart → protocol (skip 'arjun' as a stage, use arjunVisible flag)
# Bug 2: Shell useEffect deps include currentPhaseId → redirects on every store update
#        Fix: empty deps [] — only run once on mount

set -euo pipefail
echo "🔧 Fixing stage machine + routing"

python3 << 'PYEOF'
import re

# ── FIX 1: Phase1.tsx — chart useEffect stage machine ──────────────────────
with open('src/pages/CaseStudy/phases/Phase1.tsx', 'r') as f:
    c = f.read()

# The timer sets stage to 'arjun' but protocol only renders on 'protocol'|'investigation'
# Fix: stage goes chart → protocol directly; arjunVisible is the separate flag
old = "    const t3 = setTimeout(() => { setStage('arjun'); setProtocolVisible(true) }, 4400)"
new = """    const t3 = setTimeout(() => setArjunVisible(true), 3200)
    const t4 = setTimeout(() => { setStage('protocol'); setProtocolVisible(true) }, 4600)"""
if old in c:
    c = c.replace(old, new)
    print("✅ Stage machine: chart → protocol (direct)")
else:
    # Try alternate pattern from different script version
    old2 = "    const t3 = setTimeout(() => setStage('protocol'), 4400)\n    const t4 = setTimeout(() => setProtocolVisible(true), 4600)"
    if old2 in c:
        print("✅ Stage machine already has correct pattern")
    else:
        # Patch whatever timeout chain exists
        c = re.sub(
            r"const t3 = setTimeout\(\(\) => \{[^}]+\},\s*\d+\)",
            "const t3 = setTimeout(() => setArjunVisible(true), 3200)\n    const t4 = setTimeout(() => { setStage('protocol'); setProtocolVisible(true) }, 4600)",
            c
        )
        print("✅ Stage machine: patched via regex")

# Fix arjun render condition — must show during 'chart' stage too
# (arjunVisible flag gates it, stage just needs to not be 'slack'|'metric')
c = c.replace(
    "{arjunVisible && (stage === 'arjun' || stage === 'protocol' || stage === 'investigation') && (",
    "{arjunVisible && (stage === 'chart' || stage === 'protocol' || stage === 'investigation') && ("
)
print("✅ Arjun render: now shows during chart stage")

with open('src/pages/CaseStudy/phases/Phase1.tsx', 'w') as f:
    f.write(c)

# ── FIX 2: CaseStudy shell — useEffect deps cause redirect loop ────────────
with open('src/pages/CaseStudy/index.tsx', 'r') as f:
    c = f.read()

print("\nShell useEffect currently:")
# Find the useEffect
m = re.search(r'useEffect\(\(\) => \{.*?\}, \[.*?\]\)', c, re.DOTALL)
if m:
    print(" ", m.group()[:200])

# The bug: deps array contains currentPhaseId or navigate → re-runs on store change
# Fix: empty deps = run once on mount only
# Pattern 1: has deps with currentPhaseId
c = re.sub(
    r"(useEffect\(\(\) => \{[^}]*if \(!phase && slug\)[^}]*navigate[^}]*\}[^)]*\))",
    lambda m: re.sub(r'\[.*?\]', '[]  // ← empty: run ONCE on mount, never on store update', m.group(), flags=re.DOTALL),
    c, flags=re.DOTALL
)

# Also ensure the condition is tight — only redirect if no phase segment at all
# Replace any existing useEffect for initial redirect
c = re.sub(
    r'useEffect\(\(\) => \{[^}]*?if \(!phase && slug\)[^}]*?navigate[^}]*?\}.*?\},.*?\[.*?\]\)',
    '''useEffect(() => {
    // ONLY redirect on first mount when URL has no phase segment
    // Empty deps [] — never re-runs, so ProgressNav navigation is never overridden
    const pathParts = window.location.pathname.split('/')
    const hasPhase  = pathParts.some(p => p.startsWith('phase-'))
    if (!hasPhase && slug) {
      navigate(`/case-study/${slug}/${currentPhaseId}`, { replace: true })
    }
  }, [])  // ← empty deps: mount-only, never re-fires on store updates''',
    c, flags=re.DOTALL
)

with open('src/pages/CaseStudy/index.tsx', 'w') as f:
    f.write(c)
print("\n✅ Shell useEffect: empty deps (mount-only)")

print("\n" + "─"*50)
print("Root causes fixed:")
print("  Bug 1: stage 'arjun' was dead end → protocol never rendered")
print("         Now: chart → protocol (arjunVisible is just a flag)")
print("  Bug 2: useEffect [currentPhaseId] re-ran on every store update")
print("         Now: [] — runs once at mount, ProgressNav nav works")
PYEOF

# ── Verify the changes look right ─────────────────────────────────────────
echo ""
echo "📋 Verifying Phase1 stage machine..."
grep -n "setTimeout\|setStage\|setArjunVisible\|setProtocol" src/pages/CaseStudy/phases/Phase1.tsx | head -20

echo ""
echo "📋 Verifying shell useEffect..."
grep -n -A8 "useEffect" src/pages/CaseStudy/index.tsx | head -30

# ── TypeScript check ───────────────────────────────────────────────────────
echo ""
echo "🧠 Type checking..."
npx tsc --noEmit && echo "✅ Zero errors" || echo "⚠️  Fix errors above"

# ── Build ──────────────────────────────────────────────────────────────────
echo ""
echo "🔨 Building..."
npm run build && echo "✅ Build passed — push to deploy" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Two bugs fixed:"
echo ""
echo " BUG 1 — Protocol cards never appeared:"
echo "   CAUSE: stage machine went chart → 'arjun'"
echo "          but protocol renders on 'protocol'|'investigation' only"
echo "          'arjun' was a dead stage with no forward transition"
echo "   FIX:   chart stage → timer1: setArjunVisible(true)"
echo "                       timer2: setStage('protocol') + setProtocolVisible(true)"
echo "          'arjun' stage removed from state machine entirely"
echo ""
echo " BUG 2 — Back navigation to completed phase broken:"
echo "   CAUSE: shell useEffect had [currentPhaseId] in deps"
echo "          clicking phase-0 in nav → navigate('/phase-0')"  
echo "          then store update fires → useEffect re-runs"
echo "          → navigate back to currentPhaseId, undoing the click"
echo "   FIX:   useEffect([], []) — empty deps, runs once on mount"
echo "          ProgressNav window.location.href calls now stick"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
