import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SaaS-Noir core palette
        noir: {
          bg:       '#080810',
          surface:  '#0F0F1A',
          elevated: '#14141F',
          border:   '#1E1E2E',
          hover:    '#252535',
        },
        ink: {
          1: '#FFFFFF',
          2: '#C8C8D8',
          3: '#7070A0',
          4: '#404060',
        },
        brand: {
          orange:       '#FC8019',
          'orange-dim': '#C46010',
          blue:         '#4F80FF',
          'blue-dim':   '#2B4FCC',
          green:        '#3DD68C',
          'green-dim':  '#1FAF66',
          red:          '#FF4F4F',
          'red-dim':    '#CC2B2B',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm':  '6px',
        'md':  '10px',
        'lg':  '14px',
        'xl':  '20px',
      },
      boxShadow: {
        'card':    '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
        'glow-orange': '0 0 20px rgba(252,128,25,0.15)',
        'glow-blue':   '0 0 20px rgba(79,128,255,0.15)',
        'glow-green':  '0 0 20px rgba(61,214,140,0.15)',
      },
      backgroundImage: {
        'grid-noir': `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'orb-float':  'orbFloat 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%':      { transform: 'translateY(-20px) scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
