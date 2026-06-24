import { NextResponse } from "next/server";

const DATA_URL =
  "https://raw.githubusercontent.com/Subho801/microsoft-store-tracker/main/data/microsoft-store.json";

export async function GET() {
  try {
    const res = await fetch(DATA_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Microsoft Store data");
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        updatedAt: null,
        count: 0,
        items: [],
      },
      { status: 200 }
    );
  }
}