export async function GET() {
  const fetchQuests = async (state: "active" | "ended") => {
    const url = "https://medal.tv/api/v2/quests?limit=100&state=" + state;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Medal ${state} quests failed: ${JSON.stringify(data)}`
      );
    }

    return Array.isArray(data.items) ? data.items : [];
  };

  try {
    const [active, ended] = await Promise.all([
      fetchQuests("active"),
      fetchQuests("ended"),
    ]);

    return Response.json({
      active,
      expired: ended,
      counts: {
        active: active.length,
        ended: ended.length,
      },
    });
  } catch (error) {
    console.error("Medal quests API error:", error);

    return Response.json(
      {
        error: "Failed to fetch Medal quests",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}