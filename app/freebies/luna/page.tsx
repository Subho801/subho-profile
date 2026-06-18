"use client";

import { useEffect, useState } from "react";

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

  return (
    <main className="min-h-screen bg-[#0d0718] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            🌙 Amazon Luna Free Games
          </h1>

          <p className="text-zinc-400">
            Current Luna / Prime Gaming claimable titles
          </p>

          {data && (
            <div className="mt-4 text-sm text-zinc-500">
              {data.count} games • Updated{" "}
              {new Date(data.updatedAt).toLocaleString()}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-20 text-zinc-400">
            Loading Luna games...
          </div>
        )}

        {!loading && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.items.map((game) => (
              <div
                key={game.title}
                className="bg-[#171028] rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition"
              >
                <div className="aspect-[16/9] bg-[#120b20]">
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="font-semibold text-lg line-clamp-2 mb-3">
                    {game.title}
                  </h2>

                  <div className="flex items-center justify-between">
                    <span className="text-green-400 text-sm">
                      Claimable
                    </span>

                    <a
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm"
                    >
                      Claim
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}