export async function GET() {
  try {
    const claimRes = await fetch("https://www.gog.com/giveaway/claim", {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const claimData = await claimRes.json().catch(() => null);

    if (
      claimData?.message?.toLowerCase().includes("giveaway has ended") ||
      claimData?.message?.toLowerCase().includes("ended")
    ) {
      return Response.json({
        source: "gog",
        count: 0,
        items: [],
        message: "No limited-time GOG giveaway right now.",
      });
    }

    return Response.json({
      source: "gog",
      count: 1,
      items: [
        {
          title: claimData?.title || "GOG Limited-Time Giveaway",
          platform: "GOG",
          status: "active",
          url: "https://www.gog.com/giveaway/claim",
          image: claimData?.image || "",
          note: "Live giveaway detected from GOG claim endpoint.",
        },
      ],
    });
  } catch {
    return Response.json(
      {
        error: "Failed to check GOG giveaway",
        items: [],
      },
      { status: 500 }
    );
  }
}