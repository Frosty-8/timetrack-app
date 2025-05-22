import { NextResponse } from "next/server"
import { getTimeEntriesGroupedByCategory } from "@/lib/data"

export async function GET() {
  try {
    const data = await getTimeEntriesGroupedByCategory()

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching category data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch category data" }, { status: 500 })
  }
}
