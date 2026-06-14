export async function GET() {
  try {
    const res = await fetch("https://www.amdgaming.com/promotions", {
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
    });

    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json(
      { error: "Failed to fetch AMD promotions" },
      { status: 500 }
    );
  }
}