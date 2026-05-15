#!/bin/bash
# Run from repo root: bash patch-ketan-photo.sh
# Copies ketan.jpeg to public/ and updates AboutKetan.tsx to show it

# Copy image
cp ~/Downloads/ketan.jpeg public/ketan.jpeg
echo "✓ Image copied to public/ketan.jpeg"

# Patch AboutKetan to use real photo
python3 << 'PYEOF'
path = 'src/components/AboutKetan.tsx'
with open(path, 'r') as f:
    src = f.read()

# Replace the avatar div with real image
old_avatar = """        .about-avatar {
          width: 100%; aspect-ratio: 1;
          max-width: 220px;
          border-radius: 20px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .about-avatar-initials {
          font-family: 'Instrument Serif', serif;
          font-size: 64px; color: var(--text-secondary);
        }
        .about-avatar::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,107,157,0.08), rgba(168,85,247,0.08));
        }"""

new_avatar = """        .about-avatar {
          width: 100%; aspect-ratio: 1;
          max-width: 220px;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 0 1px var(--border-default), 0 0 0 4px rgba(168,85,247,0.15);
        }
        .about-avatar img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }"""

src = src.replace(old_avatar, new_avatar)

# Replace the JSX avatar content
src = src.replace(
    """            <div className="about-avatar">
              <span className="about-avatar-initials">KG</span>
            </div>""",
    """            <div className="about-avatar">
              <img src="/ketan.jpeg" alt="Ketan Goel" />
            </div>"""
)

with open(path, 'w') as f:
    f.write(src)
print('✓ AboutKetan.tsx updated with real photo')
PYEOF

npm run build && echo "" && echo "✅ Done — Ketan's photo is live"
