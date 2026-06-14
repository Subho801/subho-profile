export async function GET() {
  const res = await fetch("https://steamdb.info/upcoming/free/", {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "text/html",
    },
    cache: "no-store",
  });

  const html = await res.text();

  return Response.json({
    status: res.status,
    length: html.length,
    hasFreeToKeep: html.includes("Free to Keep"),
    hasCloudflare: html.toLowerCase().includes("cloudflare"),
    preview: html.slice(0, 1000),
  });
}