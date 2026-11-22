import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export default function ProfileSettingsRedirect() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f5f7f6]" />}>
      <ProfileRedirect />
    </Suspense>
  );
}

async function ProfileRedirect() {
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

  if (profile?.role === "admin") redirect("/admin/profile");
  if (profile?.role === "owner") redirect("/dashboard/owner/profile");
  if (profile?.role === "player") redirect("/dashboard/player/profile");

  return redirect("/login?error=role_unavailable");
}