"use client"

import Link from "next/link"
import { Activity } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTimeAgo } from "@/lib/utils"

export function ActivitiesCard() {
  const { activities } = useData()
  const recentActivities = activities.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Recent Activities</CardTitle>
          <CardDescription>Track what's happening across the organization</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/activities">
            <span>View all</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[140px] items-center justify-center">
            <div className="text-center">
              <Activity className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No recent activities</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

