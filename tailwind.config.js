const { fontFamily } = require('tailwindcss/defaultTheme')
const defaultTheme = require('tailwindcss/defaultTheme')


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
        dhilight: "#D9D9D9",
        dred: "#BD0303",
        dgreenV: "#087E14",
        dblue: "#005694"
      }

    },

  },
  plugins: [],
};
