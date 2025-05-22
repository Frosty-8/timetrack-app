import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import { type TimeEntry, mapTimeEntry } from "./models"

// Get database and collection
async function getCollection() {
  const client = await clientPromise
  const db = client.db("time-tracker")
  return db.collection("time-entries")
}

export async function getTimeEntries(): Promise<TimeEntry[]> {
  try {
    const collection = await getCollection()
    const entries = await collection.find({}).sort({ date: -1 }).toArray()
    return entries.map(mapTimeEntry)
  } catch (error) {
    console.error("Failed to fetch time entries:", error)
    return []
  }
}

export async function getTimeEntryById(id: string): Promise<TimeEntry | null> {
  try {
    const collection = await getCollection()
    const entry = await collection.findOne({ _id: new ObjectId(id) })
    return entry ? mapTimeEntry(entry) : null
  } catch (error) {
    console.error(`Failed to fetch time entry with id ${id}:`, error)
    return null
  }
}

export async function getTimeEntriesByDate(startDate: string, endDate: string): Promise<TimeEntry[]> {
  try {
    const collection = await getCollection()
    const entries = await collection
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ date: 1 })
      .toArray()
    return entries.map(mapTimeEntry)
  } catch (error) {
    console.error("Failed to fetch time entries by date:", error)
    return []
  }
}

export async function getTimeEntriesGroupedByCategory(): Promise<{ category: string; totalDuration: number }[]> {
  try {
    const collection = await getCollection()
    const result = await collection
      .aggregate([
        {
          $group: {
            _id: "$category",
            totalDuration: { $sum: "$duration" },
          },
        },
        {
          $project: {
            category: "$_id",
            totalDuration: 1,
            _id: 0,
          },
        },
        {
          $sort: { totalDuration: -1 },
        },
      ])
      .toArray()

    return result
  } catch (error) {
    console.error("Failed to fetch time entries grouped by category:", error)
    return []
  }
}

export async function getTimeEntriesGroupedByDay(days = 7): Promise<{ date: string; totalDuration: number }[]> {
  try {
    const collection = await getCollection()

    // Calculate date from X days ago
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - days)
    const startDate = daysAgo.toISOString().split("T")[0]

    const result = await collection
      .aggregate([
        {
          $match: {
            date: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$date",
            totalDuration: { $sum: "$duration" },
          },
        },
        {
          $project: {
            date: "$_id",
            totalDuration: 1,
            _id: 0,
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .toArray()

    return result
  } catch (error) {
    console.error("Failed to fetch time entries grouped by day:", error)
    return []
  }
}

export async function getTaskProgress(id: string): Promise<{ completed: boolean; progress: number } | null> {
  try {
    const collection = await getCollection()
    const entry = await collection.findOne({ _id: new ObjectId(id) }, { projection: { completed: 1, progress: 1 } })

    return entry
      ? {
          completed: entry.completed || false,
          progress: entry.progress || 0,
        }
      : null
  } catch (error) {
    console.error(`Failed to fetch task progress for id ${id}:`, error)
    return null
  }
}
