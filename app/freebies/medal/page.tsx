"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSteam } from "react-icons/fa";
import { Award } from "lucide-react";

function cleanText(text?: string) {
  if (!text) return "";
  return text.replace(/^Quest:\s*/i, "").replace(/<[^>]*>/g, "").trim();
}

function formatDate(ms?: number) {
  if (!ms) return "Unknown";

  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isActiveQuest(quest: any) {
  const endsAt = quest.config?.endsAt;
  if (!endsAt) return true;
  return Number(endsAt) > Date.now();
}

function isGameKeyGiveaway(quest: any) {
  const config = quest.config || {};
  const title = config.messages?.name || "";
  const reward = config.reward || {};
  const rewardName = reward.messages?.name || "";
  const rewardDesc = reward.messages?.description || "";
  const rewardLink = reward.rewardLink || "";
  const actionLink = reward.actionLink || "";

  const text = `${title} ${rewardName} ${rewardDesc} ${rewardLink} ${actionLink}`.toLowerCase();

  const hasKey = title.toLowerCase().includes("key");
  const isSteam =
    text.includes("steam") ||
    text.includes("steampowered.com") ||
    reward.actionType === "CODE";

  const blockedWords = [
    "robux",
    "premium",
    "profile background",
    "background",
    "skin",
    "gun skin",
    "gift card",
    "speed",
    "keyboard",
    "mouse",
    "trial",
    "avatar",
    "cosmetic",
  ];

  return hasKey && isSteam && !blockedWords.some((word) => text.includes(word));
}

function SectionHeader({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count?: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-lime-400">
        {eyebrow}
      </p>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400 shadow-[0_0_10px_#a3e635]" />

        <p className="text-[13px] font-black uppercase tracking-wider text-white">
          {title}
        </p>

        {count && (
          <span className="ml-2 rounded-full border border-lime-400/15 bg-lime-400/[0.06] px-2 py-0.5 text-[11px] text-zinc-400">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

export default function MedalFreebiesPage() {
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/medal-quests")
      .then((r) => r.json())
      .then((data) => {
        const filtered = (data.items || [])
          .filter(isActiveQuest)
          .filter(isGameKeyGiveaway)
          .sort((a: any, b: any) => {
            return (a.config?.endsAt || 0) - (b.config?.endsAt || 0);
          });

        setQuests(filtered);
        setLoading(false);
      })
      .catch(() => {
        setQuests([]);
        setLoading(false);
      });
  }, []);

  const endingSoon = useMemo(() => {
    const now = Date.now();
    const twoDays = 1000 * 60 * 60 * 48;

    return quests.filter((quest) => {
      const endsAt = quest.config?.endsAt;
      return endsAt && Number(endsAt) - now <= twoDays;
    }).length;
  }, [quests]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <section className="mb-12 rounded-[32px] border border-lime-400/10 bg-gradient-to-br from-lime-400/[0.10] via-white/[0.03] to-transparent p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 ring-1 ring-lime-400/20">
              <Award className="h-7 w-7 text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-400">
                Medal TV
              </p>
              <h1 className="text-5xl font-bold">Medal TV Key Giveaways</h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm text-zinc-400">
            Live Medal TV quests filtered for real Steam/game key rewards using your automatic quest API.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">{quests.length}</div>
              <div className="text-sm text-white/45">Active Key Quests</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">{endingSoon}</div>
              <div className="text-sm text-white/45">Ending Soon</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">Steam</div>
              <div className="text-sm text-white/45">Reward Platform</div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-zinc-500">Loading Medal quests...</div>
        ) : (
          <section className="mb-14">
            <SectionHeader
              eyebrow="Live Right Now"
              title="Medal TV Key Giveaways"
              count={`${quests.length} key giveaways`}
            />

            {quests.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                No active Medal TV key giveaways right now.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {quests.map((quest) => {
                  const config = quest.config || {};
                  const reward = config.reward || {};
                  const rewardMsg = reward.messages || {};

                  const title = config.messages?.name || "Unknown Quest";
                  const questText = cleanText(config.messages?.detailedDescription);
                  const banner = config.assets?.banner;
                  const rewardIcon = reward.assets?.icon;
                  const questLink = `https://medal.tv/quests?questId=${quest.id}`;
                  const steamLink =
                    reward.rewardLink ||
                    reward.actionLink ||
                    questLink;

                  return (
                    <article
                      key={quest.id}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/30 hover:shadow-[0_0_35px_rgba(163,230,53,0.08)]"
                    >
                      {banner && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={banner}
                            alt={title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          <div className="absolute left-4 top-4 rounded-xl bg-black/40 p-2 backdrop-blur">
                            <FaSteam className="h-6 w-6 text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                          </div>
                        </div>
                      )}

                      <div className="flex h-[340px] flex-col p-5">
                        <div className="mb-3 flex items-start gap-3">
                          {rewardIcon && (
                            <Image
                              src={rewardIcon}
                              alt=""
                              width={42}
                              height={42}
                              unoptimized
                              className="rounded-lg border border-white/10"
                            />
                          )}

                          <div className="min-h-[58px]">
                            <h2 className="line-clamp-2 text-lg font-bold leading-tight text-white">
                              {title}
                            </h2>

                            <p className="mt-1 text-xs text-zinc-500">
                              Ends {formatDate(config.endsAt)}
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 line-clamp-2 min-h-[48px] text-sm text-zinc-400">
                          {questText}
                        </p>

                        <a
                          href={steamLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 block min-h-[84px] rounded-2xl border border-lime-400/10 bg-lime-400/[0.04] p-3 transition-all duration-300 hover:border-lime-400/30 hover:bg-lime-400/[0.08]"
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <div className="text-[10px] font-bold uppercase tracking-wide text-lime-400">
                              Reward
                            </div>

                            <span className="text-[10px] text-lime-400">
                              Open ↗
                            </span>
                          </div>

                          <div className="font-semibold text-white">
                            {rewardMsg.name || "Unknown Reward"}
                          </div>

                          <div className="text-sm text-zinc-400">
                            {rewardMsg.description || "Redeem and play on Steam"}
                          </div>
                        </a>

                        <a
                          href={questLink}
                          className="mt-auto inline-flex w-fit items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:bg-lime-300"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Quest
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}