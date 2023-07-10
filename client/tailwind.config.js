/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matteBlack: "#0C0C0D",
        primaryText:"",
        lightText: "#929191",
        cta: "#FAF906",
        
      },
      
    },
  },
  plugins: [],
}

