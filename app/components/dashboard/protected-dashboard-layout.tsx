import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/auth/roles";
import DashboardShell from "@/app/components/dashboard/dashboard-shell";

export default function ProtectedDashboardLayout({
  role,
  children,
}: {
  role: AppRole;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLayoutFallback />}>
      <ProtectedDashboardContent role={role}>{children}</ProtectedDashboardContent>
    </Suspense>
  );
}

async function ProtectedDashboardContent({
  role,
  children,
}: {
  role: AppRole;
  children: ReactNode;
}) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== role) redirect("/");

  return (
    <DashboardShell
      role={role}
      fullName={profile.full_name || (role === "admin" ? "Administrator" : role === "owner" ? "Owner" : "Player")}
      email={user.email || ""}
    >
      {children}
    </DashboardShell>
  );
}

function DashboardLayoutFallback() {
  return (
    <div className="min-h-screen bg-[#f5f7f6] md:flex" aria-label="Loading dashboard">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white p-5 md:block">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-zinc-100" />
        <div className="mt-12 space-y-3">
          <div className="h-11 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-11 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-11 animate-pulse rounded-lg bg-zinc-100" />
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <div className="h-64 animate-pulse rounded-xl bg-zinc-200" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="h-32 animate-pulse rounded-xl bg-white" />
          <div className="h-32 animate-pulse rounded-xl bg-white" />
          <div className="h-32 animate-pulse rounded-xl bg-white" />
        </div>
      </main>
    </div>
  );
}