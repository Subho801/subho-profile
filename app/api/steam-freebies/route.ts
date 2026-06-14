import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "steam-freebies.json");
    const file = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(file);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      items: [],
      updatedAt: null,
    });
  }
}
