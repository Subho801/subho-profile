export const revalidate = 60;

export async function GET() {
  try {
    const response = await fetch(
      "https://keyxp-api.subho.site/api/keyxp",
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "KeyXP data is temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return Response.json(
      { error: "Unable to connect to the KeyXP feed" },
      { status: 502 }
    );
  }
}