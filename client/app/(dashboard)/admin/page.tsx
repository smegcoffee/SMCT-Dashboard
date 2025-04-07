"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRequestForms } from "@/lib/request-form-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Users, Trash2, UserCheck } from "lucide-react"
import AddTestData from "./add-test-data"
import FixData from "./fix-data"

export default function AdminPage() {
  const { clearAllData } = useRequestForms()
  const router = useRouter()
  const [cleared, setCleared] = useState(false)

  const handleClearData = () => {
    clearAllData()
    setCleared(true)
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Tools</h1>
        <p className="text-muted-foreground">Administrative tools and settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and approver settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Configure which users can approve requests and set their approval levels.</p>
              <Button onClick={() => router.push("/admin/users")} className="w-full">
                <Users className="mr-2 h-4 w-4" /> Manage Users
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Pre-Approvers</CardTitle>
            <CardDescription>Configure default approvers by request type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Set up default approver lists for different types of requests.</p>
              <Button onClick={() => router.push("/admin/pre-approvers")} className="w-full">
                <UserCheck className="mr-2 h-4 w-4" /> Manage Pre-Approvers
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Clear application data and reset to defaults</CardDescription>
          </CardHeader>
          <CardContent>
            {cleared ? (
              <div className="text-green-600 font-medium mb-4">
                Data cleared successfully! Redirecting to dashboard...
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  This will clear all request forms data from the browser's localStorage. This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={handleClearData} className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear All Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FixData />
      <AddTestData />
    </div>
  )
}

