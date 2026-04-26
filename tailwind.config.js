/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FFF7EC",
        foreground: "#5B3B1B",
        muted: "#F3E8D8",
        "muted-foreground": "#8A6B4D",
        neutral: "#858585",
        border: "#E8D8A8",
        error: {
          DEFAULT: "#FF4747",
        },
        accent: "#106088",
      },
      fontFamily: {
        neuton: ["Neuton-Regular"],
        "neuton-light": ["Neuton-Light"],
        "neuton-extralight": ["Neuton-ExtraLight"],
        "neuton-italic": ["Neuton-Italic"],
        "neuton-bold": ["neuton-bold"],
        "neuton-extrabold": ["Neuton-ExtraBold"],
      },
    },
  },
  plugins: [],
};
