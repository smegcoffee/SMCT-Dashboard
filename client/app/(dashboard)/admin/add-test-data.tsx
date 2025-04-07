"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function AddTestData() {
  const { user } = useAuth()
  const [added, setAdded] = useState(false)

  const addSampleRequest = () => {
    if (!user) return

    // Create a sample request with proper approvals
    const sampleRequest = {
      id: `req-${Date.now().toString(36)}`,
      title: "Test Request with Multiple Approvers",
      description: "This is a test request with multiple approvers at the same level",
      type: "purchase",
      requestedBy: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        position: user.role,
      },
      department: user.department,
      dateRequested: new Date(),
      dateNeeded: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      status: "pending", // Set to pending so it can be approved
      currentLevel: 1, // Set to the first approval level
      approvals: [
        {
          id: `approval-${Date.now().toString(36)}-1`,
          userId: "user-3", // Team Supervisor
          userName: "Team Supervisor",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Team Supervisor",
          level: 1,
          status: "pending", // This is critical!
        },
        {
          id: `approval-${Date.now().toString(36)}-2`,
          userId: "user-6", // Another Level 1 approver (Dario Toston)
          userName: "Dario Toston",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Team Supervisor",
          level: 1,
          status: "pending",
        },
        {
          id: `approval-${Date.now().toString(36)}-3`,
          userId: "user-2", // Department Manager
          userName: "Department Manager",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Department Manager",
          level: 2,
          status: "pending",
        },
        {
          id: `approval-${Date.now().toString(36)}-4`,
          userId: "user-1", // Admin
          userName: "Admin User",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Administrator",
          level: 3,
          status: "pending",
        },
      ],
      comments: [],
      items: [
        {
          id: `item-${Date.now().toString(36)}`,
          description: "Test Item",
          quantity: 1,
          unit: "piece",
          estimatedCost: 100,
        },
      ],
    }

    // Get existing requests from localStorage
    const existingRequests = localStorage.getItem("requestForms")
    const requests = existingRequests ? JSON.parse(existingRequests) : []

    // Add the new request
    requests.push(sampleRequest)

    // Save back to localStorage
    localStorage.setItem("requestForms", JSON.stringify(requests))

    setAdded(true)
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Test Data</CardTitle>
        <CardDescription>Add sample request data for testing</CardDescription>
      </CardHeader>
      <CardContent>
        {added ? (
          <div className="text-green-600 font-medium">Test data added successfully! Reloading page...</div>
        ) : (
          <div className="space-y-4">
            <p>This will add a sample request to your localStorage for testing purposes.</p>
            <Button onClick={addSampleRequest}>Add Test Request</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

