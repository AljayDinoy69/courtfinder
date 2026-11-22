import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/auth/roles";

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <DashboardRedirect />
    </Suspense>
  );
}

async function DashboardRedirect() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const destination = getDashboardPath(profile?.role);

  if (!destination) redirect("/login?error=role_unavailable");

  return redirect(destination);
}