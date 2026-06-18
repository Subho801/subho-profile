"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LunaGame {
  title: string;
  platform: string;
  status: string;
  url: string;
  image: string;
  source: string;
}

interface LunaResponse {
  updatedAt: string;
  count: number;
  items: LunaGame[];
}

export default function LunaPage() {
  const [data, setData] = useState<LunaResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/luna-games")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updatedText = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleString()
    : "Unknown";

  return (
    <main className="min-h-screen bg-[#080313] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <section className="mb-12 rounded-[32px] border border-purple-400/15 bg-gradient-to-br from-purple-500/[0.18] via-white/[0.03] to-transparent p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-400/10 ring-1 ring-purple-400/20">
              <span className="text-4xl">🌙</span>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-400">
                Luna / Prime Gaming
              </p>

              <h1 className="mt-1 text-4xl font-bold md:text-5xl">
                Amazon Luna Free Games
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm text-zinc-400">
            Claimable Luna games included with Prime Gaming.
          </p>

          {data && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-black">{data.count}</p>
                <p className="text-sm text-zinc-500">Claimable Games</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-black">Amazon Luna</p>
                <p className="text-sm text-zinc-500">Provider</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-zinc-300">{updatedText}</p>
                <p className="text-sm text-zinc-500">Last Updated</p>
              </div>
            </div>
          )}
        </section>

        {loading ? (
          <div className="text-zinc-500">Checking Luna games...</div>
        ) : !data || data.items.length === 0 ? (
          <section className="flex min-h-[550px] flex-col items-center justify-center text-center">
            <img
              src="/touch-grass.png"
              alt="Touch Grass"
              className="mb-8 w-[320px] max-w-full object-contain"
            />

            <h2 className="text-6xl font-black tracking-tight text-white">
              Touch grass 🌱
            </h2>

            <p className="mt-4 text-xl text-zinc-400">
              There&apos;s nothing claimable here right now.
            </p>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((game) => {
              const image = game.image || "/luna-default-banner.png";

              return (
                <a
                  key={game.title}
                  href={game.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-3xl border border-purple-400/20 bg-[#130b22] transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:shadow-[0_0_35px_rgba(168,85,247,0.14)]"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500/20 via-black to-fuchsia-950/30">
                    <img
                      src={image}
                      alt={game.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/luna-default-banner.png";
                      }}
                    />
                  </div>

                  <div className="flex h-[230px] flex-col p-5">
                    <div className="mb-4">
                      <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-bold text-purple-300">
                        Luna / Prime
                      </span>
                    </div>

                    <h2 className="line-clamp-2 text-xl font-black text-white">
                      {game.title}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                      Source: {game.source || "Amazon Luna"}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-400">
                        Claimable
                      </span>

                      <span className="rounded-xl bg-purple-500 px-5 py-3 text-sm font-black text-white transition-all group-hover:scale-105 group-hover:bg-purple-400">
                        Claim Game
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}