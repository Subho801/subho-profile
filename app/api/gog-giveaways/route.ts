export async function GET() {
  try {
    const res = await fetch("https://www.gog.com/giveaway/claim", {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const data = await res.json().catch(() => null);

    const message = String(data?.message || "").toLowerCase();

    if (!data || message.includes("ended") || message.includes("not found")) {
      return Response.json({
        source: "gog",
        count: 0,
        items: [],
        message: "No limited-time GOG giveaway right now.",
      });
    }

    if (!data?.title && !data?.game && !data?.product) {
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
          title:
            data?.title ||
            data?.game?.title ||
            data?.product?.title ||
            "GOG Limited-Time Giveaway",
          platform: "GOG",
          status: "active",
          url: "https://www.gog.com/giveaway/claim",
          image:
            data?.image ||
            data?.game?.image ||
            data?.product?.image ||
            "",
        },
      ],
    });
  } catch {
    return Response.json({
      source: "gog",
      count: 0,
      items: [],
      message: "No limited-time GOG giveaway right now.",
    });
  }
}