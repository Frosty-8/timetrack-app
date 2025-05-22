import { NewTimeEntryForm } from "@/components/new-time-entry-form"

export default function NewEntryPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Add New Time Entry</h1>
      <NewTimeEntryForm />
    </div>
  )
}
