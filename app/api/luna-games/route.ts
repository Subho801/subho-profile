export async function GET() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/Subho801/luna-gaming-tracker/main/data/luna-games.json",
      { cache: "no-store" }
    );

    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({
      updatedAt: null,
      count: 0,
      items: [],
      error: "Failed to fetch Luna games JSON",
    });
  }
}