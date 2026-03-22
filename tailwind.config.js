module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent:   '#C84B0C',
        'accent-dark': '#A03A08',
        'accent-light': '#FDF2EC',
        'accent-border': '#F2C4A5',
        ink:      '#1A1A0F',
        ink2:     '#52524A',
        ink3:     '#9B9B8F',
        surface:  '#F3F2ED',
        surface2: '#EBEBE4',
        border:   '#E0DFD8',
        border2:  '#CCCCC3',
        bg:       '#FAFAF7',
        'phase1': '#C84B0C',
        'phase2': '#1E4FCC',
        'phase3': '#1A6B45',
      },
      fontFamily: {
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
