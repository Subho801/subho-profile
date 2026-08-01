"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const STATUS = {
  1: {
    text: "Available",
    color:
      "border-green-500/30 bg-green-500/10 text-green-400",
    icon: "🟢",
  },
  2: {
    text: "Locked",
    color:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    icon: "🔒",
  },
  3: {
    text: "Sold Out",
    color:
      "border-red-500/30 bg-red-500/10 text-red-400",
    icon: "🔴",
  },
  4: {
    text: "Ended",
    color:
      "border-zinc-700 bg-zinc-800 text-zinc-400",
    icon: "⚫",
  },
} as const;

const REGION_NAMES: Record<string, string> = {
  in: "India",
  global: "Global",
  "ca-en": "Canada",
  cz: "Czech Republic",
  ea: "East Africa",
  "eg-en": "Egypt",
  fr: "France",
  hu: "Hungary",
  id: "Indonesia",
  il: "Israel",
  my: "Malaysia",
  mx: "Mexico",
  ph: "Philippines",
  pl: "Poland",
  ro: "Romania",
  ru: "Russia",
  "sa-ar": "Saudi Arabia",
  "sa-en": "UAE",
  sg: "Singapore",
  sk: "Slovakia",
  za: "South Africa",
  kr: "South Korea",
  tr: "Turkey",
  "ua-ua": "Ukraine",
  uk: "United Kingdom",
  us: "United States",
  wa: "West Africa",
  "rs-en": "West Balkans",
};

const REGION_FLAGS: Record<string, string> = {
  global: "🌍",

  in: "🇮🇳",
  us: "🇺🇸",
  uk: "🇬🇧",
  "ca-en": "🇨🇦",

  fr: "🇫🇷",
  cz: "🇨🇿",
  hu: "🇭🇺",
  pl: "🇵🇱",
  ro: "🇷🇴",
  sk: "🇸🇰",

  ru: "🇷🇺",
  kr: "🇰🇷",
  tr: "🇹🇷",
  il: "🇮🇱",

  id: "🇮🇩",
  my: "🇲🇾",
  ph: "🇵🇭",
  sg: "🇸🇬",

  mx: "🇲🇽",

  za: "🇿🇦",

  "eg-en": "🇪🇬",

  "sa-ar": "🇸🇦",
  "sa-en": "🇦🇪",

  "ua-ua": "🇺🇦",

  "rs-en": "🇷🇸",

  wa: "🇬🇭", // West Africa (Ghana)
  ea: "🇰🇪", // East Africa (Kenya)
};

