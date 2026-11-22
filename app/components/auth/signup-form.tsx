"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAccount, type AuthActionState } from "@/app/actions/auth";
import { publicSignupRoles } from "@/lib/auth/roles";

const initialState: AuthActionState = { message: "" };

type SignupFormProps = {
  initialRole?: (typeof publicSignupRoles)[number];
  onSwitchToLogin?: () => void;
};

export default function SignupForm({
  initialRole = "player",
  onSwitchToLogin,
}: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(registerAccount, initialState);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<(typeof publicSignupRoles)[number]>(initialRole);
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Join CourtFinder</p>
        <h2 className="mt-2 font-oswald text-3xl font-bold uppercase text-zinc-950">Create account</h2>
        <p className="mt-1 text-sm text-zinc-500">Choose how you want to use CourtFinder.</p>
      </div>

      <label className="block text-sm font-semibold text-zinc-700">
        Full name
        <input
          type="text"
          name="full_name"
          autoComplete="name"
          placeholder="Your name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
          className="mt-2 min-h-11 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none transition focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15"
        />
      </label>

      <label className="block text-sm font-semibold text-zinc-700">
        Email address
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-2 min-h-11 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none transition focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15"
        />
      </label>

      <label className="block text-sm font-semibold text-zinc-700">
        Account type
        <select
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as (typeof publicSignupRoles)[number])}
          required
          className="mt-2 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 font-normal outline-none transition focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15"
        >
          {publicSignupRoles.map((signupRole) => (
            <option key={signupRole} value={signupRole}>
              {signupRole === "owner" ? "Facility owner" : "Player"}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-zinc-700">
        Password
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          className="mt-2 min-h-11 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none transition focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15"
        />
      </label>

      <p className="text-xs text-zinc-500">Admin accounts are created by an administrator.</p>

      <button
        type="submit"
        disabled={isPending}
        className="min-h-12 w-full rounded-lg bg-[#006cb7] px-4 text-sm font-bold text-white transition hover:bg-[#005088] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>

      {state.message && <p role="alert" className="text-sm text-red-700">{state.message}</p>}

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        {onSwitchToLogin ? (
          <button type="button" onClick={onSwitchToLogin} className="font-semibold text-[#006cb7] hover:underline">
            Sign in
          </button>
        ) : (
          <Link href="/login" className="font-semibold text-[#006cb7] hover:underline">Sign in</Link>
        )}
      </p>
    </form>
  );
}