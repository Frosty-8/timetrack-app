"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Clock, Edit, Trash, PlusCircle, CheckCircle2 } from "lucide-react"
import { formatDuration, formatDate } from "@/lib/utils"
import { deleteTimeEntry } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import type { TimeEntry } from "@/lib/models"

export default function TimeEntryList() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("/api/entries")
        const data = await response.json()

        if (data.success) {
          setEntries(data.entries)
        } else {
          throw new Error(data.error || "Failed to load entries")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load time entries",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [toast])

  const handleDelete = async () => {
    if (!entryToDelete) return

    try {
      await deleteTimeEntry(entryToDelete)
      setEntries(entries.filter((entry) => entry.id !== entryToDelete))
      toast({
        title: "Success",
        description: "Time entry deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete time entry",
        variant: "destructive",
      })
    } finally {
      setEntryToDelete(null)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">No time entries yet</h2>
        <p className="mt-2 text-muted-foreground">Start tracking your work by adding your first time entry.</p>
        <Link href="/entries/new" className="mt-4 inline-block">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Entry
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <Card key={entry.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{entry.title}</h3>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {formatDuration(entry.duration)}
              </span>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{entry.description}</p>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
              <Badge variant="outline">{entry.category || "Uncategorized"}</Badge>
            </div>
            {entry.progress !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Progress</span>
                  <span className="font-medium">{entry.progress}%</span>
                </div>
                <Progress value={entry.progress} className="h-1" />
                {entry.completed && (
                  <div className="flex items-center justify-end gap-1 text-xs text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-muted/50 p-2">
            <Link href={`/entries/${entry.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setEntryToDelete(entry.id!)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the time entry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setEntryToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
