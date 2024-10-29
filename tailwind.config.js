import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], 
      },
      keyframes: {
        slide: {
          "0%": { transform: "translate(-100%)" },
          "100%": { transform: "translate(0px)" },
        },
        slideinRight: {
          "0%": { transform: "translate(100%)" },
          "100%": { transform: "translate(0px)" },
        },
        slideinLeft: {
          "0%": { transform: "translate(-100%)" },
          "100%": { transform: "translate(0px)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        jiggle: {
          "0%": {
              transform: "scale3d(1, 1, 100)"
          },
          "30%": {
              transform: "scale3d(1.25, 0.75, 100000000)"
          },
          "40%": {
              transform: "scale3d(0.75, 1.25, 1)"
          },
          "50%": {
              transform: "scale3d(1.15, 0.85, 1)"
          },
          "65%": {
              transform: "scale3d(0.95, 1.05, 1)"
          },
          "75%": {
              transform: "scale3d(1.05, 0.95, 1)"
          },
          "100%": {
              transform: "scale3d(1, 1, 1)"
          },    
      },
      rotateFull: {
            "0%": {
              transform: "rotate3d(0, 1, 0, 0deg) scale(1)",
            },
            "50%" : {
              transform : "rotate3d(0.5, 1, 0.25, 360deg) scale(0.5)"
            },
            "100%": {
              transform: "rotate3d(0.5, 1, 0.25, 720deg) scale(1)", 
            },
          },
      },
      animation: {
        slidein: "slide 1s ease-out",
        slideOut: "slide 1s ease-in reverse",
        slideinRight: "slideinRight 1s ease-out",
        slideinLeft: "slideinLeft 1s ease-out",
        slideDown: "slideDown 1s ease-out",
        slideUp: "slideUp 1s ease-out",
        jiggle: 'jiggle 0.6s ease-in-out 0.25s 1',
        rotateFull : 'rotateFull 0.8s cubic-bezier(0.4, 0, 0.2, 1)  ',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {'.no-scrollbar::-webkit-scrollbar': {
          display: 'none', 
        '.no-scrollbar': {
          'scrollbar-width': 'none', 
          '-ms-overflow-style': 'none',
        },
        },
      });
    },
  ],
}

