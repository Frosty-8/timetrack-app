"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { createTimeEntry } from "@/lib/actions"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  date: z.string(),
  hours: z.coerce.number().min(0, {
    message: "Hours must be a positive number.",
  }),
  minutes: z.coerce
    .number()
    .min(0, {
      message: "Minutes must be a positive number.",
    })
    .max(59, {
      message: "Minutes must be less than 60.",
    }),
  category: z.string().default("Uncategorized"),
  progress: z.coerce.number().min(0).max(100).default(0),
})

const categories = [
  "Development",
  "Design",
  "Research",
  "Meeting",
  "Planning",
  "Documentation",
  "Learning",
  "Other",
  "Uncategorized",
]

export function NewTimeEntryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      hours: 0,
      minutes: 0,
      category: "Uncategorized",
      progress: 0,
    },
  })

  const progress = form.watch("progress")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Calculate duration in minutes
      const durationInMinutes = values.hours * 60 + values.minutes

      await createTimeEntry({
        title: values.title,
        description: values.description || "",
        date: values.date,
        duration: durationInMinutes,
        category: values.category,
        progress: values.progress,
        completed: values.progress === 100,
      })

      toast({
        title: "Success",
        description: "Time entry created successfully",
      })

      router.push("/entries")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create time entry",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="What did you work on?" {...field} />
                </FormControl>
                <FormDescription>A short title for your time entry.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add more details about what you did..." {...field} />
                </FormControl>
                <FormDescription>Optional details about your work.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minutes</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="59" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="progress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progress ({progress}%)</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                </FormControl>
                <Progress value={progress} className="h-2" />
                <FormDescription>Track the completion status of this task</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
