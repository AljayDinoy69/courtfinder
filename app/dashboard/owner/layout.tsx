import type { ReactNode } from "react";
import ProtectedDashboardLayout from "@/app/components/dashboard/protected-dashboard-layout";

export default function OwnerDashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedDashboardLayout role="owner">{children}</ProtectedDashboardLayout>;
}