import Link from "next/link";
import { getIntel } from "../data/getIntel";

export default async function IntelPage() {
  const intel = await getIntel();

  if (!intel) {
    return (
      <main className="mx-auto max-w-6xl p-10 text-white">
        Failed to load Intel giveaway.
      </main>
    );
  }

  const endDate = new Date(intel.ends_at);

  return (
    <main className="min-h-screen px-5 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/freebies"
          className="text-sm text-white/45 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <section className="mt-8 rounded-[32px] border border-sky-500/15 bg-gradient-to-br from-sky-500/[0.08] via-white/[0.03] to-transparent p-7">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-3xl">
              🔵
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">
                Intel Gaming Access
              </p>

              <h1 className="text-4xl font-bold">
                Intel Sweepstakes
              </h1>

              <p className="mt-2 text-sm text-white/50">
                Live giveaways fetched automatically from Intel Gaming Access.
              </p>
            </div>

          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-3xl">🎟</div>
              <div className="mt-3 text-3xl font-bold">
                1
              </div>
              <div className="text-sm text-white/45">
                Active Sweepstakes
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-3xl">⏳</div>
              <div className="mt-3 text-3xl font-bold">
                {endDate.toLocaleDateString()}
              </div>
              <div className="text-sm text-white/45">
                Ends
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-3xl">🟢</div>
              <div className="mt-3 text-3xl font-bold">
                {intel.status ?? "Active"}
              </div>
              <div className="text-sm text-white/45">
                Giveaway Status
              </div>
            </div>

          </div>
        </section>

        <section className="mt-10">

          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">
              Intel Gaming Access
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Current Giveaway
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">

            <img
              src={intel.image}
              alt={intel.title}
              className="h-80 w-full object-cover"
            />

            <div className="p-7">

              <h3 className="text-3xl font-bold">
                {intel.title}
              </h3>

              <p className="mt-4 leading-7 text-white/60">
                {intel.description}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-wider text-sky-400">
                    Giveaway Type
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {intel.type}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-wider text-sky-400">
                    Ends
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {endDate.toLocaleString()}
                  </p>
                </div>

              </div>

              <a
                href={intel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center rounded-xl bg-sky-600 px-6 py-3 font-semibold transition hover:bg-sky-500"
              >
                Open Giveaway →
              </a>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}
