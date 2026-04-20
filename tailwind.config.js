/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './providers/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#0A0A0A',
        muted: '#F5F5F5',
        'muted-foreground': '#737373',
        border: '#E5E5E5',
        error: {
          DEFAULT: '#FF4747',
        },
        accent: '#1A1A1A',
      },
      fontFamily: {
        helvetica: ['Helvetica'],
        'hell-round-bold': ['HelveticaRoundedBold'],
      },
    },
  },
  plugins: [],
};
