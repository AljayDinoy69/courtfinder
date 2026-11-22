
import { Suspense } from "react";
import BookingForm from "../../components/facilities/booking-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default function FacilityDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f5f5f5]" />}>
      <FacilityDetailContent params={params} />
    </Suspense>
  );
}

async function FacilityDetailContent({ params }: Props) {
  await connection();

  const { id } = await params;
  const supabase = await createClient();

  const { data: facility, error } = await supabase
    .from("facilities")
    .select(`
      id,
      name,
      description,
      address,
      city,
      province,
      contact_number,
      email,
      website_url,
      cover_image_url,
      courts (
        id,
        name,
        sport,
        description,
        price_per_hour,
        status
      )
    `)
    .eq("id", id)
    .eq("status", "published")
    .eq("is_verified", true)
    .single();

  if (error || !facility) {
    notFound();
  }

  const activeCourts = (facility.courts ?? []).filter(
    (court) => court.status === "active"
  );

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/facilities"
          className="font-semibold text-[#006cb7]"
        >
          ← Back to facilities
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div
            className="h-72 bg-cover bg-center md:h-[420px]"
            style={{
              backgroundImage: facility.cover_image_url
                ? `url("${facility.cover_image_url}")`
                : "linear-gradient(135deg, #1e293b, #475569)",
            }}
          />

          <div className="p-6 md:p-10">
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
              VERIFIED FACILITY
            </span>

            <h1 className="mt-4 font-oswald text-4xl font-bold uppercase text-gray-900 md:text-5xl">
              {facility.name}
            </h1>

            <p className="mt-3 text-gray-500">
              📍 {facility.address}, {facility.city}
              {facility.province ? `, ${facility.province}` : ""}
            </p>

            {facility.description && (
              <p className="mt-6 max-w-3xl leading-7 text-gray-600">
                {facility.description}
              </p>
            )}

            <div className="mt-10">
              <h2 className="font-oswald text-3xl font-bold uppercase">
                Available Courts
              </h2>

              {activeCourts.length > 0 ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {activeCourts.map((court) => (
                    <div
                        key={court.id}
                        className="rounded-2xl border border-gray-200 bg-white p-5"
                    >
                        <p className="text-sm font-semibold uppercase text-[#008840]">
                        {court.sport}
                        </p>

                        <h3 className="mt-2 text-xl font-bold">
                        {court.name}
                        </h3>

                        {court.description && (
                        <p className="mt-2 text-sm text-gray-500">
                            {court.description}
                        </p>
                        )}

                        <BookingForm
                        courtId={court.id}
                        pricePerHour={Number(court.price_per_hour)}
                        />
                    </div>
                    ))}
                </div>
              ) : (
                <p className="mt-4 text-gray-500">
                  No active courts are currently listed.
                </p>
              )}
            </div>

            <div className="mt-10 border-t pt-6">
              <h2 className="text-lg font-bold">Contact facility</h2>

              {facility.contact_number && (
                <p className="mt-2 text-gray-600">
                  Phone: {facility.contact_number}
                </p>
              )}

              {facility.email && (
                <p className="mt-2 text-gray-600">
                  Email: {facility.email}
                </p>
              )}

              {facility.website_url && (
                <a
                  href={facility.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[#006cb7] hover:underline"
                >
                  Visit website →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
