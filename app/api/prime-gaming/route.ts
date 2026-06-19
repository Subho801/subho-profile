export async function GET() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/Subho801/prime-gaming-tracker/main/data/prime-gaming.json",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch Prime Gaming JSON");
    }

    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({
      updatedAt: null,
      count: 0,
      items: [],
      error: "Failed to fetch Prime Gaming JSON",
    });
  }
}