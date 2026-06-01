import { NextResponse } from "next/server";

const LETTERBOXD_USERNAME = process.env.LETTERBOXD_USERNAME;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

function decodeHtml(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function titleFromSlug(link: string) {
  const match = link.match(/\/film\/([^/]+)\//);
  if (!match) return "";

  return match[1]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanTitle(rawTitle: string, link: string) {
  let title = rawTitle
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/ - ★.*$/g, "")
    .replace(/,\s*\d{4}$/g, "")
    .trim();

  title = decodeHtml(title);

  if (!title) title = titleFromSlug(link);

  return title;
}

function extractLetterboxdItems(xml: string) {
  const matches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  return matches.slice(0, 5).map((item) => {
    const rawTitle =
      item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
      item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ||
      "";

    const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
    const title = cleanTitle(rawTitle, link);

    return {
      type: "movie",
      title,
      link,
    };
  });
}

async function getTmdbPoster(title: string) {
  if (!TMDB_API_KEY || !title) return null;

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
    title
  )}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();

  const movie = data?.results?.[0];
  if (!movie?.poster_path) return null;

  return `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
}

export async function GET() {
  if (!LETTERBOXD_USERNAME) {
    return NextResponse.json(
      { error: "Missing LETTERBOXD_USERNAME" },
      { status: 500 }
    );
  }

  const rssUrl = `https://letterboxd.com/${LETTERBOXD_USERNAME}/rss/`;

  const rss = await fetch(rssUrl, {
    next: { revalidate: 1800 },
  });

  const xml = await rss.text();
  const items = extractLetterboxdItems(xml);

  const movies = await Promise.all(
    items.map(async (movie) => ({
      ...movie,
      poster: await getTmdbPoster(movie.title),
    }))
  );

  return NextResponse.json({ movies });
}