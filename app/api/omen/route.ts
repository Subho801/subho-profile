import { NextResponse } from "next/server";

export const revalidate = 300;

const DATA_URL =
  "https://raw.githubusercontent.com/Subho801/omen-giveaway-notifier/main/omen.json";

export async function GET() {
  try {
    const res = await fetch(DATA_URL, {
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch OMEN data");
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        updated: Date.now(),
        count: 0,
        items: [],
      },
      { status: 500 }
    );
  }
}
