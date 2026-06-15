"use client";

import { useEffect, useState } from "react";
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
        <Link href="/freebies" className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white">
          ← Back to Freebies Hub
        </Link>

        <section className="mb-12 rounded-[32px] border border-purple-400/10 bg-gradient-to-br from-purple-500/[0.12] via-white/[0.03] to-transparent p-7">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-400">
            GOG Giveaways
          </p>

          <h1 className="mt-3 text-5xl font-bold">GOG Limited-Time Giveaways</h1>

          <p className="mt-4 max-w-2xl text-sm text-zinc-400">
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
      There's nothing free here right now.
    </p>

  </section>
) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-3xl border border-purple-400/20 bg-[#121212]"
              >
                {item.image && (
                  <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                )}

                <div className="p-5">
                  <h2 className="text-lg font-bold text-white">{item.title}</h2>
                  <p className="mt-1 text-sm text-zinc-400">Limited-time GOG giveaway</p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-xl bg-purple-400 px-6 py-3 text-sm font-black text-black hover:bg-purple-300"
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