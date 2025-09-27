/**** Tailwind config ****/
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // bg: "#0F172A",        // main background (dark navy)
          bg: "#00000",        // main background (dark navy)
          surface: "#1E293B",   // card/surface background
          text: "#FFFFFF",      // primary text
          secondary: "#94A3B8", // secondary text
          blue1: "#2563EB",     // gradient start
          blue2: "#3B82F6",     // gradient end
          glow: "#1E40AF",      // glowing accent
          googleRed: "#DC2626",
          googleGreen: "#22C55E",
          googleYellow: "#FACC15",
          googleBlue: "#2563EB",
        },
      },
    },
  },
  plugins: [],
};
