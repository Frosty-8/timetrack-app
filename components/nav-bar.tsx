"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Clock, BarChart, List, PlusCircle } from "lucide-react"

export function NavBar() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">TimeTracker</span>
        </Link>

        <nav className="ml-auto flex gap-4">
          <Link href="/dashboard">
            <Button variant={pathname === "/dashboard" ? "default" : "ghost"}>
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/entries">
            <Button variant={pathname === "/entries" ? "default" : "ghost"}>
              <List className="mr-2 h-4 w-4" />
              Entries
            </Button>
          </Link>
          <Link href="/entries/new">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
