import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, PlusCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">TimeTracker</h1>
        </div>
      </header>

      <div className="mb-8 rounded-lg bg-muted p-8 text-center">
        <h2 className="mb-4 text-3xl font-bold">Track Your Work Time</h2>
        <p className="mb-6 text-muted-foreground">
          A simple way to log and monitor the time you spend on different activities.
        </p>
        <Link href="/entries">
          <Button size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Start Tracking
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Log Activities</h3>
          <p className="text-muted-foreground">Record what you're working on and for how long.</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Track Progress</h3>
          <p className="text-muted-foreground">See how you spend your time across different tasks.</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Stay Organized</h3>
          <p className="text-muted-foreground">Keep all your work activities in one place.</p>
        </div>
      </div>
    </div>
  )
}
