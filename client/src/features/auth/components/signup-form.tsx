"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/features/auth/components/auth-card";
import { useSignupMutation } from "@/features/auth/hooks/use-auth-mutations";
import { ApiError } from "@/lib/api/client";

type SignupErrors = Partial<
  Record<"firstName" | "lastName" | "email" | "password", string>
>;

export function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signupMutation = useSignupMutation();

  const errors = useMemo<SignupErrors>(() => {
    const nextErrors: SignupErrors = {};

    if (firstName && firstName.trim().length < 2) {
      nextErrors.firstName = "First name must be at least 2 characters.";
    }

    if (lastName && lastName.trim().length < 2) {
      nextErrors.lastName = "Last name must be at least 2 characters.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email.";
    }

    if (password) {
      if (password.length < 8) {
        nextErrors.password = "Password must be at least 8 characters.";
      } else if (!/[A-Z]/.test(password)) {
        nextErrors.password = "Password must include one uppercase letter.";
      } else if (!/[a-z]/.test(password)) {
        nextErrors.password = "Password must include one lowercase letter.";
      } else if (!/[0-9]/.test(password)) {
        nextErrors.password = "Password must include one number.";
      }
    }

    return nextErrors;
  }, [email, firstName, lastName, password]);

  const canSubmit =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    email.length > 0 &&
    password.length >= 8 &&
    Object.keys(errors).length === 0 &&
    !signupMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    signupMutation.mutate({
      firstName,
      lastName,
      email,
      password,
    });
  }

  const apiError =
    signupMutation.error instanceof ApiError
      ? signupMutation.error.message
      : signupMutation.error?.message;

  return (
    <AuthCard
      subtitle="Create your account with the fields accepted by the CrewSync backend."
      title="Create account"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            autoComplete="given-name"
            error={errors.firstName}
            label="First name"
            name="firstName"
            onChange={(event) => setFirstName(event.target.value)}
            value={firstName}
          />
          <Input
            autoComplete="family-name"
            error={errors.lastName}
            label="Last name"
            name="lastName"
            onChange={(event) => setLastName(event.target.value)}
            value={lastName}
          />
        </div>
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
            autoComplete="new-password"
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
          {signupMutation.isPending ? "Creating account" : "Create account"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="font-medium text-primary hover:underline" href="/login">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
