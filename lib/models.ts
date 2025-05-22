import type { ObjectId } from "mongodb"

export interface TimeEntry {
  _id?: string | ObjectId
  id?: string
  title: string
  description: string
  date: string
  duration: number // in minutes
  createdAt: string
  updatedAt?: string
  category?: string
  completed?: boolean
  progress?: number // 0-100 percentage
}

export function mapTimeEntry(entry: any): TimeEntry {
  return {
    id: entry._id.toString(),
    title: entry.title,
    description: entry.description,
    date: entry.date,
    duration: entry.duration,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    category: entry.category || "Uncategorized",
    completed: entry.completed || false,
    progress: entry.progress || 0,
  }
}
