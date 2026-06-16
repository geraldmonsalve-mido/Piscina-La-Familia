import { NextResponse } from "next/server";
import { getBlocksForLocationAndDate } from "@/lib/piscina-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("location_id") || "";
  const date = searchParams.get("date") || "";

  return NextResponse.json({
    blocks: getBlocksForLocationAndDate(locationId, date),
    date,
    source: "local",
  });
}
