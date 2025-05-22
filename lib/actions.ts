"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

interface TimeEntryData {
  title: string
  description: string
  date: string
  duration: number // in minutes
  category?: string
  completed?: boolean
  progress?: number
}

async function getCollection() {
  const client = await clientPromise
  const db = client.db("time-tracker")
  return db.collection("time-entries")
}

export async function createTimeEntry(data: TimeEntryData) {
  try {
    const collection = await getCollection()

    const entry = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: data.category || "Uncategorized",
      completed: data.completed || false,
      progress: data.progress || 0,
    }

    const result = await collection.insertOne(entry)

    // Revalidate the entries page to show the new entry
    revalidatePath("/entries")
    revalidatePath("/dashboard")

    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Failed to create time entry:", error)
    return { success: false, error: "Failed to create time entry" }
  }
}

export async function updateTimeEntry(id: string, data: TimeEntryData) {
  try {
    const collection = await getCollection()

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      },
    )

    // Revalidate the entries page to show the updated entry
    revalidatePath("/entries")
    revalidatePath("/dashboard")
    revalidatePath(`/entries/${id}`)

    return { success: result.modifiedCount > 0 }
  } catch (error) {
    console.error(`Failed to update time entry with id ${id}:`, error)
    return { success: false, error: "Failed to update time entry" }
  }
}

export async function deleteTimeEntry(id: string) {
  try {
    const collection = await getCollection()

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    // Revalidate the entries page to remove the deleted entry
    revalidatePath("/entries")
    revalidatePath("/dashboard")

    return { success: result.deletedCount > 0 }
  } catch (error) {
    console.error(`Failed to delete time entry with id ${id}:`, error)
    return { success: false, error: "Failed to delete time entry" }
  }
}

export async function updateTaskProgress(id: string, progress: number, completed = false) {
  try {
    const collection = await getCollection()

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          progress,
          completed,
          updatedAt: new Date().toISOString(),
        },
      },
    )

    // Revalidate paths
    revalidatePath("/entries")
    revalidatePath("/dashboard")
    revalidatePath(`/entries/${id}`)

    return { success: result.modifiedCount > 0 }
  } catch (error) {
    console.error(`Failed to update task progress for id ${id}:`, error)
    return { success: false, error: "Failed to update task progress" }
  }
}
