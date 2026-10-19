export async function GET() {
  const fetchQuests = async (state: "active" | "ended") => {
    const url = `https://medal.tv/api/v2/quests?limit=100&state=${state}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(
        `Medal ${state} quests failed: HTTP ${response.status}: ${details.slice(0, 300)}`
      );
    }

    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  };

  const [activeResult, endedResult] = await Promise.allSettled([
    fetchQuests("active"),
    fetchQuests("ended"),
  ]);

  const active =
    activeResult.status === "fulfilled" ? activeResult.value : [];
  const expired =
    endedResult.status === "fulfilled" ? endedResult.value : [];

  if (activeResult.status === "rejected") {
    console.error("Medal active quests API error:", activeResult.reason);

    return Response.json(
      {
        error: "Failed to fetch active Medal quests",
        details:
          activeResult.reason instanceof Error
            ? activeResult.reason.message
            : "Unknown error",
      },
      { status: 502 }
    );
  }

  if (endedResult.status === "rejected") {
    console.warn(
      "Medal ended quests unavailable; continuing with active quests:",
      endedResult.reason
    );
  }

  return Response.json({
    active,
    expired,
    warnings:
      endedResult.status === "rejected"
        ? ["Expired quests are temporarily unavailable from Medal."]
        : [],
    counts: {
      active: active.length,
      ended: expired.length,
    },
  });
}
