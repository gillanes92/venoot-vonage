const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'primary': '#ED1C24',
                'secondary': '#FFFFFF',
                'terciary': '#01080D',
            },
            
            fontFamily: {
                'sans': ['Barlow Condensed', ...defaultTheme.fontFamily.sans]
            },
        },
    },

    buttonTheme: {
        extend: {
            colors: {
                'primary': '#ED1C24',
                'secondary': '#FFFFFF',
                'terciary': '#01080D',
            },
        },
    },
    plugins: [],
}
