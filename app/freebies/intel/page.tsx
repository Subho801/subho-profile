import Link from "next/link";
import Image from "next/image";
import { getIntel } from "../data/getIntel";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function IntelPage() {
  const intel = await getIntel();

  if (!intel) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 text-white">
        Failed to load Intel giveaway.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        {/* HERO */}

        <section className="mb-12 rounded-[32px] border border-sky-400/10 bg-gradient-to-br from-sky-500/[0.10] via-white/[0.03] to-transparent p-7">

          <div className="mb-4 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 ring-1 ring-sky-400/20">

              <Image
                src="/intel.png"
                alt="Intel"
                width={36}
                height={36}
              />

            </div>

            <div>

              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-400">
                Intel Gaming Access
              </p>

              <h1 className="text-5xl font-bold">
                Current Giveaway
              </h1>

            </div>

          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">

              <div className="text-2xl">
                🎟
              </div>

              <div className="mt-2 text-2xl font-bold">
                1
              </div>

              <div className="text-sm text-white/45">
                Active Giveaway
              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">

              <div className="text-2xl">
                📅
              </div>

              <div className="mt-2 text-2xl font-bold">
                {formatDate(intel.ends_at)}
              </div>

              <div className="text-sm text-white/45">
                Ends
              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">

              <div className="text-2xl">
                🟢
              </div>

              <div className="mt-2 text-2xl font-bold capitalize">
                {intel.status}
              </div>

              <div className="text-sm text-white/45">
                Status
              </div>

            </div>

          </div>

        </section>

        {/* SECTION TITLE */}

        <div className="mb-6">

          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">
            Intel Gaming Access
          </p>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />

            <p className="text-[13px] font-black uppercase tracking-wider text-white">
              Intel Giveaway
            </p>

          </div>

        </div>

        {/* CARD */}

        <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/35 hover:shadow-[0_0_35px_rgba(56,189,248,.12)]">

          <div className="relative h-56 overflow-hidden">

            <Image
              src={intel.image}
              alt={intel.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute left-5 top-5 rounded-xl bg-black/50 p-2 backdrop-blur">

              <Image
                src="/logos/intel.png"
                alt="Intel"
                width={28}
                height={28}
              />

            </div>

          </div>

          <div className="flex flex-col p-6">

            <h2 className="text-2xl font-bold">
              {intel.title}
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl border border-sky-400/10 bg-sky-500/[0.04] p-4">

                <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                  Giveaway Type
                </div>

                <div className="mt-2 font-semibold">
                  {intel.type}
                </div>

              </div>

              <div className="rounded-2xl border border-sky-400/10 bg-sky-500/[0.04] p-4">

                <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                  Ends
                </div>

                <div className="mt-2 font-semibold">
                  {formatDate(intel.ends_at)}
                </div>

              </div>

            </div>

            <a
              href={intel.url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-fit rounded-xl bg-sky-500 px-6 py-3 text-sm font-black text-white transition-all hover:scale-105 hover:bg-sky-400"
            >
              Open Giveaway →
            </a>

          </div>

        </article>

      </div>
    </main>
  );
}
