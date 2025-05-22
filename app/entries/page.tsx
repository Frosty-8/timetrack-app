import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import TimeEntryList from "@/components/time-entry-list"
import TimeEntrySkeleton from "@/components/time-entry-skeleton"

export default function EntriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Time Entries</h1>
        <Link href="/entries/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Entry
          </Button>
        </Link>
      </div>

      <Suspense fallback={<TimeEntrySkeleton />}>
        <TimeEntryList />
      </Suspense>
    </div>
  )
}
