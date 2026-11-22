"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type LoginActionState } from "@/app/actions/auth";

const initialState: LoginActionState = { message: "" };

type LoginFormProps = {
  onSwitchToSignup?: () => void;
};

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">CourtFinder account</p>
        <h2 className="mt-2 font-oswald text-3xl font-bold uppercase text-zinc-950">Welcome back</h2>
        <p className="mt-1 text-sm text-zinc-500">Sign in to continue to your dashboard.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-zinc-700">
          Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className="mt-2 min-h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none transition focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15"
          />
        </label>

        <label className="block text-sm font-semibold text-zinc-700">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            className="mt-2 min-h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none transition focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="min-h-12 w-full rounded-lg bg-[#006cb7] px-4 text-sm font-bold text-white transition hover:bg-[#005088] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      {state.message && <p role="alert" className="text-sm text-red-700">{state.message}</p>}

      <p className="text-center text-sm text-zinc-500">
        New to CourtFinder?{" "}
        {onSwitchToSignup ? (
          <button type="button" onClick={onSwitchToSignup} className="font-semibold text-[#006cb7] hover:underline">
            Create an account
          </button>
        ) : (
          <Link href="/register" className="font-semibold text-[#006cb7] hover:underline">Create an account</Link>
        )}
      </p>
    </form>
  );
}