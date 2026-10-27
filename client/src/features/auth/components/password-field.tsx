"use client";

import { useState, type ComponentProps } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/api/cn";

type PasswordFieldProps = Omit<ComponentProps<typeof Input>, "type">;

export function PasswordField({
  className,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        className={cn("pr-11", className)}
        type={visible ? "text" : "password"}
      />

      <button
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-1.5 top-8 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-highlight hover:text-foreground"
        onClick={() => setVisible((current) => !current)}
        type="button"
      >
        {visible ? (
          <FiEyeOff aria-hidden="true" size={16} />
        ) : (
          <FiEye aria-hidden="true" size={16} />
        )}
      </button>
    </div>
  );
}