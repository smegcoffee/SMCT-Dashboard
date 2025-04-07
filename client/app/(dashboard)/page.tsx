import type { Metadata } from "next"
import { NotificationsCard } from "@/components/dashboard/notifications-card"
import { ActivitiesCard } from "@/components/dashboard/activities-card"
import { AnnouncementsCard } from "@/components/dashboard/announcements-card"
import { ApplicationsGrid } from "@/components/dashboard/applications-grid"

export const metadata: Metadata = {
  title: "Dashboard - SMCT Portal",
  description: "SMCT Portal Dashboard",
}

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to SMCT portal dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NotificationsCard />
        <ActivitiesCard />
        <AnnouncementsCard />
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Applications</h2>
        <ApplicationsGrid />
      </div>
    </div>
  )
}

export default DashboardPage

