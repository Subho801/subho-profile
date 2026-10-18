import Link from "next/link";

type ItchGame = {
  id: string | number | null;
  title: string;
  url: string;
  image: string | null;
  author?: string | null;
  genre?: string | null;
  blurb?: string | null;
  expires?: string | null;
  expires_raw?: string | null;
};

type ItchFeed = {
  source?: string;
  scraped_at?: string;
  total_found?: number;
  games?: ItchGame[];
};

const FEED_URL =
  "https://raw.githubusercontent.com/Subho801/itchio-freebie-notifier/main/result.json";

async function getGames(): Promise<{
  games: ItchGame[];
  updatedAt: string | null;
}> {
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      throw new Error(`Feed returned HTTP ${response.status}`);
    }

    const data: ItchFeed = await response.json();
    const now = Date.now();

    const games = (data.games ?? [])
      .filter((game) => {
        if (!game.title?.trim() || !game.url?.trim()) return false;

        // Keep offers with unknown expiry; hide known expired offers.
        if (!game.expires) return true;

        const expiry = new Date(game.expires).getTime();
        return !Number.isFinite(expiry) || expiry > now;
      })
      .sort((a, b) => {
        const aExpiry = a.expires
          ? new Date(a.expires).getTime()
          : Number.POSITIVE_INFINITY;

        const bExpiry = b.expires
          ? new Date(b.expires).getTime()
          : Number.POSITIVE_INFINITY;

        return aExpiry - bExpiry;
      });

    return {
      games,
      updatedAt: data.scraped_at ?? null,
    };
  } catch (error) {
    console.error("Failed to load itch.io feed:", error);

    return {
      games: [],
      updatedAt: null,
    };
  }
}

function formatDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

function formatExpiry(value?: string | null) {
  const formatted = formatDate(value);
  return formatted ? `Ends ${formatted}` : "Expiry date unavailable";
}

export default async function ItchGiveawaysPage() {
  const { games, updatedAt } = await getGames();

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12">
        <Link
          href="/freebies"
          className="inline-flex text-sm text-zinc-500 transition-colors duration-300 hover:text-lime-300"
        >
          ← Back to Freebies Hub
        </Link>

        {/* Lime-green itch.io hero */}
        <section className="group relative mb-8 mt-7 overflow-hidden rounded-[28px] border border-lime-400/20 bg-gradient-to-br from-lime-400/[0.10] via-white/[0.035] to-transparent p-6 shadow-[0_0_25px_rgba(163,230,53,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-lime-400/40 hover:shadow-[0_0_35px_rgba(163,230,53,0.12)] sm:mb-10 sm:rounded-[32px] sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-lime-400/[0.06] blur-3xl transition-all duration-500 group-hover:bg-lime-400/[0.12]" />

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-lime-400/20 bg-black/30 shadow-[0_0_18px_rgba(163,230,53,0.08)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.18)] sm:h-14 sm:w-14">
                <img
                  src="/itchio.png"
                  alt="itch.io"
                  className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-300">
                  itch.io Freebies
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
                  Limited-Time Free Games
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Discover itch.io games currently listed at 100% off.
              Offers with known expiry dates appear first when they are
              closest to ending.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-lime-400/25 bg-lime-400/10 px-3 py-1.5 text-xs font-semibold text-lime-300">
                {games.length} available offers
              </span>

              {updatedAt && (
                <span className="text-xs text-white/40">
                  Scraper updated: {formatDate(updatedAt)}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Spacious empty state */}
        {games.length === 0 ? (
          <section className="group flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-lime-400/15 bg-gradient-to-b from-lime-400/[0.045] to-transparent px-6 py-12 text-center transition-all duration-300 hover:border-lime-400/30 hover:shadow-[0_0_30px_rgba(163,230,53,0.08)] sm:min-h-[380px] sm:rounded-3xl sm:px-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-lime-400/20 bg-black/25 shadow-[0_0_24px_rgba(163,230,53,0.08)]">
              <img
                src="/itchio.png"
                alt="itch.io"
                className="h-12 w-12 object-contain"
              />
            </div>

            <h2 className="mt-6 text-xl font-bold sm:text-2xl">
              No active giveaways right now
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
              There are no active itch.io offers to display at the moment.
              Check back after the next scraper update, or browse itch.io
              directly.
            </p>

            <a
              href="https://itch.io/games/newest/on-sale"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl border border-lime-300/30 bg-lime-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_18px_rgba(163,230,53,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-300 hover:shadow-[0_0_25px_rgba(163,230,53,0.28)]"
            >
              Browse itch.io
            </a>
          </section>
        ) : (
          /* Three columns on desktop, responsive on smaller screens */
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {games.map((game, index) => (
              <article
                key={String(game.id ?? game.url)}
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-lime-400/35 hover:shadow-[0_12px_35px_rgba(0,0,0,0.30),0_0_28px_rgba(163,230,53,0.10)]"
              >
                {/* Consistent artwork ratio */}
                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[#1a1a1a]">
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.title}
                      loading={index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <img
                        src="/itchio.png"
                        alt="itch.io"
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full border border-lime-300/30 bg-black/85 px-3 py-1 text-xs font-bold text-lime-300 shadow-[0_0_12px_rgba(163,230,53,0.08)]">
                    100% OFF
                  </span>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-80" />
                </div>

                {/* Compact card content */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h2 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 text-white transition-colors duration-300 group-hover:text-lime-300">
                    {game.title}
                  </h2>

                  <div className="mt-1 min-h-5">
                    {game.author ? (
                      <p className="truncate text-sm text-zinc-500">
                        by {game.author}
                      </p>
                    ) : (
                      <span className="invisible text-sm">No author</span>
                    )}
                  </div>

                  {/* Actual genre; no fake placeholder */}
                  <div className="mt-3 min-h-[30px]">
                    {game.genre?.trim() && (
                      <span className="inline-flex max-w-full items-center gap-2 truncate rounded-full border border-lime-400/20 bg-lime-400/[0.06] px-3 py-1.5 text-xs text-zinc-300 transition-all duration-300 group-hover:border-lime-400/35 group-hover:bg-lime-400/[0.10]">
                        <span aria-hidden="true">🎮</span>
                        <span className="truncate">{game.genre}</span>
                      </span>
                    )}
                  </div>

                  {/* Expiry information */}
                  <div className="mt-4 min-h-10 text-xs leading-5 text-amber-300/90">
                    <span className="mr-1">⏳</span>
                    {formatExpiry(game.expires)}
                  </div>

                  {/* Claim button: lime green, no arrow */}
                  <div className="mt-auto border-t border-white/[0.06] pt-4">
                    <a
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-400 px-6 py-3 text-sm font-bold text-black shadow-[0_0_12px_rgba(163,230,53,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-lime-200 hover:bg-lime-300 hover:shadow-[0_0_24px_rgba(163,230,53,0.25)] active:translate-y-0"
                    >
                      Claim
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 text-center text-xs leading-5 text-white/30">
          Data provided by the Subho itch.io Freebie Notifier.
          Always confirm the offer on itch.io before claiming.
        </p>
      </div>
    </main>
  );
}