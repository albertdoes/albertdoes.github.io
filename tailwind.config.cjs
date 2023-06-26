/** @type {import('tailwindcss').Config} */

const factor = 1.359;
const length = {
    "x3l": `${Math.pow(factor, 4)}rem`,
    "x2l": `${Math.pow(factor, 3)}rem`,// h1
    "xl": `${Math.pow(factor, 2)}rem`,// h2
    "lg": `${Math.pow(factor, 1)}rem`,// h3
    "md": `${Math.pow(factor, 0)}rem`,// h4
    "sm": `${Math.pow(factor, -1)}rem`,
    "xs": `${Math.pow(factor, -2)}rem`,
    "x2s": `${Math.pow(factor, -3)}rem`,
    "x3s": `${Math.pow(factor, -4)}rem`,
}

module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: ["class", "[data-mode='dark']"],
    theme: {
        screens: {
            "xs": "40ch",
            "sm": "55ch",
            "md": "70ch",
            "lg": "90ch",
            "xl": "105ch",
        },
        colors: {
            transparent: "transparent",
            current: "currentColor",
            default: "rgb(var(--grey-500))",

            white: "rgb(var(--white), <alpha-value>)",
            black: "rgb(var(--black), <alpha-value>)",

            fore: "rgb(var(--fg), <alpha-value>)",
            back: "rgb(var(--bg), <alpha-value>)",

            purple: {
                100: "rgb(var(--purple-100), <alpha-value>)",
                200: "rgb(var(--purple-200), <alpha-value>)",
                300: "rgb(var(--purple-300), <alpha-value>)",
                400: "rgb(var(--purple-400), <alpha-value>)",
                500: "rgb(var(--purple-500), <alpha-value>)",
                600: "rgb(var(--purple-600), <alpha-value>)",
                700: "rgb(var(--purple-700), <alpha-value>)",
                800: "rgb(var(--purple-800), <alpha-value>)",
                900: "rgb(var(--purple-900), <alpha-value>)",
                DEFAULT: "rgb(var(--purple-500), <alpha-value>)",
            },
            blue: {
                100: "rgb(var(--blue-100), <alpha-value>)",
                200: "rgb(var(--blue-200), <alpha-value>)",
                300: "rgb(var(--blue-300), <alpha-value>)",
                400: "rgb(var(--blue-400), <alpha-value>)",
                500: "rgb(var(--blue-500), <alpha-value>)",
                600: "rgb(var(--blue-600), <alpha-value>)",
                700: "rgb(var(--blue-700), <alpha-value>)",
                800: "rgb(var(--blue-800), <alpha-value>)",
                900: "rgb(var(--blue-900), <alpha-value>)",
                DEFAULT: "rgb(var(--blue-500), <alpha-value>)",
            },
            red: {
                100: "rgb(var(--red-100), <alpha-value>)",
                200: "rgb(var(--red-200), <alpha-value>)",
                300: "rgb(var(--red-300), <alpha-value>)",
                400: "rgb(var(--red-400), <alpha-value>)",
                500: "rgb(var(--red-500), <alpha-value>)",
                600: "rgb(var(--red-600), <alpha-value>)",
                700: "rgb(var(--red-700), <alpha-value>)",
                800: "rgb(var(--red-800), <alpha-value>)",
                900: "rgb(var(--red-900), <alpha-value>)",
                DEFAULT: "rgb(var(--red-500), <alpha-value>)",
            },
            yellow: {
                100: "rgb(var(--yellow-100), <alpha-value>)",
                200: "rgb(var(--yellow-200), <alpha-value>)",
                300: "rgb(var(--yellow-300), <alpha-value>)",
                400: "rgb(var(--yellow-400), <alpha-value>)",
                500: "rgb(var(--yellow-500), <alpha-value>)",
                600: "rgb(var(--yellow-600), <alpha-value>)",
                700: "rgb(var(--yellow-700), <alpha-value>)",
                800: "rgb(var(--yellow-800), <alpha-value>)",
                900: "rgb(var(--yellow-900), <alpha-value>)",
                DEFAULT: "rgb(var(--yellow-500), <alpha-value>)",
            },
            green: {
                100: "rgb(var(--green-100), <alpha-value>)",
                200: "rgb(var(--green-200), <alpha-value>)",
                300: "rgb(var(--green-300), <alpha-value>)",
                400: "rgb(var(--green-400), <alpha-value>)",
                500: "rgb(var(--green-500), <alpha-value>)",
                600: "rgb(var(--green-600), <alpha-value>)",
                700: "rgb(var(--green-700), <alpha-value>)",
                800: "rgb(var(--green-800), <alpha-value>)",
                900: "rgb(var(--green-900), <alpha-value>)",
                DEFAULT: "rgb(var(--green-500), <alpha-value>)",
            },
            grey: {
                100: "rgb(var(--grey-100), <alpha-value>)",
                200: "rgb(var(--grey-200), <alpha-value>)",
                300: "rgb(var(--grey-300), <alpha-value>)",
                400: "rgb(var(--grey-400), <alpha-value>)",
                500: "rgb(var(--grey-500), <alpha-value>)",
                600: "rgb(var(--grey-600), <alpha-value>)",
                700: "rgb(var(--grey-700), <alpha-value>)",
                800: "rgb(var(--grey-800), <alpha-value>)",
                900: "rgb(var(--grey-900), <alpha-value>)",
                DEFAULT: "rgb(var(--grey-500), <alpha-value>)",
            },
        },
        fontFamily: {
            serif: ["Fraunces", "serif"],
            sans: ["IBMPlexSans", "sans-serif"],
            mono: ["IBMPlexMono", "monospace"]
        },
        fontSize: length,
        spacing: length,
        extend: {},
    },
    plugins: [],
}
