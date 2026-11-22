
import Link from "next/link";

type Court = {
  id: string;
  name: string;
  sport: string;
  price_per_hour: number;
};

type Facility = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  province: string | null;
  cover_image_url: string | null;
  courts: Court[];
};

export default function FacilityCard({
  facility,
}: {
  facility: Facility;
}) {
  const sports = [
    ...new Set(facility.courts.map((court) => court.sport)),
  ];

  const lowestPrice = facility.courts.length
    ? Math.min(...facility.courts.map((court) => court.price_per_hour))
    : null;

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/facilities/${facility.id}`}>
        <div className="relative h-56 overflow-hidden bg-gray-200">
          {facility.cover_image_url ? (
            <div
              role="img"
              aria-label={`${facility.name} facility`}
              className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url("${facility.cover_image_url}")`,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-white">
              <span className="text-5xl">🏟️</span>
            </div>
          )}

          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-700">
            VERIFIED
          </span>
        </div>

        <div className="p-5">
          <div className="mb-2 flex flex-wrap gap-2">
            {sports.map((sport) => (
              <span
                key={sport}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700"
              >
                {sport}
              </span>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            {facility.name}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            📍 {facility.city}
            {facility.province ? `, ${facility.province}` : ""}
          </p>

          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {facility.address}
          </p>

          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-xs text-gray-500">Starting from</p>
              <p className="font-bold text-gray-900">
                {lowestPrice !== null
                  ? `₱${lowestPrice.toLocaleString("en-PH")} / hour`
                  : "Price unavailable"}
              </p>
            </div>

            <span className="text-sm font-bold text-[#006cb7]">
              View facility →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
