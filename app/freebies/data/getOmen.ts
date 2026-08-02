export type OmenGiveaway = {
  codename: string;
  game: string;
  title: string;
  description: string;
  button: string;
  image: string;
  expire: number;
};

export type OmenResponse = {
  updated: number;
  count: number;
  items: OmenGiveaway[];
};

export async function getOmen(): Promise<OmenResponse> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/omen`, {
    next: {
      revalidate: 300,
    },
  });

  if (!res.ok) {
    return {
      updated: Date.now(),
      count: 0,
      items: [],
    };
  }

  return res.json();
}
