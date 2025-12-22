import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        panel: "rgb(16 16 18)",
        panel2: "rgb(22 22 26)",
        border: "rgb(40 40 46)",
        text: "rgb(240 240 245)",
        muted: "rgb(160 160 176)",
        brand: "rgb(139 92 246)",
        brand2: "rgb(34 211 238)",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
