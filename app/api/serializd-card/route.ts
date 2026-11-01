import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) return "";
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch {
    return "";
  }
}

export async function GET() {
  try {
    const res = await fetch("https://subho.site/api/serializd", {
      cache: "no-store",
    });

    if (!res.ok) {
      return new NextResponse("Failed to fetch Serializd data", { status: 500 });
    }

    const data = await res.json();
    const shows = data.shows || [];

    // Convert each TMDB TV poster to base64 for GitHub SVG compatibility
    const showsWithBase64 = await Promise.all(
      shows.slice(0, 5).map(async (s: any) => ({
        ...s,
        posterBase64: s.poster ? await fetchImageAsBase64(s.poster) : "",
      }))
    );

    const postersSvg = showsWithBase64
      .map(
        (s: any, i: number) => `
        <g transform="translate(${i * 105 + 10}, 10)">
          <rect width="95" height="142" rx="8" fill="#1f2937" />
          ${
            s.posterBase64
              ? `<image href="${s.posterBase64}" width="95" height="142" preserveAspectRatio="xMidYMid slice" clip-path="inset(0% round 8px)" />`
              : ""
          }
        </g>
      `
      )
      .join("");

    // Calculate dynamic width based on number of shows (e.g. 2 shows or up to 5)
    const count = Math.max(showsWithBase64.length, 1);
    const cardWidth = count * 105 + 15;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="162" viewBox="0 0 ${cardWidth} 162" fill="none">
        <rect width="${cardWidth}" height="162" rx="14" fill="#0d1117" stroke="#1f2937" stroke-width="1"/>
        ${postersSvg}
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
