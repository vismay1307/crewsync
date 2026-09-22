import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        "surface-inset": "var(--surface-inset)",
        "surface-highlight": "var(--surface-highlight)",
        card: "var(--card)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        muted: "var(--muted)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        accent: "var(--accent)",
        destructive: "var(--destructive)",
        success: "var(--success)",
        warning: "var(--warning)",
      },
      fontSize: {
        display: ["2rem", { lineHeight: "2.4rem", fontWeight: "650" }],
        title: ["1.5rem", { lineHeight: "2rem", fontWeight: "650" }],
        section: ["1.0625rem", { lineHeight: "1.625rem", fontWeight: "650" }],
        body: ["0.875rem", { lineHeight: "1.5rem" }],
        caption: ["0.75rem", { lineHeight: "1.125rem" }],
      },
      spacing: {
        shell: "1.5rem",
        section: "1.25rem",
        field: "0.875rem",
      },
      borderRadius: {
        card: "0.5rem",
        control: "0.375rem",
      },
    },
  },
} satisfies Config;

export default config;
