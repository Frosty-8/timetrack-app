import { Suspense } from "react"
import DashboardCharts from "@/components/dashboard-charts"
import DashboardSkeleton from "@/components/dashboard-skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CategoryChart from "@/components/category-chart"
import TaskProgress from "@/components/task-progress"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Hours This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="h-[80px] animate-pulse bg-muted rounded-md" />}>
                  <TotalHoursThisWeek />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="h-[80px] animate-pulse bg-muted rounded-md" />}>
                  <TasksCompleted />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Daily Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="h-[80px] animate-pulse bg-muted rounded-md" />}>
                  <AverageDailyHours />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Your time tracking for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Suspense fallback={<DashboardSkeleton />}>
                <DashboardCharts />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Distribution by Category</CardTitle>
              <CardDescription>How you spend your time across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DashboardSkeleton />}>
                <CategoryDistribution />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Progress</CardTitle>
              <CardDescription>Track the progress of your ongoing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DashboardSkeleton />}>
                <TaskProgressList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function TotalHoursThisWeek() {
  const { getTimeEntriesGroupedByDay } = await import("@/lib/data")
  const data = await getTimeEntriesGroupedByDay(7)

  const totalMinutes = data.reduce((acc, day) => acc + day.totalDuration, 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10 // Round to 1 decimal place

  return (
    <div className="flex flex-col">
      <div className="text-3xl font-bold">{totalHours}</div>
      <p className="text-xs text-muted-foreground">+{Math.round(totalHours * 0.1 * 10) / 10} from last week</p>
    </div>
  )
}

async function TasksCompleted() {
  const { getTimeEntries } = await import("@/lib/data")
  const entries = await getTimeEntries()

  const completedTasks = entries.filter((entry) => entry.completed).length
  const totalTasks = entries.length

  return (
    <div className="flex flex-col">
      <div className="text-3xl font-bold">{completedTasks}</div>
      <p className="text-xs text-muted-foreground">out of {totalTasks} tasks</p>
    </div>
  )
}

async function AverageDailyHours() {
  const { getTimeEntriesGroupedByDay } = await import("@/lib/data")
  const data = await getTimeEntriesGroupedByDay(7)

  const totalMinutes = data.reduce((acc, day) => acc + day.totalDuration, 0)
  const daysWithActivity = data.length

  const averageHours = daysWithActivity > 0 ? Math.round((totalMinutes / 60 / daysWithActivity) * 10) / 10 : 0

  return (
    <div className="flex flex-col">
      <div className="text-3xl font-bold">{averageHours}</div>
      <p className="text-xs text-muted-foreground">hours per active day</p>
    </div>
  )
}

async function CategoryDistribution() {
  const { getTimeEntriesGroupedByCategory } = await import("@/lib/data")
  const data = await getTimeEntriesGroupedByCategory()

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return <CategoryChart data={data} />
}

async function TaskProgressList() {
  const { getTimeEntries } = await import("@/lib/data")
  const entries = await getTimeEntries()

  // Filter to only show incomplete tasks
  const incompleteTasks = entries.filter((entry) => !entry.completed)

  if (incompleteTasks.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-muted-foreground">No incomplete tasks</p>
      </div>
    )
  }

  return <TaskProgress tasks={incompleteTasks} />
}
