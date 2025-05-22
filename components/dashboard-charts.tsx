"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { formatDuration } from "@/lib/utils"

interface DailyData {
  date: string
  totalDuration: number
}

export default function DashboardCharts() {
  const [data, setData] = useState<DailyData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard/daily")
        const result = await response.json()

        if (result.success) {
          // Fill in missing days with zero values
          const filledData = fillMissingDays(result.data)
          setData(filledData)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to fill in missing days with zero values
  function fillMissingDays(data: DailyData[]): DailyData[] {
    const filledData: DailyData[] = []
    const today = new Date()

    // Create array of last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      // Find if we have data for this date
      const dayData = data.find((d) => d.date === dateString)

      filledData.push({
        date: dateString,
        totalDuration: dayData ? dayData.totalDuration : 0,
      })
    }

    return filledData
  }

  if (isLoading) {
    return <div className="h-[300px] w-full animate-pulse bg-muted rounded-md" />
  }

  // Format the date for display
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    hours: Math.round((item.totalDuration / 60) * 10) / 10,
  }))

  return (
    <Card>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis tickFormatter={(value) => `${value}h`} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <p className="font-medium">{data.formattedDate}</p>
                      <p className="text-sm text-muted-foreground">{formatDuration(data.totalDuration)}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
