import { NextResponse } from "next/server"
import { getTimeEntries } from "@/lib/data"

export async function GET() {
  try {
    const entries = await getTimeEntries()

    return NextResponse.json({
      success: true,
      entries,
    })
  } catch (error) {
    console.error("Error fetching entries:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch entries" }, { status: 500 })
  }
}
