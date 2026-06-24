"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type MicrosoftGame = {
  title: string;
  platform: string;
  status: string;
  url: string;
  image: string;
  price: string;
  discount: string;
  source: string;
};

type MicrosoftResponse = {
  updatedAt: string | null;
  count: number;
  items: MicrosoftGame[];
};

export default function MicrosoftStorePage() {
  const [data, setData] = useState<MicrosoftResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/microsoft-store")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const items = useMemo(() => data?.items || [], [data]);

  return (
    <main className="min-h-screen bg-[#071016] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <section className="mb-12 rounded-[32px] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/[0.16] via-blue-500/[0.08] to-transparent p-7">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-black/30 backdrop-blur">
              <img
                src="/microsoft-store.png"
                alt="Microsoft Store"
                className="h-12 w-12 object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Microsoft Store
              </p>

              <h1 className="text-4xl font-black md:text-6xl">
                Microsoft Store Freebies
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm text-zinc-400">
            Tracks Microsoft Store games that are currently free.
          </p>

          {data && (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Stat label="Free Games" value={items.length} />
              <Stat label="Provider" valueText="Microsoft Store" />
            </div>
          )}
        </section>

        <h2 className="mb-5 text-2xl font-black">Free Now</h2>

        {loading ? (
          <p className="text-zinc-500">Checking Microsoft Store freebies...</p>
        ) : items.length === 0 ? (
          <p className="text-zinc-500">No Microsoft Store freebies found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((game) => (
              <GameCard key={game.title} game={game} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  valueText,
}: {
  label: string;
  value?: number;
  valueText?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-2xl font-black">{valueText ?? value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}

function GameCard({ game }: { game: MicrosoftGame }) {
  return (
  <a
    href={game.url}
    target="_blank"
    rel="noreferrer"
    className="block"
  >
    <article
  onClick={() => window.open(game.url, "_blank")}
  className="group cursor-pointer overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#101827] transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]"
>
      <div className="relative h-52 overflow-hidden bg-black">
        <img
          src={game.image}
          alt={game.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        <div className="absolute left-3 top-3 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/50 bg-black/50 shadow-[0_0_25px_rgba(34,211,238,0.30)] backdrop-blur-xl">
          <img
            src="/microsoft-store.png"
            alt="Microsoft Store"
            className="h-7 w-7 object-contain"
          />
        </div>
      </div>

      <div className="flex h-[175px] flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300">
            Microsoft Store
          </span>

          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
            Free
          </span>

          {game.discount && (
            <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300">
              {game.discount}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-xl font-black">{game.title}</h3>


        <div className="mt-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-emerald-400">Claimable</p>
            <p className="mt-1 text-xs text-zinc-500">Price: {game.price}</p>
          </div>

          <a
            href={game.url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:bg-cyan-300"
          >
            Claim
          </a>
        </div>
      </div>
    </article>
    </a>
  );
}