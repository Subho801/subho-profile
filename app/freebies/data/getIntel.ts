export async function getIntel() {
  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/Subho801/intel-giveaway-notifier@main/intel.json",
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) return null;

  return res.json();
}
