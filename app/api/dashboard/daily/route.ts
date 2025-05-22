import { NextResponse } from "next/server"
import { getTimeEntriesGroupedByDay } from "@/lib/data"

export async function GET() {
  try {
    const data = await getTimeEntriesGroupedByDay(7)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching daily data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch daily data" }, { status: 500 })
  }
}
