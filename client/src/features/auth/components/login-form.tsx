"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/features/auth/components/auth-card";
import { useLoginMutation } from "@/features/auth/hooks/use-auth-mutations";

type LoginErrors = Partial<Record<"email" | "password", string>>;

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();

  const errors = useMemo<LoginErrors>(() => {
    const nextErrors: LoginErrors = {};

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email.";
    }

    if (password && password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  }, [email, password]);

  const canSubmit =
    email.length > 0 &&
    password.length >= 6 &&
    Object.keys(errors).length === 0 &&
    !loginMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    loginMutation.mutate({ email, password });
  }

  const apiError =
    loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : loginMutation.error?.message;

  return (
    <AuthCard
      subtitle="Use your CrewSync account credentials. Authentication is handled by the backend cookie session."
      title="Log in"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          error={errors.email}
          label="Email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
        <div className="relative">
          <Input
            autoComplete="current-password"
            error={errors.password}
            label="Password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-8 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-background hover:text-foreground"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        {apiError ? <p className="text-sm text-destructive">{apiError}</p> : null}
        <Button className="w-full" disabled={!canSubmit} type="submit">
          {loginMutation.isPending ? "Logging in" : "Log in"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Need an account?{" "}
        <Link className="font-medium text-primary hover:underline" href="/signup">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
