
import Link from "next/link";
import {
  AuthModalProvider,
  AuthModalTrigger,
} from "@/app/components/auth/landing-auth-modal";

const sports = [
  {
    name: "PICKLEBALL",
    value: "pickleball",
    description: "Find a place for your next match.",
    image:
      "https://images.unsplash.com/photo-1672223304549-9e52be1232b6?w=800&q=80",
  },
  {
    name: "BADMINTON",
    value: "badminton",
    description: "Discover badminton courts nearby.",
    image:
      "https://images.unsplash.com/photo-1657704358775-ed705c7388d2?w=800&q=80",
  },
  {
    name: "BASKETBALL",
    value: "basketball",
    description: "Find your next basketball court.",
    image:
      "https://images.unsplash.com/photo-1709587823534-11c11a163c07?w=800&q=80",
  },
];

const additionalSports = [
  { name: "Tennis", value: "tennis" },
  { name: "Volleyball", value: "volleyball" },
  { name: "Other sports", value: "other" },
];

function SolarIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <iconify-icon icon={`solar:${name}`} className={className} />
  );
}

export default function HomePage() {
  return (
    <AuthModalProvider>
    <main className="mx-0 max-w-[1600px] overflow-hidden rounded-none bg-white shadow-2xl md:mx-4 md:my-4 md:rounded-[2rem] xl:mx-auto">

      {/* HERO */}
      <section className="relative flex h-[90vh] min-h-[650px] items-center overflow-hidden bg-black text-white">

        {/* Your uploaded hero image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: "url('/images/courtfinder-hero.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-black/30" />

        {/* NAVIGATION - Keep absolute and z-50 */}
        <nav className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-7 text-white md:px-12 lg:px-16">

          <Link
            href="/"
            className="font-oswald text-3xl font-bold italic tracking-tighter md:text-4xl"
          >
            COURTFINDER<span className="text-[#008840]">.</span>
          </Link>

          <div className="hidden items-center gap-9 text-xs font-semibold uppercase tracking-[0.16em] lg:flex">
            <Link href="/facilities" className="transition hover:text-[#008840]">
              Explore Courts
            </Link>
            <a href="#sports" className="transition hover:text-[#008840]">
              Sports
            </a>
            <a href="#how-it-works" className="transition hover:text-[#008840]">
              How It Works
            </a>
            <AuthModalTrigger mode="signup" signupRole="owner" className="transition hover:text-[#008840]">
              List Your Facility
            </AuthModalTrigger>
          </div>

          <div className="flex items-center gap-4">
            <AuthModalTrigger
              mode="login"
              className="hidden rounded-full border border-white/40 px-5 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-white hover:text-black sm:block"
            >
              Login
            </AuthModalTrigger>

            <AuthModalTrigger
              mode="signup"
              className="hidden bg-[#006cb7] px-6 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-[#005088] sm:block"
            >
              Get Started
            </AuthModalTrigger>

            <details className="relative lg:hidden">
              <summary
                aria-label="Toggle navigation menu"
                className="flex cursor-pointer list-none items-center justify-center rounded-full border border-white/40 p-3 [&::-webkit-details-marker]:hidden"
              >
                <SolarIcon name="hamburger-menu-linear" className="text-xl" />
              </summary>
              <div className="absolute right-0 top-full mt-3 w-[min(18rem,calc(100vw-2rem))] space-y-1 rounded-xl bg-white p-2 text-sm font-semibold text-zinc-900 shadow-xl">
                <Link href="/facilities" className="block rounded-lg px-4 py-3 hover:bg-zinc-100">Explore Courts</Link>
                <a href="#sports" className="block rounded-lg px-4 py-3 hover:bg-zinc-100">Sports</a>
                <a href="#how-it-works" className="block rounded-lg px-4 py-3 hover:bg-zinc-100">How It Works</a>
                <AuthModalTrigger mode="signup" signupRole="owner" className="block w-full rounded-lg px-4 py-3 text-left hover:bg-zinc-100">List Your Facility</AuthModalTrigger>
                <div className="grid grid-cols-2 gap-2 border-t border-zinc-200 p-2">
                  <AuthModalTrigger mode="login" className="rounded-lg border border-zinc-200 px-3 py-3 text-center">Login</AuthModalTrigger>
                  <AuthModalTrigger mode="signup" className="rounded-lg bg-[#006cb7] px-3 py-3 text-center text-white">Get Started</AuthModalTrigger>
                </div>
              </div>
            </details>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full px-6 pt-24 md:px-12 lg:px-16">

          <div className="glass-panel mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <span className="h-2 w-2 rounded-full bg-[#008840]" />
            Your game starts here
          </div>

          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
            Discover. Compare. Play.
          </p>

          <h1 className="max-w-5xl font-oswald text-5xl font-bold uppercase leading-[0.94] tracking-tight sm:text-7xl lg:text-8xl">
            Find your court.
            <br />
            Play your <span className="text-[#008840]">game.</span>
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-7 text-white/80 md:text-base">
            Discover sports facilities across the Philippines.
            Compare courts, explore locations, and request your next booking
            with CourtFinder.
          </p>

          {/* SEARCH FORM */}
          <form
            action="/facilities"
            method="GET"
            className="mt-9 grid max-w-3xl grid-cols-1 gap-3 rounded-2xl bg-white p-3 text-zinc-950 shadow-2xl sm:grid-cols-[1fr_1fr_auto] sm:items-center"
          >
            <label className="flex items-center gap-3 border-b border-zinc-200 px-3 py-3 sm:border-b-0 sm:border-r">
              <SolarIcon
                name="map-point-linear"
                className="shrink-0 text-xl text-[#006cb7]"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  Location
                </span>
                <input
                  name="location"
                  type="text"
                  placeholder="City or province"
                  className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
              </span>
            </label>

            <label className="flex items-center gap-3 px-3 py-3">
              <SolarIcon
                name="tennis-linear"
                className="shrink-0 text-xl text-[#006cb7]"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  Sport
                </span>
                <select
                  name="sport"
                  defaultValue=""
                  className="mt-1 w-full bg-transparent text-sm outline-none"
                >
                  <option value="">All sports</option>
                  <option value="pickleball">Pickleball</option>
                  <option value="badminton">Badminton</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="volleyball">Volleyball</option>
                </select>
              </span>
            </label>

            <button
              type="submit"
              className="group flex items-center justify-center gap-3 bg-[#006cb7] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#005088]"
            >
              Find Courts
              <SolarIcon
                name="arrow-right-up-linear"
                className="text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-3 text-[10px] font-semibold uppercase tracking-widest text-white/80">
            <span>Popular:</span>
            <Link href="/facilities?sport=pickleball" className="underline underline-offset-4 hover:text-white">Pickleball</Link>
            <Link href="/facilities?sport=badminton" className="underline underline-offset-4 hover:text-white">Badminton</Link>
            <Link href="/facilities?sport=basketball" className="underline underline-offset-4 hover:text-white">Basketball</Link>
          </div>
        </div>
      </section>

      {/* SPORTS CATEGORIES */}
      <section id="sports" className="px-6 py-20 md:px-12 lg:px-16 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#006cb7]">
              Find your game
            </p>
            <h2 className="font-oswald text-3xl font-bold uppercase tracking-tight text-zinc-950 sm:text-4xl md:text-6xl">
              Explore sports.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-zinc-500">
            From casual games to competitive matches, discover facilities
            that match your favorite sport.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {sports.map((sport) => (
            <a
              key={sport.value}
              href={`/facilities?sport=${sport.value}`}
              className="group relative h-[440px] overflow-hidden bg-zinc-200"
            >
              <img
                src={sport.image}
                alt={sport.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                  Explore facilities
                </p>

                <h3 className="font-oswald text-4xl font-bold uppercase tracking-tight">
                  {sport.name}
                </h3>

                <p className="mt-2 text-sm text-white/80">
                  {sport.description}
                </p>

                <span className="mt-7 inline-flex items-center gap-3 border-b border-white pb-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Find courts
                  <SolarIcon
                    name="arrow-right-up-linear"
                    className="text-base transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {additionalSports.map((sport) => (
            <a
              key={sport.value}
              href={`/facilities?sport=${sport.value}`}
              className="rounded-full border border-zinc-200 px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition hover:border-[#006cb7] hover:bg-[#006cb7] hover:text-white"
            >
              {sport.name}
              <span className="ml-2">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-[#f5f5f5] px-6 py-20 md:px-12 lg:px-16 lg:py-28"
      >
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#006cb7]">
            Simple from start to finish
          </p>

          <h2 className="font-oswald text-4xl font-bold uppercase leading-tight tracking-tight text-zinc-950 md:text-6xl">
            Your game.
            <br />
            Your court.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-500">
            Finding and reserving a sports facility should be simple.
            CourtFinder brings the process together in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <article className="group relative min-h-[400px] overflow-hidden rounded-[2.5rem] bg-zinc-300">
            <img
              src="https://images.unsplash.com/photo-1709587825152-d4ce1b2224a3?w=1600&q=80"
              alt="Sports facility"
              className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

            <div className="absolute bottom-0 p-8 text-white md:p-10">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                01 / Discover
              </p>
              <h3 className="font-oswald text-4xl font-bold uppercase md:text-5xl">
                Find places to play.
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                Search sports facilities by city, province, sport, and location.
              </p>
            </div>
          </article>

          <article className="group relative min-h-[400px] overflow-hidden rounded-[2.5rem] bg-zinc-300">
            <img
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
              alt="Sports training"
              className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

            <div className="absolute bottom-0 p-8 text-white md:p-10">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                02 / Book
              </p>
              <h3 className="font-oswald text-4xl font-bold uppercase md:text-5xl">
                Request your game.
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                Choose your preferred court, date, and time, then wait for
                the facility to confirm your request.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* FEATURED FACILITIES */}
      <section id="facilities" className="px-6 py-20 md:px-12 lg:px-16 lg:py-28">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#006cb7]">
              Discover places to play
            </p>
            <h2 className="font-oswald text-3xl font-bold uppercase tracking-tight text-zinc-950 sm:text-4xl md:text-6xl">
              Featured facilities.
            </h2>
          </div>

          <Link
            href="/facilities"
            className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition hover:text-[#006cb7] sm:flex"
          >
            View all courts
            <SolarIcon name="arrow-right-up-linear" className="text-lg" />
          </Link>
        </div>

        {/* Real facility records will be connected here from Supabase */}
        <div className="rounded-[2rem] bg-[#f5f5f5] px-6 py-16 text-center md:px-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#006cb7]">
            <SolarIcon name="map-point-search-linear" className="text-3xl" />
          </div>

          <h3 className="mt-6 font-oswald text-3xl font-bold uppercase tracking-tight text-zinc-950">
            Your next court is waiting.
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-500">
            We&apos;re building our directory of sports facilities.
            Explore available listings or help grow CourtFinder by
            adding your facility.
          </p>

          <Link
            href="/facilities"
            className="mt-7 inline-flex items-center gap-3 bg-[#006cb7] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#005088]"
          >
            Explore all facilities
            <SolarIcon name="arrow-right-up-linear" className="text-lg" />
          </Link>
        </div>
      </section>

      {/* FACILITY OWNER CTA */}
      <section className="relative overflow-hidden bg-[#006cb7] px-6 py-20 text-white md:px-12 lg:px-16 lg:py-24">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-5 -top-16 h-64 w-64 rounded-full border border-white/10" />

        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
              For facility owners
            </p>

            <h2 className="max-w-3xl font-oswald text-4xl font-bold uppercase leading-tight tracking-tight md:text-6xl">
              Bring your facility online.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-white/80">
              Showcase your courts, connect with players, and receive
              booking requests through CourtFinder.
            </p>
          </div>

          <AuthModalTrigger
            mode="signup"
            signupRole="owner"
            className="group inline-flex shrink-0 items-center gap-5 self-start bg-white px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-950 transition hover:bg-zinc-100 md:self-center"
          >
            List your facility
            <SolarIcon
              name="arrow-right-up-linear"
              className="text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </AuthModalTrigger>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-zinc-950 px-6 pb-7 pt-16 text-white md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-12 border-b border-zinc-800 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-oswald text-4xl font-bold italic tracking-tighter">
              COURTFINDER<span className="text-[#008840]">.</span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-zinc-400">
              Discover sports facilities, find your next court, and
              make your next game happen.
            </p>

            <div className="mt-7 flex gap-3">
              <a href="#" aria-label="Facebook" className="rounded-full border border-zinc-700 p-3 transition hover:bg-[#006cb7]">
                <SolarIcon name="videocamera-record-linear" className="text-lg" />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-full border border-zinc-700 p-3 transition hover:bg-[#006cb7]">
                <SolarIcon name="album-linear" className="text-lg" />
              </a>
              <a href="#" aria-label="Website" className="rounded-full border border-zinc-700 p-3 transition hover:bg-[#006cb7]">
                <SolarIcon name="global-linear" className="text-lg" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em]">For players</h3>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link href="/facilities" className="hover:text-white">Find courts</Link></li>
              <li><Link href="/facilities?sport=pickleball" className="hover:text-white">Pickleball</Link></li>
              <li><Link href="/facilities?sport=badminton" className="hover:text-white">Badminton</Link></li>
              <li><AuthModalTrigger mode="login" className="text-left hover:text-white">My bookings</AuthModalTrigger></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em]">For facility owners</h3>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><AuthModalTrigger mode="signup" signupRole="owner" className="text-left hover:text-white">List your facility</AuthModalTrigger></li>
              <li><AuthModalTrigger mode="login" className="text-left hover:text-white">Owner login</AuthModalTrigger></li>
              <li><a href="#how-it-works" className="hover:text-white">How it works</a></li>
              <li><a href="#" className="hover:text-white">Contact us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em]">Explore</h3>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link href="/facilities" className="hover:text-white">All facilities</Link></li>
              <li><Link href="/facilities?sport=basketball" className="hover:text-white">Basketball</Link></li>
              <li><Link href="/facilities?sport=tennis" className="hover:text-white">Tennis</Link></li>
              <li><a href="#sports" className="hover:text-white">All sports</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-7 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500 sm:flex-row">
          <p>© 2026 CourtFinder. All rights reserved.</p>
          <p>Discover. Compare. Play.</p>
        </div>
      </footer>
    </main>
    </AuthModalProvider>
  );
}
