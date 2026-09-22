import "./globals.css";
import { Roboto } from "next/font/google";
import Script from "next/script";

import { AppProviders } from "@/providers/app-providers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const themeScript = `
  (function () {
    try {
      var storedTheme = window.localStorage.getItem("crewsync-theme");
      var theme = storedTheme === "light" ? "light" : "dark";
      var root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      root.style.colorScheme = theme;
    } catch (_) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${roboto.variable} dark`} lang="en" suppressHydrationWarning>
      <Script
        dangerouslySetInnerHTML={{ __html: themeScript }}
        id="theme-script"
        strategy="beforeInteractive"
      />
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
