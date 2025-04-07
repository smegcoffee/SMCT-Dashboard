"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatTimeAgo } from "@/lib/utils"

export function NotificationsCard() {
  const { notifications, markNotificationAsRead } = useData()
  const recentNotifications = notifications.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Recent Notifications</CardTitle>
          <CardDescription>Stay updated with the latest alerts</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/notifications">
            <span>View all</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentNotifications.length > 0 ? (
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-4 p-2 rounded-md hover:bg-muted"
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div
                  className={`h-2 w-2 mt-2 rounded-full ${notification.read ? "bg-muted-foreground" : "bg-destructive"}`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(notification.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[140px] items-center justify-center">
            <div className="text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

