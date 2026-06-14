export async function GET() {
  try {
    const res = await fetch(
      "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=IN&allowCountries=IN",
      { cache: "no-store" }
    );

    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json(
      { error: "Failed to fetch Epic freebies" },
      { status: 500 }
    );
  }
}