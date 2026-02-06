import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ["var(--font-bodoni)", "serif"],
        serif: ["var(--font-great-vibes)", "cursive"],
        handwritten: ["var(--font-permanent-marker)", "cursive"],
      },
      colors: {
        metallic: "#B8B8B8",
      },
      backgroundImage: {
        curtain: "linear-gradient(90deg, #8B0000 0%, #DC143C 20%, #8B0000 40%, #DC143C 60%, #8B0000 80%, #DC143C 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;