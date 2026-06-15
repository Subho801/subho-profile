import { NextResponse } from "next/server";
import { Vibrant } from "node-vibrant/node";

const username = "Subho_X";

function getImage(images: any[] = []) {
  const img =
    images.find((img) => img.size === "extralarge")?.["#text"] ||
    images.find((img) => img.size === "large")?.["#text"] ||
    images.at(-1)?.["#text"] ||
    "";

  if (!img) return "";

  // Last.fm placeholder image
  if (img.includes("2a96cbd8b46e442fc41c2b86b821562f")) {
    return "";
  }

  return img;
}

export async function GET() {
  try {
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
    const user = userData?.user;

    let image = getImage(track?.image);

    // iTunes fallback if Last.fm has no artwork
    if (!image && track?.name && track?.artist?.["#text"]) {
      try {
        const query = encodeURIComponent(
          `${track.name} ${track.artist["#text"]}`
        );

        const itunesRes = await fetch(
          `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`,
          { cache: "no-store" }
        );

        const itunesData = await itunesRes.json();

        image =
          itunesData?.results?.[0]?.artworkUrl100?.replace(
            "100x100bb.jpg",
            "1200x1200bb.jpg"
          ) || "";
      } catch (error) {
        console.error("iTunes fallback failed:", error);
      }
    }

    let accentColor = "#9ca3af";

    try {
      if (image) {
        const palette = await Vibrant.from(image).getPalette();

        accentColor =
          palette.Vibrant?.hex ||
          palette.DarkVibrant?.hex ||
          palette.LightVibrant?.hex ||
          palette.Muted?.hex ||
          "#9ca3af";
      }
    } catch (error) {
      console.error("Color extraction failed:", error);
      accentColor = "#9ca3af";
    }

    return NextResponse.json({
      name: track?.name ?? "Nothing playing",
      artist: track?.artist?.["#text"] ?? "Unknown artist",
      album: track?.album?.["#text"] ?? "",
      image,

      accentColor,
      textColor: "#ffffff",

      nowPlaying: track?.["@attr"]?.nowplaying === "true",
      url: track?.url ?? "#",
      dateUts: track?.date?.uts ?? null,

      username: user?.name ?? username,
      realname: user?.realname ?? "",
      avatar: getImage(user?.image),
      playcount: user?.playcount ?? "0",
    });
  } catch (error) {
    console.error("Last.fm API error:", error);

    return NextResponse.json({
      name: "Nothing playing",
      artist: "Unknown artist",
      album: "",
      image: "",

      accentColor: "#9ca3af",
      textColor: "#ffffff",

      nowPlaying: false,
      url: "#",
      dateUts: null,

      username,
      realname: "",
      avatar: "",
      playcount: "0",
    });
  }
}