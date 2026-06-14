export async function GET() {
  try {
    const res = await fetch(
      "https://medal.tv/api/v2/quests?limit=50&state=active",
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch quests" },
      { status: 500 }
    );
  }
}