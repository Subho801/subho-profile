import { NextResponse } from "next/server";

export const revalidate = 300;

const DATA_URL =
  "https://raw.githubusercontent.com/Subho801/awa-live-data/main/website/awa.json";

export async function GET() {
  try {
    const res = await fetch(DATA_URL, {
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Alienware data");
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        count: 0,
        items: [],
      },
      { status: 500 }
    );
  }
}
