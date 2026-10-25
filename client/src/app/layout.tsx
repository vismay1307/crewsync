
import "./globals.css";
import { Roboto } from "next/font/google";

import { AppProviders } from "@/providers/app-providers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const themeScript = `
(function () {
  try {
    var storedTheme = localStorage.getItem("crewsync-theme");
    var theme = storedTheme === "light" ? "light" : "dark";
    var root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  } catch (error) {}
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
      className={roboto.variable}
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
