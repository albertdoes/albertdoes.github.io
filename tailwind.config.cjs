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

const format = "hsl";

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
            
            white: `${format}(var(--white), <alpha-value>)`,
            black: `${format}(var(--black), <alpha-value>)`,
            
            fore: `${format}(var(--fg), <alpha-value>)`,
            foreAccent: `${format}(var(--fg-accent), <alpha-value>)`,
            back: `${format}(var(--bg), <alpha-value>)`,
            backAccent: `${format}(var(--bg-accent), <alpha-value>)`,
            text: `${format}(var(--text), <alpha-value>)`,
            textAccent: `${format}(var(--text-accent), <alpha-value>)`,
            muted: `${format}(var(--muted), <alpha-value>)`,
            mutedAccent: `${format}(var(--muted-accent), <alpha-value>)`,
        },
        fontFamily: {
            serif: ["BricolageGrotesque", "serif"],
            sans: ["InstrumentSans", "sans-serif"],
            mono: ["JetBrainsMono", "monospace"]
        },
        fontSize: length,
        spacing: length,
        extend: {},
    },
    plugins: [],
}
