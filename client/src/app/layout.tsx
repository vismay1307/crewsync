import type { Metadata } from "next";
import { Figtree } from "next/font/google";

import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const figtree = Figtree({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: {
    default: "CrewSync",
    template: "%s · CrewSync",
  },
  description: "Workspaces, projects, and tasks for your team.",
};

// Apply the saved theme before the first page paint.
const themeScript = `
(function () {
  var root = document.documentElement;
  var theme = "light";

  try {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }

    var stored = window.localStorage.getItem("crewsync-theme");

    if (stored === "light" || stored === "dark") {
      theme = stored;
    }
  } catch (error) {}

  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={figtree.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>

      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}