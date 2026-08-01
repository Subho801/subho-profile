export async function GET() {
  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/Subho801/rog-rewards-data@main/website/rog.json",
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) {
    return Response.json(
      { error: "Failed to fetch ROG data" },
      { status: 500 }
    );
  }

  const data = await res.json();

  return Response.json(data);
}
