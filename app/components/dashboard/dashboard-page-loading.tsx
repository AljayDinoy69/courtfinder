export default function DashboardPageLoading() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f5f7f6] px-4 py-6 sm:px-6 sm:py-8 lg:px-10" aria-label="Loading dashboard content">
      <div className="mx-auto max-w-6xl">
        <div className="h-3 w-28 animate-pulse rounded bg-[#c9e2f2]" />
        <div className="mt-3 h-9 w-56 max-w-full animate-pulse rounded bg-zinc-200" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-zinc-200" />
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="h-28 animate-pulse rounded-xl bg-white" />
          <div className="h-28 animate-pulse rounded-xl bg-white" />
          <div className="h-28 animate-pulse rounded-xl bg-white" />
        </div>
        <div className="mt-6 h-72 animate-pulse rounded-xl bg-white" />
      </div>
    </main>
  );
}