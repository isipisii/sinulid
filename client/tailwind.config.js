/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matteBlack: "#1A1A1A",
        secondaryBg: "#282828",
        primaryText:"",
        lightText: "#929191",
        cta: "#FAF906",
        
      },
      
    },
  },
  plugins: [],
}

