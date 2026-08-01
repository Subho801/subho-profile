export async function getRog() {
  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/Subho801/rog-rewards-notifier@main/website/rog.json",
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) return null;

  return res.json();
}
