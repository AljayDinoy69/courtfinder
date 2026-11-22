import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FacilityCreationForm } from "@/app/components/owner/listing-forms";

export default async function NewOwnerFacilityPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard/owner/facilities" className="text-sm font-semibold text-[#006cb7] hover:underline">← My facilities</Link>
        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">Facility registration</p>
          <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">Add a facility</h1>
          <p className="mt-2 text-sm text-zinc-600">Enter the facility details. New listings are saved as drafts and reviewed by an Admin before publication.</p>
        </div>

        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <FacilityCreationForm />
        </section>
      </div>
    </main>
  );
}