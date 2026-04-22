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
        foreground: "#0A0A0A",
        text: "#5B3B1B",
        muted: "#F5F5F5",
        "muted-foreground": "#737373",
        border: "#E5E5E5",
        error: {
          DEFAULT: "#FF4747",
        },
        accent: "#1A1A1A",
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
