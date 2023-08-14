/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matteBlack: "#101010",
        secondaryBg: "#282828",
        primaryText:"",
        lightText: "#929191",
        cta: "#FAF906",
        borderColor: "#353131f6"
      },
      backgroundImage: {
        'threads-bg': "url('/assets/threadsbg.svg')",
      }
    },
  },
  plugins: [],
}

