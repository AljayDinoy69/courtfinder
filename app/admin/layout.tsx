import type { ReactNode } from "react";
import ProtectedDashboardLayout from "@/app/components/dashboard/protected-dashboard-layout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <ProtectedDashboardLayout role="admin">{children}</ProtectedDashboardLayout>;
}