/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       segoe: ['var(--segoe-ui-historic)'],
  //     },
  //   },
  // },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [require("daisyui")],
}
