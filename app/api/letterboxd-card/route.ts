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
    const res = await fetch("https://subho.site/api/letterboxd", {
      cache: "no-store",
    });

    if (!res.ok) {
      return new NextResponse("Failed to fetch Letterboxd data", { status: 500 });
    }

    const data = await res.json();
    const movies = data.movies || [];

    // Convert each TMDB poster to base64 so GitHub can render them
    const moviesWithBase64 = await Promise.all(
      movies.slice(0, 5).map(async (m: any) => ({
        ...m,
        posterBase64: m.poster ? await fetchImageAsBase64(m.poster) : "",
      }))
    );

    const postersSvg = moviesWithBase64
      .map(
        (m: any, i: number) => `
        <g transform="translate(${i * 105 + 10}, 10)">
          <rect width="95" height="142" rx="8" fill="#1f2937" />
          ${
            m.posterBase64
              ? `<image href="${m.posterBase64}" width="95" height="142" preserveAspectRatio="xMidYMid slice" clip-path="inset(0% round 8px)" />`
              : ""
          }
        </g>
      `
      )
      .join("");

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="545" height="162" viewBox="0 0 545 162" fill="none">
        <rect width="545" height="162" rx="14" fill="#0d1117" stroke="#1f2937" stroke-width="1"/>
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
