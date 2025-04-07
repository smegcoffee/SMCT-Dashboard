"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { applications } from "@/lib/data/dummy-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Import all Lucide icons we need
import { MessageSquare, Ticket, FileText, Users, Calendar, File, Briefcase, BarChart } from "lucide-react"

export function ApplicationsGrid() {
  // Map icon names to Lucide icons
  const getIcon = (iconName: string) => {
    const icons: Record<string, LucideIcon> = {
      "message-square": MessageSquare,
      ticket: Ticket,
      "file-text": FileText,
      users: Users,
      calendar: Calendar,
      file: File,
      briefcase: Briefcase,
      "bar-chart": BarChart,
    }

    return icons[iconName] || File
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {applications.map((app) => {
        const Icon = getIcon(app.icon)

        return (
          <Link key={app.id} href={app.url}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className={cn("rounded-md p-2", app.color)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{app.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{app.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

