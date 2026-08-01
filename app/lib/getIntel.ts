export async function getIntel() {
  const res = await fetch(
    "https://raw.githubusercontent.com/Subho801/intel-giveaway-notifier/main/intel.json",
    {
      next: {
        revalidate: 300,
      },
    }
  );

  return res.json();
}
