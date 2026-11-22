import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CourtCreationForm } from "@/app/components/owner/listing-forms";

export default async function NewOwnerCourtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: facility } = await supabase
    .from("facilities")
    .select("id, name, city")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!facility) notFound();

  return (
    <main className="min-h-screen bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard/owner/courts" className="text-sm font-semibold text-[#006cb7] hover:underline">← Manage courts</Link>
        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006cb7]">{facility.name}{facility.city ? ` · ${facility.city}` : ""}</p>
          <h1 className="mt-1 font-oswald text-3xl font-bold uppercase text-zinc-950 sm:text-4xl">Add a court</h1>
          <p className="mt-2 text-sm text-zinc-600">Set the court sport, description, and hourly price.</p>
        </div>
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <CourtCreationForm facilityId={facility.id} />
        </section>
      </div>
    </main>
  );
}