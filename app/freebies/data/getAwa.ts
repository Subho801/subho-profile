export type AwaGiveaway = {
  id: number;
  title: string;
  raw_title?: string;
  url: string;
  image: string;
  publishedAt: string;
  arp_required: number | null;
  keys_left: number | null;
  source: string;
};

export type AwaResponse = {
  count: number;
  items: AwaGiveaway[];
};

export default async function getAwa(): Promise<AwaResponse> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/awa`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return {
      count: 0,
      items: [],
    };
  }

  return res.json();
}
