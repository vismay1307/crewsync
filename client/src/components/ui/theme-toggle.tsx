"use client";

import { FiMoon, FiSun } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      aria-label="Dark mode"
      aria-pressed={theme === "dark"}
      className={className}
      onClick={toggleTheme}
      size="icon"
      title="Toggle light and dark theme"
      variant="ghost"
    >
      <FiSun aria-hidden="true" className="hidden dark:block" size={16} />
      <FiMoon aria-hidden="true" className="block dark:hidden" size={16} />
    </Button>
  );
}