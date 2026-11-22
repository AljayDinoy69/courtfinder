"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  success: boolean;
  message: string;
};

export async function updateMyProfile(
  _previousState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!fullName || fullName.length > 80) {
    return {
      success: false,
      message: "Enter a name between 1 and 80 characters.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Sign in to update your profile." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      success: false,
      message: "Unable to save profile changes. Check your profile update policy and try again.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/admin");
  revalidatePath("/dashboard/owner");
  revalidatePath("/dashboard/player");

  return { success: true, message: "Profile settings saved." };
}