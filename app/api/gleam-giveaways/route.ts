export async function GET() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/Subho801/gleam-giveaway-tracker/main/data/gleam-giveaways.json",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`GitHub returned ${res.status}`);
    }

    const data = await res.json();

    return Response.json(data);
  } catch (err: any) {
    return Response.json({
      updatedAt: null,
      count: 0,
      items: [],
      error: err.message,
    });
  }
}