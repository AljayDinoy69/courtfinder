import type { ReactNode } from "react";
import ProtectedDashboardLayout from "@/app/components/dashboard/protected-dashboard-layout";

export default function PlayerDashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedDashboardLayout role="player">{children}</ProtectedDashboardLayout>;
}