export default function RogRewardsPage() {
  const [data, setData] = useState<RogData | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("in");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("title");

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

  const regionOptions = useMemo(() => {
    if (!data) return [];

    return [...new Set(data.items.map((i) => i.region))].sort();
  }, [data]);

  const rewards = useMemo(() => {
  if (!data) return [];

  let items = [...data.items];

  if (search.trim()) {
    items = items.filter((i) =>
      i.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Always filter by selected region
  items = items.filter((i) => i.region === region);

  if (status !== "all") {
    items = items.filter((i) => String(i.status) === status);
  }

  switch (sort) {
    case "cost":
      items.sort((a, b) => a.cost - b.cost);
      break;

    case "status":
      items.sort((a, b) => a.status - b.status);
      break;

    default:
      items.sort((a, b) => a.title.localeCompare(b.title));
  }

  return items;
}, [data, search, region, status, sort]);
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-zinc-400">
        Loading ROG Rewards...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-red-400">
        Failed to load ROG Rewards.
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

        <section className="mb-10 rounded-[32px] border border-red-500/10 bg-gradient-to-br from-red-500/[0.10] via-white/[0.03] to-transparent p-7">

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
                ASUS ROG Elite
              </p>

              <h1 className="text-5xl font-bold">
                ROG Rewards
              </h1>

            </div>

          </div>

          <p className="max-w-2xl text-sm text-zinc-400">
            Live ASUS ROG Elite rewards synchronized across every supported region.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/[0.04] hover:-translate-y-1">

              <div className="text-2xl font-bold">
                🌍 {regions}
              </div>

              <div className="text-sm text-zinc-500">
                Regions
              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/[0.04] hover:-translate-y-1">

              <div className="text-2xl font-bold">
                🎁 {data.count}
              </div>

              <div className="text-sm text-zinc-500">
                Total Rewards
              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/[0.04] hover:-translate-y-1">

              <div className="text-2xl font-bold text-green-400">
                🟢 {available}
              </div>

              <div className="text-sm text-zinc-500">
                Available
              </div>

            </div>

          </div>

        </section>

        {/* Filters */}
        
  <div className="mb-8 grid gap-4 lg:grid-cols-[0.9fr_1fr_1fr_1fr]">

       <div className="relative">
  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

  <Input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search rewards..."
    className="h-12 rounded-2xl border-white/10 bg-[#121212] pl-10 focus-visible:ring-red-500/30"
  />
</div>

          <Select
  value={region}
  onValueChange={setRegion}
>
  <SelectTrigger className="h-12 w-full rounded-2xl border border-white/10 bg-[#121212] px-4">
    <SelectValue />
  </SelectTrigger>

  <SelectContent>

    {regionOptions.map((r) => (
      <SelectItem
        key={r}
        value={r}
      >
        {REGION_FLAGS[r]} {REGION_NAMES[r]}
      </SelectItem>
    ))}

  </SelectContent>
</Select>

          <Select value={status} onValueChange={setStatus}>
           <SelectTrigger className="h-12 w-full rounded-2xl border border-white/10 bg-[#121212] px-4">
            <SelectValue />
           </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="1">Available</SelectItem>
            <SelectItem value="2">Locked</SelectItem>
            <SelectItem value="3">Sold Out</SelectItem>
            <SelectItem value="4">Ended</SelectItem>
          </SelectContent>
     </Select>
            
          <Select value={sort} onValueChange={setSort}>
  <SelectTrigger className="h-12 w-full rounded-2xl border border-white/10 bg-[#121212] px-4">
    <SelectValue />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="title">Sort by Name</SelectItem>
    <SelectItem value="cost">Sort by Cost</SelectItem>
    <SelectItem value="status">Sort by Status</SelectItem>
  </SelectContent>
</Select>

        </div>
                <section className="mb-14">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-red-400">
                ASUS ROG Elite
              </p>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />

                <p className="text-[13px] font-black uppercase tracking-wider text-white">
                  Rewards
                </p>

                <span className="ml-2 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[11px] text-zinc-400">
                  {rewards.length} shown
                </span>

              </div>

            </div>

          </div>

          {rewards.length === 0 ? (

            <div className="rounded-3xl border border-white/10 bg-[#121212] p-12 text-center">

              <div className="text-6xl">
                😢
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                No rewards found
              </h2>

              <p className="mt-2 text-zinc-500">
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {rewards.map((reward) => {

                const badge =
                  STATUS[
                    reward.status as keyof typeof STATUS
                  ] ??
                  {
                    text: "Unknown",
                    color:
                      "border-zinc-700 bg-zinc-800 text-zinc-400",
                    icon: "❔",
                  };

                return (

                  <article
                    key={reward.id}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_0_35px_rgba(239,68,68,.12)]"
                  >

                    <div className="relative h-52 overflow-hidden">

                      {reward.image ? (

                        <Image
                          src={reward.image}
                          alt={reward.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center bg-zinc-900">

                          <Image
                            src="/rog.png"
                            alt="ROG"
                            width={80}
                            height={80}
                            className="opacity-20"
                          />

                        </div>

                      )}

                      <div className="absolute left-4 top-4">

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold backdrop-blur ${badge.color}`}
                        >
                          {badge.icon} {badge.text}
                        </span>

                      </div>

                      <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-bold backdrop-blur">

                       {REGION_FLAGS[reward.region] ?? "🌍"}{" "}
                       {REGION_NAMES[reward.region] ?? reward.region.toUpperCase()}             
            
                       

                      </div>

                    </div>

                    <div className="flex flex-col p-5">

                      <div className="min-h-[76px]">

                        <h2 className="line-clamp-2 text-lg font-bold text-white">

                          {reward.title}

                        </h2>

                      </div>

                      <div className="mt-6 rounded-2xl border border-red-500/10 bg-red-500/[0.05] px-5 py-4">

                        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">

                          Cost

                        </div>

                       <div className="mt-2 flex items-center gap-2 text-3xl font-black text-red-400">
                         <span>💎</span>
                         <span>{reward.cost}</span>
                       </div>
 
                      </div>

                      <a
  href="https://rog.asus.com/elite/reward/all"
  target="_blank"
  rel="noreferrer"
  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 text-sm font-black text-white transition hover:bg-red-400"
>
  Redeem
  <ArrowUpRight className="h-4 w-4" />
</a>

                    </div>

                  </article>

                );

              })}

            </div>

          )}

        </section>

      </div>

    </main>

  );

}
