"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function cleanTitle(title: string) {
  return title
    .replace(/\[Steam\]/gi, "")
    .replace(/\(game\)/gi, "")
    .replace(/\(steam\)/gi, "")
    .trim();
}

export default function GleamPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gleam-giveaways")
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

        <section className="mb-12 rounded-[32px] border border-orange-400/10 bg-gradient-to-br from-orange-500/[0.12] via-white/[0.03] to-transparent p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/10 ring-1 ring-orange-400/20">
              <img
                src="/gleam-logo.png"
                alt="Gleam"
                className="h-9 w-9 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-400">
                Gleam Giveaways
              </p>

              <h1 className="mt-1 text-4xl font-bold md:text-5xl">
                Free Game Key Giveaways
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm text-zinc-400">
            Automatically tracks Gleam game key giveaways posted on
            r/FreeGameFindings.
          </p>
        </section>

        {loading ? (
          <div className="text-zinc-500">Checking Gleam giveaways...</div>
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
              There&apos;s no free keys right now.
            </p>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const image =
                item.image?.replaceAll("&amp;", "&") ||
                "/gleam-default-banner.png";

              return (
                <article
                  key={item.url}
                  className="group overflow-hidden rounded-3xl border border-orange-400/20 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/40 hover:shadow-[0_0_35px_rgba(251,146,60,0.10)]"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-500/20 via-black to-orange-950/30">
                    <img
                      src={image}
                      alt={cleanTitle(item.title)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/gleam-default-banner.png";
                      }}
                    />
                  </div>

                  <div className="flex h-[250px] flex-col p-5">
                    <div className="mb-4">
                      <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-400">
                        {item.platform || "Game Key"}
                      </span>
                    </div>

                    <h2 className="line-clamp-2 text-lg font-bold text-white">
                      {cleanTitle(item.title)}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                      Source: {item.source || "r/FreeGameFindings"}
                    </p>

                    {item.redditUrl && (
                      <a
                        href={item.redditUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 w-fit text-xs text-zinc-500 hover:text-orange-400"
                      >
                        View Reddit post ↗
                      </a>
                    )}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-flex w-fit rounded-xl bg-orange-400 px-6 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:bg-orange-300"
                    >
                      Open Giveaway
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}