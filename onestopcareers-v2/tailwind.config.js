module.exports = {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:'#FAFAF7',surface:'#F3F2ED',surface2:'#EBEBE4',
        ink:'#1A1A0F',ink2:'#52524A',ink3:'#9B9B8F',
        border:'#E0DFD8',border2:'#CCCCC3',
        accent:'#C84B0C','accent-dark':'#A03A08','accent-light':'#FDF2EC','accent-border':'#F2C4A5',
        phase1:'#C84B0C','phase1-bg':'#FDF2EC','phase1-border':'#F2C4A5',
        phase2:'#1E4FCC','phase2-bg':'#EDF1FD','phase2-border':'#A8B8F0',
        phase3:'#1A6B45','phase3-bg':'#EDF6F1','phase3-border':'#A8D9BC',
        green:'#1A6B45','green-bg':'#EDF6F1','green-border':'#A8D9BC',
        red:'#B03030','red-bg':'#FDF2F2','red-border':'#E8AAAA',
        amber:'#9B5200','amber-bg':'#FEF7EE','amber-border':'#F0C98A',
        'sql-bg':'#0C0E13','sql-surface':'#13161D','sql-border':'#1E2330',
        'sql-text':'#C8D0E8','sql-kw':'#79B4F8','sql-str':'#A6E3A1','sql-num':'#F9E2AF',
      },
      fontFamily: {
        sans:['"DM Sans"','system-ui','sans-serif'],
        serif:['"Instrument Serif"','Georgia','serif'],
        mono:['"JetBrains Mono"','monospace'],
      },
      boxShadow: {
        accent: '0 4px 16px rgba(200,75,12,0.28)',
        card:   '0 2px 8px rgba(26,26,15,0.06), 0 0 0 1px rgba(26,26,15,0.04)',
      },
    },
  },
  plugins: [],
};
