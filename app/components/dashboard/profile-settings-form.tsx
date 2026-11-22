"use client";

import { useActionState } from "react";
import {
  updateMyProfile,
  type ProfileActionState,
} from "@/app/actions/profile";

const initialState: ProfileActionState = {
  success: false,
  message: "",
};

type ProfileSettingsFormProps = {
  fullName: string;
  email: string;
  roleLabel: string;
};

export default function ProfileSettingsForm({
  fullName,
  email,
  roleLabel,
}: ProfileSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateMyProfile,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="profile-full-name" className="mb-2 block text-sm font-semibold text-zinc-800">
          Full name
        </label>
        <input
          id="profile-full-name"
          name="full_name"
          type="text"
          defaultValue={fullName}
          maxLength={80}
          autoComplete="name"
          required
          className="min-h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none transition focus:border-[#006cb7] focus:ring-2 focus:ring-[#006cb7]/15"
        />
      </div>

      <div>
        <label htmlFor="profile-email" className="mb-2 block text-sm font-semibold text-zinc-800">
          Email address
        </label>
        <input
          id="profile-email"
          type="email"
          value={email}
          readOnly
          className="min-h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-500"
        />
        <p className="mt-2 text-xs text-zinc-500">Email changes are managed through account verification.</p>
      </div>

      <div>
        <label htmlFor="profile-role" className="mb-2 block text-sm font-semibold text-zinc-800">
          Account role
        </label>
        <input
          id="profile-role"
          type="text"
          value={roleLabel}
          readOnly
          className="min-h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-sm capitalize text-zinc-500"
        />
      </div>

      {state.message && (
        <p
          role={state.success ? "status" : "alert"}
          className={`text-sm font-medium ${state.success ? "text-[#007a3d]" : "text-red-700"}`}
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="min-h-11 rounded-lg bg-[#006cb7] px-5 text-sm font-bold text-white transition hover:bg-[#005088] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
        <span className="text-xs text-zinc-500">Your role cannot be changed here.</span>
      </div>
    </form>
  );
}