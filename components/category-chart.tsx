"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatDuration } from "@/lib/utils"

interface CategoryData {
  category: string
  totalDuration: number
}

interface CategoryChartProps {
  data: CategoryData[]
}

// Generate colors for the pie chart
const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.8)",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--primary) / 0.4)",
  "hsl(var(--primary) / 0.2)",
  "hsl(var(--secondary))",
  "hsl(var(--secondary) / 0.8)",
  "hsl(var(--secondary) / 0.6)",
]

export default function CategoryChart({ data }: CategoryChartProps) {
  // Format data for the chart
  const chartData = data.map((item) => ({
    ...item,
    hours: Math.round((item.totalDuration / 60) * 10) / 10,
  }))

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="totalDuration"
            nameKey="category"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatDuration(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
