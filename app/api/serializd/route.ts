import { NextResponse } from "next/server";

const AUTH = process.env.SERIALIZD_AUTHORIZATION;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function getTvPoster(title: string) {
  if (!TMDB_API_KEY || !title) return null;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const tv = data?.results?.[0];

  if (!tv?.poster_path) return null;

  return `https://image.tmdb.org/t/p/w342${tv.poster_path}`;
}

async function getShowDetails(showId: number) {
  const res = await fetch(`https://serializd.onrender.com/api/show/${showId}`, {
    headers: {
      accept: "application/json, text/plain, */*",
      authorization: AUTH!.trim(),
      "x-requested-with": "serializd_vercel",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function GET() {
  if (!AUTH) {
    return NextResponse.json(
      { error: "Missing SERIALIZD_AUTHORIZATION" },
      { status: 500 }
    );
  }

  const res = await fetch(
    "https://serializd.onrender.com/api/user_information?shouldGetUserContext=true",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: AUTH.trim(),
        "x-requested-with": "serializd_vercel",
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  const current = data?.context?.currentlyWatching || [];

  const shows = await Promise.all(
    current.slice(0, 5).map(async (item: any) => {
      const id = Number(item.showId);
      const details = await getShowDetails(id);
      const show = details?.show || details;

      const title = show?.showName || show?.name || show?.title || `Show ${id}`;

      return {
        type: "show",
        title,
        link: `https://www.serializd.com/show/${id}`,
        poster: await getTvPoster(title),
      };
    })
  );

  return NextResponse.json({ shows });
}