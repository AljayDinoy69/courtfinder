import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/auth/roles";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (token_hash && type === "email") {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as EmailOtpType,
    });

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      const destination = getDashboardPath(profile?.role);

      if (destination) {
        return NextResponse.redirect(new URL(destination, origin));
      }

      return NextResponse.redirect(new URL("/login?error=role_unavailable", origin));
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
}