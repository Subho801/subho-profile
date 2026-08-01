"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Reward = {
  id: number;
  title: string;
  status: number;
  cost: number;
  type: number;
  image: string | null;
  region: string;
};

type RogData = {
  updated: string;
  count: number;
  items: Reward[];
};

export default function RogRewardsPage() {
  const [data, setData] = useState<RogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rog")
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const available = useMemo(() => {
    return data?.items.filter((i) => i.status === 1).length ?? 0;
  }, [data]);

  const regions = useMemo(() => {
    return new Set(data?.items.map((i) => i.region)).size;
  }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center text-zinc-400">
        Loading ROG Rewards...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center text-red-400">
        Failed to load ROG rewards.
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

        <section className="mb-12 rounded-[32px] border border-red-500/10 bg-gradient-to-br from-red-500/[0.12] via-white/[0.03] to-transparent p-7">

          <div className="mb-5 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">

              <Image
                src="/rog.png"
                alt="ROG"
                width={36}
                height={36}
              />

            </div>

            <div>

              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
                ROG Elite Rewards
              </p>

              <h1 className="text-5xl font-bold">
                ASUS ROG Rewards
              </h1>

            </div>

          </div>

          <p className="max-w-2xl text-sm text-zinc-400">
            Live ASUS ROG Elite rewards collected from every supported region.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">

              <div className="text-2xl font-bold">
                🌍 {regions}
              </div>

              <div className="text-sm text-white/45">
                Regions
              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">

              <div className="text-2xl font-bold">
                🎁 {data.count}
              </div>

              <div className="text-sm text-white/45">
                Rewards
              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">

              <div className="text-2xl font-bold text-green-400">
                🟢 {available}
              </div>

              <div className="text-sm text-white/45">
                Available
              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}
