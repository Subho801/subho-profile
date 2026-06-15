"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function GOGGiveawaysPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gog-giveaways")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <section className="mb-12 rounded-[32px] border border-purple-400/10 bg-gradient-to-br from-purple-500/[0.12] via-white/[0.03] to-transparent p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 ring-1 ring-purple-400/20">
              <Image
                src="/gog-logo.png"
                alt="GOG"
                width={38}
                height={38}
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-400">
                GOG Giveaways
              </p>

              <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                GOG Limited-Time Giveaways
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm text-zinc-400">
            Detects only real limited-time GOG giveaways, not permanent free catalog games.
          </p>
        </section>

        {loading ? (
          <div className="text-zinc-500">Checking GOG giveaway...</div>
        ) : items.length === 0 ? (
          <section className="flex min-h-[650px] flex-col items-center justify-center text-center">
            <img
              src="/touch-grass.png"
              alt="Touch Grass"
              className="mb-8 w-[320px] max-w-full object-contain"
            />

            <h2 className="text-6xl font-black tracking-tight text-white">
              Touch grass 🌱
            </h2>

            <p className="mt-4 text-xl text-zinc-400">
              There&apos;s nothing free here right now.
            </p>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-3xl border border-purple-400/20 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_0_35px_rgba(192,132,252,0.10)]"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="flex h-[220px] flex-col p-5">
                  <h2 className="line-clamp-2 text-lg font-bold text-white">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-400">
                    Limited-time GOG giveaway
                  </p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-fit rounded-xl bg-purple-400 px-6 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:bg-purple-300"
                  >
                    Claim Giveaway
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}