"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Check, Clock } from "lucide-react"
import { formatDate, formatDuration } from "@/lib/utils"
import { updateTaskProgress } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import type { TimeEntry } from "@/lib/models"

interface TaskProgressProps {
  tasks: TimeEntry[]
}

export default function TaskProgress({ tasks }: TaskProgressProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleUpdateProgress = async (id: string, newProgress: number) => {
    setUpdating(id)

    try {
      const completed = newProgress === 100
      await updateTaskProgress(id, newProgress, completed)

      toast({
        title: "Progress updated",
        description: completed ? "Task marked as completed!" : "Task progress updated",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task progress",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <div key={task.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(task.duration)}</span>
                <span>•</span>
                <span>{formatDate(task.date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{task.progress}%</span>
              {task.progress < 100 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateProgress(task.id!, 100)}
                  disabled={updating === task.id}
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Mark as complete</span>
                </Button>
              )}
            </div>
          </div>
          <Progress value={task.progress} className="h-2" />
          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateProgress(task.id!, 25)}
              disabled={updating === task.id || task.progress >= 25}
            >
              25%
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateProgress(task.id!, 50)}
              disabled={updating === task.id || task.progress >= 50}
            >
              50%
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateProgress(task.id!, 75)}
              disabled={updating === task.id || task.progress >= 75}
            >
              75%
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateProgress(task.id!, 100)}
              disabled={updating === task.id || task.progress >= 100}
            >
              100%
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
