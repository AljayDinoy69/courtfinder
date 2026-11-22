import { Suspense } from "react";
import { connection } from "next/server";
import ProfileSettingsForm from "@/app/components/dashboard/profile-settings-form";
import { getDashboardUser } from "@/lib/auth/dashboard-user";
import type { AppRole } from "@/lib/auth/roles";

const roleLabels: Record<AppRole, string> = {
  admin: "Administrator",
  owner: "Facility owner",
  player: "Player",
};

export default function ProfileSettingsContent({ role }: { role: AppRole }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f5f7f6]" />}>
      <ProfileSettingsRequestContent role={role} />
    </Suspense>
  );
}

async function ProfileSettingsRequestContent({ role }: { role: AppRole }) {
  await connection();
  const { user, profile } = await getDashboardUser(role);

  return (
    <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 text-zinc-900 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Account</p>
        <h1 className="mt-2 font-oswald text-3xl font-bold uppercase sm:text-4xl">Profile settings</h1>
        <p className="mt-2 text-sm text-zinc-600">Manage the account details used across your CourtFinder dashboard.</p>

        <section className="mt-7 rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_rgba(12,40,52,0.04)] sm:p-7">
          <div className="mb-6 border-b border-zinc-100 pb-5">
            <h2 className="text-lg font-bold">Personal information</h2>
            <p className="mt-1 text-sm text-zinc-500">Your name is visible to other users when you book or manage facilities.</p>
          </div>
          <ProfileSettingsForm
            fullName={profile.full_name || ""}
            email={user.email || ""}
            roleLabel={roleLabels[role]}
          />
        </section>
      </div>
    </main>
  );
}