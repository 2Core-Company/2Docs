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
        hilight: "#10B981",
        red: "#BD0303",
        greenV: "#087E14",
        blue: "#005694",
        //!Dark Theme
        dprimary:"#262626",
        dsecondary: "#181818",
        dstrong: "##FFFFFF",
        dhilight: "#10B981",
        dred: "#BC2C1A",
        dblue: "#2E86AB",
        dstrong: "#333333",

        //!Radix
        ...blackA,
      },
    },

  },
  plugins: [],
};
