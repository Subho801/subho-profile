import Link from "next/link";
import Image from "next/image";
import { getIntel } from "../data/getIntel";

function getEndsIn(date: string) {
  const end = new Date(date).getTime();
  const now = Date.now();

  const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Ended";
  if (days === 1) return "1 day";

  return `${days} days`;
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

        {/* Hero */}

<section className="mb-8 rounded-[32px] border border-sky-400/10 bg-gradient-to-br from-sky-500/[0.10] via-white/[0.03] to-transparent p-7">

  <div className="mb-5 flex items-center gap-4">

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
        Intel Giveaways
      </h1>
    </div>

  </div>

  <div className="grid w-full gap-4 md:grid-cols-3">

    <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4">

      <div className="text-2xl">🎟</div>

      <div className="mt-2 text-2xl font-bold">
        {intel.type}
      </div>

      <div className="text-sm text-white/45">
        Giveaway Type
      </div>

    </div>

    <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4">

      <div className="text-2xl">✅</div>

      <div className="mt-2 text-2xl font-bold">
        Active
      </div>

      <div className="text-sm text-white/45">
        Status
      </div>

    </div>

    <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4">

      <div className="text-2xl">⏰</div>

      <div className="mt-2 text-2xl font-bold text-sky-400">
        {getEndsIn(intel.ends_at)}
      </div>

      <div className="text-sm text-white/45">
        Ends In
      </div>

    </div>

  </div>

</section>

        <div className="mb-6">

          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">
            Intel Gaming Access
          </p>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />

            <p className="text-[13px] font-black uppercase tracking-wider text-white">
              Current Giveaway
            </p>
            <span className="ml-2 rounded-full border border-sky-400/20 bg-sky-400/[0.08] px-2 py-0.5 text-[11px] text-zinc-400">
              1 available
            </span>
            
          </div>

        </div>

        {/* Cards */}

<section className="mb-14">

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/35 hover:shadow-[0_0_35px_rgba(56,189,248,.12)]">

      <div className="relative h-48 overflow-hidden">

        <Image
          src={intel.image}
          alt={intel.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 backdrop-blur">

          <Image
            src="/intel.png"
            alt="Intel"
            width={22}
            height={22}
          />

        </div>

      </div>

      <div className="flex h-[270px] flex-col p-5">

        <div className="min-h-[64px]">

          <h2 className="line-clamp-2 text-lg font-bold text-white">
            {intel.title}
          </h2>

        </div>

        <div className="mt-4 rounded-2xl border border-sky-400/10 bg-sky-500/[0.04] p-3">

          <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            Ends In
          </div>

          <div className="mt-1 text-2xl font-black text-sky-400">
            ⏰ {getEndsIn(intel.ends_at)}
          </div>

        </div>

        <a
          href={intel.url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex w-fit rounded-xl bg-sky-500 px-6 py-3 text-sm font-black text-white transition-all hover:scale-105 hover:bg-sky-400"
        >
          Open Giveaway
        </a>

      </div>

    </article>

  </div>

</section>
      </div>
    </main>
  );
}
