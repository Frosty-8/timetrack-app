import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TimeEntrySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-muted/50 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
