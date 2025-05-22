import { EditTimeEntryForm } from "@/components/edit-time-entry-form"
import { getTimeEntryById } from "@/lib/data"

export default async function EditEntryPage({ params }: { params: { id: string } }) {
  const entry = await getTimeEntryById(params.id)

  if (!entry) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Entry Not Found</h1>
        <p>The time entry you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Edit Time Entry</h1>
      <EditTimeEntryForm entry={entry} />
    </div>
  )
}
