"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath, publicSignupRoles } from "@/lib/auth/roles";

export type AuthActionState = {
  message: string;
};

export type LoginActionState = AuthActionState;

function profileLookupError(code?: string) {
  if (code === "42P17") {
    return "Supabase has a recursive Row Level Security policy on profiles. Run the fix_recursive_profile_rls migration, then try again.";
  }

  if (code === "42501") {
    return "Supabase blocked access to your profile. Apply the profile self-read RLS migration, then try again.";
  }

  if (code === "PGRST116") {
    return "No profiles row exists for this Auth user. Run the missing-profile backfill migration, then try again.";
  }

  return `The profile role lookup failed${code ? ` (${code})` : ""}. Check that the profile trigger and self-read policy are installed.`;
}

export async function registerAccount(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const requestedRole = String(formData.get("role") ?? "");
  const role = publicSignupRoles.find((publicRole) => publicRole === requestedRole);

  if (!email || !fullName || password.length < 8 || !role) {
    return {
      message:
        "Enter your name, a valid email, a password of at least 8 characters, and a valid account type.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) return { message: error.message };

  if (!data.user || !data.session) {
    return {
      message:
        "Account created, but Supabase email confirmation is still enabled. Disable Confirm email in Supabase Auth settings, then try again.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut({ scope: "local" });
    return {
      message: `Account created, but role lookup failed: ${profileLookupError(profileError?.code)}`,
    };
  }

  const destination = getDashboardPath(profile.role);

  if (!destination) {
    await supabase.auth.signOut({ scope: "local" });
    return { message: "The account has an invalid role. Contact an administrator." };
  }

  redirect(destination);
}

export async function signIn(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { message: error?.message || "Unable to sign in." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return {
      message: profileLookupError(profileError?.code),
    };
  }

  const destination = getDashboardPath(profile.role);

  if (!destination) {
    await supabase.auth.signOut();
    return {
      message: "Your account has an invalid role. Please contact the administrator.",
    };
  }

  redirect(destination);
}