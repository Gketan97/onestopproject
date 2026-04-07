/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:      '#080810',
        surface: '#0F0F1A',
        border:  '#1E1E30',
        ink:     '#E8E8F0',
        ink2:    '#A0A0C0',
        ink3:    '#606080',
        accent:  '#FC8060',
        blue:    '#4F80FF',
        green:   '#3DD68C',
      },
    },
  },
  plugins: [],
}
