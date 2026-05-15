#!/bin/bash
# Run from repo root: bash content-finetune.sh
# Patches Hero, TruthStatement, DiagnosticCTA copy directly in your repo

python3 << 'PYEOF'

# ── Hero ──────────────────────────────────────────────────────
path = 'src/components/Hero.tsx'
with open(path, 'r') as f:
    src = f.read()

# Headline
src = src.replace(
    """            AI can generate answers, write code, and automate execution.{' '}
            <span className=\"hero-gradient-text\">But can you make the decision?</span>""",
    """            AI won't take your job.<br />
            <span className=\"hero-gradient-text\">Someone who uses AI to think better than you will.</span>"""
)

# Sub
src = src.replace(
    """            The future belongs to people who can use AI to navigate ambiguity,
            solve problems, and make better decisions.{' '}
            <strong>Test where you actually stand.</strong>""",
    """            Freshers can't find jobs. Teams are shrinking. The people who are thriving
            aren't the ones who know the most tools —
            <strong>they're the ones who can think clearly and make calls under pressure.</strong>
            This free test shows you exactly where your thinking stands."""
)

with open(path, 'w') as f:
    f.write(src)
print('✓ Hero copy updated')

# ── TruthStatement ────────────────────────────────────────────
path2 = 'src/components/TruthStatement.tsx'
with open(path2, 'r') as f:
    src2 = f.read()

# Section label + headline
src2 = src2.replace(
    """            <p data-reveal className=\"truth-label\">THE SHIFT</p>
            <h2 data-reveal className=\"truth-h2\">
              AI amplifies how you think.<br />
              <em>Not what you think.</em>
            </h2>
            <p data-reveal className=\"truth-para\">
              Every professional now has access to the same AI tools.
              ChatGPT. Gemini. Claude. <strong>The playing field is flat.</strong>
            </p>
            <p data-reveal className=\"truth-para\">
              What's NOT flat: the quality of thinking you bring to them.
              A shallow question gets a shallow answer — even from the world's best AI.
              A structured thinker gets a strategic output.
            </p>
            <p data-reveal className=\"truth-para\">
              <strong>The gap between professionals is widening. Fast.</strong>
            </p>""",
    """            <p data-reveal className=\"truth-label\">WHAT'S ACTUALLY CHANGING</p>
            <h2 data-reveal className=\"truth-h2\">
              The tools are the same for everyone.<br />
              <em>The thinking is not.</em>
            </h2>
            <p data-reveal className=\"truth-para\">
              Everyone has ChatGPT. Everyone has Claude. The playing field for tools
              is completely flat. <strong>What's not flat is what you do with them.</strong>
            </p>
            <p data-reveal className=\"truth-para\">
              AI gives you leverage. But leverage amplifies whatever thinking you already have.
              Shallow thinking with AI gives you more shallow output, faster.
              Structured thinking with AI gives you an unfair advantage.
            </p>
            <p data-reveal className=\"truth-para\">
              <strong>The gap between people who get this and people who don't
              is growing every single month.</strong>
            </p>"""
)

# Before/after cards
src2 = src2.replace(
    """            <div className=\"truth-card bad\">
              <div className=\"truth-card-label bad\">✕ SHALLOW THINKING</div>
              <div className=\"truth-card-title\">\"The app was slow. Maybe prices were high.\"</div>
              <div className=\"truth-card-body\">
                3 surface-level guesses. No structure. No prioritization.
                No connection to business impact. This is most people's answer.
              </div>
            </div>
            <div className=\"truth-card good\">
              <div className=\"truth-card-label good\">✓ STRUCTURED THINKING</div>
              <div className=\"truth-card-title\">\"Intent → Friction → Supply → Trust\"</div>
              <div className=\"truth-card-body\">
                One prioritized hypothesis with a clear framework.
                \"The user had intent but hit friction in the discovery phase —
                most likely menu complexity or delivery time anxiety.\"
              </div>
            </div>
            <p className=\"truth-tagline\">
              The difference is learnable. That's what the lab teaches.
            </p>""",
    """            <div className=\"truth-card bad\">
              <div className=\"truth-card-label bad\">✕ HOW MOST PEOPLE RESPOND</div>
              <div className=\"truth-card-title\">"It could be pricing, or the app was slow, or maybe they just weren't hungry."</div>
              <div className=\"truth-card-body\">
                Five possible reasons with equal weight and no view on which matters.
                Safe. Forgettable. Gives the person asking nothing to act on.
                This is the default response — even from smart people.
              </div>
            </div>
            <div className=\"truth-card good\">
              <div className=\"truth-card-label good\">✓ HOW SHARP THINKERS RESPOND</div>
              <div className=\"truth-card-title\">"They had intent — 5 minutes of browsing proves that. So the question is what stopped them. My best hypothesis: delivery time or price shock at checkout."</div>
              <div className=\"truth-card-body\">
                One clear hypothesis with a reason. Uses what we already know
                to rule things out. Ends with something testable.
                This is what gets you trusted with bigger problems.
              </div>
            </div>
            <p className=\"truth-tagline\">
              This is a learnable skill. The lab exists to build it.
            </p>"""
)

with open(path2, 'w') as f:
    f.write(src2)
print('✓ TruthStatement copy updated')

# ── DiagnosticCTA ─────────────────────────────────────────────
path3 = 'src/components/DiagnosticCTA.tsx'
with open(path3, 'r') as f:
    src3 = f.read()

src3 = src3.replace(
    """            <p data-reveal className=\"dcta-label\">THE DIAGNOSTIC</p>
            <h2 data-reveal className=\"dcta-h2\">
              One question.<br />Real evaluation.
            </h2>
            <p data-reveal className=\"dcta-body\">
              Answer a single business problem — the same type asked in
              interviews at Swiggy, Zepto, Blinkit, and Meesho.
              Our AI evaluates exactly how you think.
            </p>
            <div data-reveal>
              <button className=\"dcta-btn\" onClick={() => navigate('/diagnostic')}>
                Start the Diagnostic →
              </button>
            </div>""",
    """            <p data-reveal className=\"dcta-label\">FREE 4-MINUTE TEST</p>
            <h2 data-reveal className=\"dcta-h2\">
              Most people think they think well.<br />Most are wrong.
            </h2>
            <p data-reveal className=\"dcta-body\">
              One real business situation. No right answer. No tricks.
              Just you thinking through a problem the way you actually would at work.
              Our AI then tells you <strong>exactly where your reasoning is sharp —
              and where it breaks down.</strong> The same things a senior leader
              notices in 30 seconds.
            </p>
            <div data-reveal>
              <button className=\"dcta-btn\" onClick={() => navigate('/diagnostic')}>
                Find Out Where You Stand →
              </button>
            </div>"""
)

with open(path3, 'w') as f:
    f.write(src3)
print('✓ DiagnosticCTA copy updated')

PYEOF

npm run build && echo "" && echo "✅ All copy updated. Check npm run dev to review."
