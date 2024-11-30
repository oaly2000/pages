import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  plugins: [
    // @ts-expect-error:
    daisyui,
  ],
  daisyui: {
    themes: ["retro", "synthwave"],
    darkTheme: "synthwave",
  }
} satisfies Config;
