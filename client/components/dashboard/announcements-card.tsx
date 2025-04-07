"use client"

import Link from "next/link"
import { Megaphone } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatTimeAgo, truncateText } from "@/lib/utils"

export function AnnouncementsCard() {
  const { announcements } = useData()
  const recentAnnouncements = announcements.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Announcements</CardTitle>
          <CardDescription>Important company-wide announcements</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/announcements">
            <span>View all</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {announcement.title}
                    {announcement.important && (
                      <Badge variant="destructive" className="ml-2">
                        Important
                      </Badge>
                    )}
                  </h4>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(announcement.date)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{truncateText(announcement.content, 120)}</p>
                <div className="text-xs text-muted-foreground">Posted by: {announcement.author}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[140px] items-center justify-center">
            <div className="text-center">
              <Megaphone className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No announcements</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

