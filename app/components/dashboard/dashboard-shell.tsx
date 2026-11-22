import Link from "next/link";
import LogoutButton from "@/app/components/auth/logout-button";
import DashboardNavigation from "@/app/components/dashboard/dashboard-navigation";
import type { AppRole } from "@/lib/auth/roles";

type DashboardShellProps = {
  role: AppRole;
  fullName: string;
  email: string;
  children: React.ReactNode;
};

const dashboardLabels: Record<AppRole, string> = {
  admin: "Administration",
  owner: "Facility owner",
  player: "Player account",
};

const profilePathByRole: Record<AppRole, string> = {
  admin: "/admin/profile",
  owner: "/dashboard/owner/profile",
  player: "/dashboard/player/profile",
};

export default function DashboardShell({
  role,
  fullName,
  email,
  children,
}: DashboardShellProps) {
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CF";

  return (
    <div className="min-h-screen bg-[#f5f7f6] md:flex">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white p-5 md:sticky md:top-0 md:flex md:h-screen md:flex-col">
        <Link href="/" className="flex items-center gap-3 px-2 py-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006cb7] font-oswald text-xl font-bold text-white">
            C
          </span>
          <span>
            <span className="block font-oswald text-lg font-bold uppercase text-zinc-950">CourtFinder</span>
            <span className="block text-xs text-zinc-500">{dashboardLabels[role]}</span>
          </span>
        </Link>

        <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          Workspace
        </p>
        <DashboardNavigation role={role} />

        <div className="mt-auto border-t border-zinc-100 pt-4">
          <Link href={profilePathByRole[role]} className="flex min-w-0 items-center gap-3 rounded-lg p-2 hover:bg-zinc-50">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7f3ed] text-sm font-bold text-[#008840]">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-zinc-900">{fullName}</span>
              <span className="block truncate text-xs text-zinc-500">{email}</span>
            </span>
          </Link>
          <LogoutButton className="mt-3 min-h-10 w-full rounded-lg border border-zinc-200 px-3 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50" />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#006cb7] font-oswald text-lg font-bold text-white">C</span>
              <span className="min-w-0">
                <span className="block truncate font-oswald text-base font-bold uppercase text-zinc-950">CourtFinder</span>
                <span className="block truncate text-[10px] text-zinc-500">{dashboardLabels[role]}</span>
              </span>
            </Link>
            <LogoutButton className="min-h-10 rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50" />
          </div>
          <details className="group mt-3">
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between rounded-lg bg-zinc-50 px-3 text-sm font-semibold text-zinc-700 [&::-webkit-details-marker]:hidden">
              <span>Menu</span>
              <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="pt-2">
              <DashboardNavigation role={role} />
            </div>
          </details>
        </div>
        {children}
      </div>
    </div>
  );
}