/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#FFFDF5', // Warm cream
        surface: '#FFFFFF',
        surfaceLight: '#F7F5EC',
        peach: '#FF9E7D',   // Energy
        mint: '#B4E1D1',    // Calm
        yellow: '#FFEBAD',  // Creativity
        lavender: '#D6BCFA',// Rest/Meditation
        textMain: '#4A4A4A',
        textMuted: '#9BA1A6',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
