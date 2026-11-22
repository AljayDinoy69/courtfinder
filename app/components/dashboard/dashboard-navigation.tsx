"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppRole } from "@/lib/auth/roles";

const navigationByRole: Record<AppRole, { label: string; href: string; icon: string }[]> = {
  admin: [
    { label: "Overview", href: "/admin", icon: "▦" },
    { label: "Facilities", href: "/admin/facilities", icon: "⌖" },
    { label: "Bookings", href: "/admin/bookings", icon: "▤" },
    { label: "Profile settings", href: "/admin/profile", icon: "◎" },
  ],
  owner: [
    { label: "Overview", href: "/dashboard/owner", icon: "▦" },
    { label: "My facilities", href: "/dashboard/owner/facilities", icon: "⌖" },
    { label: "Bookings", href: "/dashboard/owner/bookings", icon: "▤" },
    { label: "Profile settings", href: "/dashboard/owner/profile", icon: "◎" },
  ],
  player: [
    { label: "Overview", href: "/dashboard/player", icon: "▦" },
    { label: "Explore courts", href: "/dashboard/player/facilities", icon: "⌖" },
    { label: "My bookings", href: "/dashboard/player/bookings", icon: "▤" },
    { label: "Profile settings", href: "/dashboard/player/profile", icon: "◎" },
  ],
};

export default function DashboardNavigation({ role }: { role: AppRole }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="space-y-1">
      {navigationByRole[role].map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
              active
                ? "bg-[#eaf4f8] text-[#006cb7]"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            <span aria-hidden="true" className="w-5 text-center text-base">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}