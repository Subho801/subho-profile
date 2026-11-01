import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://subho.site/api/letterboxd", { cache: "no-store" });
  const data = await res.json();
  const movies = data.movies || [];

  const postersSvg = movies.slice(0, 5).map((m: any, i: number) => `
    <g transform="translate(${i * 105 + 10}, 10)">
      <rect width="95" height="142" rx="8" fill="#1f2937" />
      <image href="${m.poster || ''}" width="95" height="142" preserveAspectRatio="xMidYMid slice" clip-path="inset(0% round 8px)" />
    </g>
  `).join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="545" height="162" viewBox="0 0 545 162" fill="none">
      <rect width="545" height="162" rx="14" fill="#0d1117" stroke="#1f2937" stroke-width="1"/>
      ${postersSvg}
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
