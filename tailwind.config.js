const { fontFamily } = require('tailwindcss/defaultTheme')
const defaultTheme = require('tailwindcss/defaultTheme')
const { blackA } = require('@radix-ui/colors');


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        poiretOne: ['var(--font-poiretOne)', ...fontFamily.sans],
        poppins: ['var(--font-poppins)', ...fontFamily.sans]
      },

      screens: {
        "lsm": "450px",
        ...defaultTheme.screens,
      },

      colors:{
        //!Light Theme
        primary:"#EBEBEB",
        secondary: "#AAAAAA",
        terciary: "#9E9E9E",
        strong: "#8F8F8F",
        hilight: "#D9D9D9",
        red: "#BD0303",
        greenV: "#087E14",
        blue: "#005694",
        //!Dark Theme
        dprimary:"#181818",
        dsecondary: "#494949",
        dterciary: "#5C5C5C",
        dstrong: "#8F8F8F",
        dhilight: "#121212",
        dred: "#BD0303",
        dgreenV: "#087E14",
        dblue: "#005694",
        dstrong: "#333333",

        //!Radix
        ...blackA,
      },

      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: 'translateX(-2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
      
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },

  },
  plugins: [],
};
