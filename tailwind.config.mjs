/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    "bg-gradient-to-r",
    "from-purple-500",
    "via-pink-500",
    "to-red-500",
    "bg-clip-text",
    "text-transparent",
  ],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
