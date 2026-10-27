"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthAlert,
  AuthCard,
  type AuthPanelContent,
} from "@/features/auth/components/auth-card";
import { PasswordField } from "@/features/auth/components/password-field";
import { useLoginMutation } from "@/features/auth/hooks/use-auth-mutations";
import { ApiError } from "@/lib/api/client";

type LoginErrors = Partial<Record<"email" | "password", string>>;

const loginPanel: AuthPanelContent = {
  heading: "Pick up where your team left off.",
  description:
    "Your workspaces, projects, and tasks are right where you left them.",
  points: [
    "Track projects and tasks in every workspace",
    "See who changed what in the activity log",
    "Stay current with notifications",
  ],
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation(returnTo);

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
      panel={loginPanel}
      subtitle="Log in to your CrewSync account."
      title="Welcome back"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          error={errors.email}
          label="Email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />

        <PasswordField
          autoComplete="current-password"
          error={errors.password}
          label="Password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />

        {apiError ? <AuthAlert>{apiError}</AuthAlert> : null}

        <Button
          className="w-full"
          disabled={!canSubmit}
          loading={loginMutation.isPending}
          type="submit"
        >
          {loginMutation.isPending ? "Logging in" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 border-t border-border pt-5 text-center text-sm text-muted">
        Need an account?{" "}
        <Link
          className="font-medium text-primary hover:underline"
          href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}
        >
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}