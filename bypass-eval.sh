#!/bin/bash
# Patches Evaluation.tsx to bypass API and show mock result
# Run from repo root: bash bypass-eval.sh

python3 << 'PYEOF'
path = 'src/pages/Evaluation.tsx'
with open(path, 'r') as f:
    src = f.read()

# Replace the useEffect that calls the API with one that goes straight to mock result
old = """  useEffect(() => {
    const answer = sessionStorage.getItem('signal_answer')
    if (!answer) {
      setResult(FALLBACK)
      setPhase('reveal')
      return
    }

    runEvaluation(answer)
      .then(r => {
        setResult(r)
        setPhase('reveal')
      })
      .catch(err => {
        setErrorMsg(err.message)
        setPhase('error')
      })
  }, [])"""

new = """  useEffect(() => {
    // BYPASS MODE — skip API, use mock result for UI testing
    const mock = {
      verdict: 'Good breadth. No prioritisation.',
      overall: 2,
      passed: false,
      summary: "The response shows genuine curiosity about the user's experience and covers a wide range of possible reasons. The core gap is that all possibilities are given equal weight — there's no attempt to prioritise which is most likely or what data would confirm it. A stronger response commits to a hypothesis.",
      dimensions: [
        { name: 'Problem Structuring', score: 2, observation: 'Listed causes without first breaking the problem into a logical structure.' },
        { name: 'Hypothesis Quality', score: 2, observation: 'Covered many possibilities but did not commit to a most-likely cause with reasoning.' },
        { name: 'Depth of Thinking', score: 3, observation: 'Went beyond the surface on user intent — the observation about 5-minute browse signalling intent was sharp.' },
        { name: 'Prioritisation', score: 1, observation: 'All reasons were given equal weight. No filtering or ranking.' },
        { name: 'Business Lens', score: 2, observation: 'Stayed mostly on the user side. Did not connect to what the business would do differently.' },
      ],
      what_strong_looks_like: "A strong response opens by noting that 5 minutes of browsing signals clear intent — so the question isn't why they didn't want to order, it's what stopped them once they did. From there, it narrows to 2-3 high-probability causes (delivery time, price shock at checkout, restaurant unavailability) and picks the most likely one based on reasoning. It ends with what data would confirm it.",
      one_thing: 'Stop listing everything that could have happened — practice picking the one most likely thing and defending it.',
      ketan_note: "You noticed the intent signal — that's actually a strong start. Most people miss it. Now the next step is learning to use that observation to narrow down, not open up.",
    }
    setTimeout(() => {
      setResult(mock)
      setPhase('reveal')
    }, 1500) // simulate loading
  }, [])"""

if old in src:
    src = src.replace(old, new)
    with open(path, 'w') as f:
        f.write(src)
    print('✓ Evaluation.tsx patched — API bypassed')
else:
    print('⚠ Pattern not found — Evaluation.tsx may already be updated or structure changed')
    print('  Manually set: setResult(mockData); setPhase("reveal") in useEffect')
PYEOF

npm run build && echo "" && echo "✅ Done — evaluation now shows mock result instantly"
