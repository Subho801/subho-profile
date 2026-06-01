import { NextResponse } from "next/server";

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID64 = process.env.STEAM_ID64;
const SGDB_KEY = process.env.STEAMGRIDDB_API_KEY;

async function getSteamGrid(appid: number) {
  if (!SGDB_KEY) return null;

  try {
    const res = await fetch(
      `https://www.steamgriddb.com/api/v2/grids/steam/${appid}?dimensions=600x900`,
      {
        headers: {
          Authorization: `Bearer ${SGDB_KEY}`,
        },
        next: { revalidate: 86400 },
      }
    );

    const data = await res.json();
    return data?.data?.[0]?.url || null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!STEAM_API_KEY || !STEAM_ID64) {
    return NextResponse.json(
      { error: "Missing STEAM_API_KEY or STEAM_ID64" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID64}&count=10`,
    { next: { revalidate: 1800 } }
  );

  const data = await res.json();
  const games = data?.response?.games || [];

  const mapped = await Promise.all(
    games.slice(0, 10).map(async (game: any) => {
      const grid = await getSteamGrid(game.appid);

      return {
        title: game.name,
        appid: game.appid,
        hours: Math.round((game.playtime_forever || 0) / 60),
        image:
          grid ||
          `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900_2x.jpg`,
        link: `https://store.steampowered.com/app/${game.appid}`,
      };
    })
  );

  return NextResponse.json({ games: mapped });
}