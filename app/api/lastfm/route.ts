import { NextResponse } from "next/server";
import { Vibrant } from "node-vibrant/node";

const username = "Subho_X";

function getImage(images: any[] = []) {
  return (
    images.find((img) => img.size === "extralarge")?.["#text"] ||
    images.find((img) => img.size === "large")?.["#text"] ||
    images.at(-1)?.["#text"] ||
    ""
  );
}

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;

  const recentUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;
  const userUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`;

  const [recentRes, userRes] = await Promise.all([
    fetch(recentUrl, { cache: "no-store" }),
    fetch(userUrl, { cache: "no-store" }),
  ]);

  const recentData = await recentRes.json();
  const userData = await userRes.json();

  const track = recentData?.recenttracks?.track?.[0];
  const image = getImage(track?.image);

  let accentColor = "#9ca3af";

  try {
    if (image) {
      const palette = await Vibrant.from(image).getPalette();

      accentColor =
        palette.Vibrant?.hex ||
        palette.Muted?.hex ||
        palette.DarkVibrant?.hex ||
        "#9ca3af";
    }
  } catch {
    accentColor = "#9ca3af";
  }

  const textColor = "#ffffff";

  const user = userData?.user;

  return NextResponse.json({
    name: track?.name ?? "Nothing playing",
    artist: track?.artist?.["#text"] ?? "Unknown artist",
    album: track?.album?.["#text"] ?? "",
    image,
    accentColor,
    textColor,
    nowPlaying: track?.["@attr"]?.nowplaying === "true",
    url: track?.url ?? "#",
    dateUts: track?.date?.uts ?? null,

    username: user?.name ?? username,
    realname: user?.realname ?? "",
    avatar: getImage(user?.image),
    playcount: user?.playcount ?? "0",
  });
}