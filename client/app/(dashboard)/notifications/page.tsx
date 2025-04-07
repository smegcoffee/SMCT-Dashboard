import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications - Corporate Portal",
  description: "View all your notifications",
}

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">View and manage all your notifications</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <h2 className="text-lg font-medium">Notifications Page</h2>
        <p className="mt-2 text-muted-foreground">This is a placeholder for the full notifications page</p>
      </div>
    </div>
  )
}

