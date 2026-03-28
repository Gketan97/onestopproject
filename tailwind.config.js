module.exports = {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Noir surface palette ── */
        bg:       '#080810',
        surface:  '#0F1018',
        surface2: '#14161F',
        ink:      '#E8EAF2',
        ink2:     '#9AA0B8',
        ink3:     '#4A5070',
        border:   'rgba(255,255,255,0.08)',
        border2:  'rgba(255,255,255,0.13)',

        /* ── Brand ── */
        accent:        '#FC8019',
        'accent-dark': '#E06800',
        'accent-light':'rgba(252,128,25,0.12)',
        'accent-border':'rgba(252,128,25,0.30)',

        /* ── Phase colours ── */
        phase1:          '#FC8019',
        'phase1-bg':     'rgba(252,128,25,0.10)',
        'phase1-border': 'rgba(252,128,25,0.25)',
        phase2:          '#4F80FF',
        'phase2-bg':     'rgba(79,128,255,0.10)',
        'phase2-border': 'rgba(79,128,255,0.25)',
        phase3:          '#3DD68C',
        'phase3-bg':     'rgba(61,214,140,0.10)',
        'phase3-border': 'rgba(61,214,140,0.25)',

        /* ── Semantic ── */
        green:          '#3DD68C',
        'green-bg':     'rgba(61,214,140,0.10)',
        'green-border': 'rgba(61,214,140,0.25)',
        red:            '#F38BA8',
        'red-bg':       'rgba(243,139,168,0.10)',
        'red-border':   'rgba(243,139,168,0.25)',
        amber:          '#F9E2AF',
        'amber-bg':     'rgba(249,226,175,0.10)',
        'amber-border': 'rgba(249,226,175,0.25)',
        blue:           '#4F80FF',
        'blue-bg':      'rgba(79,128,255,0.10)',
        'blue-border':  'rgba(79,128,255,0.25)',

        /* ── SQL workbench ── */
        'sql-bg':      '#080810',
        'sql-surface': '#0F1018',
        'sql-border':  'rgba(255,255,255,0.08)',
        'sql-text':    '#C8D0E8',
        'sql-kw':      '#79B4F8',
        'sql-str':     '#A6E3A1',
        'sql-num':     '#F9E2AF',
        'sql-comment': '#4A5070',
      },
      fontFamily: {
        sans:  ['"Inter"',  'system-ui', 'sans-serif'],
        serif: ['"Inter"',  'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        accent: '0 4px 20px rgba(252,128,25,0.30)',
        card:   '0 2px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
        glow:   '0 0 20px rgba(79,128,255,0.25)',
      },
    },
  },
  plugins: [],
};
