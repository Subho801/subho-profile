import Link from "next/link";

const stats = [
  { label: "Active Freebies", value: "17", icon: "🎮" },
  { label: "Keys Available", value: "2.4K", icon: "🔑" },
  { label: "Ending Soon", value: "8", icon: "⏳" },
  { label: "Upcoming Leaks", value: "4", icon: "🕵️" },
];

const sections = [
  {
    title: "Free Games",
    icon: "🎮",
    desc: "Official store freebies and 100% off games.",
    items: [
      { name: "Epic Games", desc: "Weekly free games", icon: "🎁", href: "/freebies/epic" },
      { name: "Steam 100% Off", desc: "Limited free-to-keep games", icon: "🧊", href: "/freebies/steam" },
      { name: "GOG", desc: "DRM-free giveaways", icon: "💿", href: "#" },
      { name: "Microsoft Store", desc: "Store freebies", icon: "🪟", href: "#" },
      { name: "Prime Gaming", desc: "Monthly game claims", icon: "👑", href: "#" },
    ],
  },
  {
    title: "Key Giveaways",
    icon: "🔑",
    desc: "Limited keys, rewards and promo drops.",
    items: [
      { name: "Medal TV", desc: "Quest rewards", icon: "🎖️", href: "/freebies/medal" },
      { name: "AMD Rewards", desc: "Promo keys", icon: "🔥", href: "/freebies/amd" },
      { name: "Alienware Arena", desc: "Gaming keys", icon: "👽", href: "#" },
      { name: "ROG Elite", desc: "Regional rewards", icon: "⚡", href: "#" },
      { name: "HP OMEN", desc: "Reward drops", icon: "💎", href: "#" },
      { name: "Intel Gaming Access", desc: "Intel promos", icon: "🔵", href: "#" },
    ],
  },
  {
    title: "Community Giveaways",
    icon: "🎁",
    desc: "Community and third-party giveaways.",
    items: [
      { name: "Zeros Group", desc: "Community drops", icon: "🟣", href: "#" },
      { name: "FreeRU", desc: "Free key posts", icon: "🔴", href: "#" },
      { name: "Gleam Campaigns", desc: "Entry-based giveaways", icon: "✨", href: "#" },
      { name: "Discord Giveaways", desc: "Server giveaways", icon: "💬", href: "#" },
    ],
  },
  {
    title: "Upcoming & Leaks",
    icon: "🕵️",
    desc: "Upcoming, leaked or not-yet-claimable rewards.",
    items: [
      { name: "Epic Mystery Games", desc: "Vault leaks", icon: "🔮", href: "#" },
      { name: "AMD Upcoming", desc: "Future rewards", icon: "🔥", href: "#" },
      { name: "Alienware Upcoming", desc: "Upcoming key drops", icon: "👽", href: "#" },
      { name: "ROG Upcoming", desc: "Future region rewards", icon: "⚡", href: "#" },
    ],
  },
];

const featured = [
  { name: "Epic Games", desc: "2 active freebies", meta: "Ends soon", icon: "🎮" },
  { name: "Medal TV", desc: "Quest reward live", meta: "Claim now", icon: "🎖️" },
  { name: "AMD Rewards", desc: "Promo keys available", meta: "Limited", icon: "🔥" },
];

export default function FreebiesPage() {
  return (
    <main className="min-h-screen px-5 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-white/50 hover:text-white">
          ← Back home
        </Link>

        <section className="mt-8 rounded-[32px] border border-lime-400/10 bg-gradient-to-br from-lime-400/[0.08] via-white/[0.03] to-transparent p-7">
          <p className="text-sm font-medium text-lime-400">Freebies Hub</p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Free games, keys & rewards
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
            Track official store freebies, limited key giveaways, community drops
            and upcoming leaks in one clean dashboard.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <div className="text-2xl">{stat.icon}</div>
                <div className="mt-2 text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/45">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">🔥 Claim Before It Ends</h2>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/50">
              Featured
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {featured.map((item) => (
              <div
                key={item.name}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-lime-400/30 hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/30 text-2xl">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold group-hover:text-lime-300">
                      {item.name}
                    </h3>
                    <p className="text-sm text-white/45">{item.desc}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-center text-xs text-lime-300">
                  {item.meta}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/30 text-xl">
                  {section.icon}
                </div>

                <div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                  <p className="mt-1 text-sm text-white/45">{section.desc}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-lime-400/25 hover:bg-black/35"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-xl">
                        {item.icon}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold group-hover:text-lime-300">
                          {item.name}
                        </h3>
                        <p className="truncate text-xs text-white/40">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}