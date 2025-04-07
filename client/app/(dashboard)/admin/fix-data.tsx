"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


interface Approval {
    id?: string
    status?: string
  }
  
  interface RequestForm {
    id: string
    status?: string
    currentLevel?: number
    approvals: Approval[]
  }

  
export default function FixData() {
  const [fixed, setFixed] = useState(false)

  const fixExistingData = () => {
    // Get existing requests from localStorage
    const existingRequests = localStorage.getItem("requestForms")
    if (!existingRequests) {
      setFixed(true)
      return
    }

    try {
      const requests = JSON.parse(existingRequests) as RequestForm[]

      // Fix each request
      const fixedRequests = requests.map((request) => {
        // Fix approvals
        const fixedApprovals = request.approvals.map((approval, index) => {
          // Add missing id if needed
          if (!approval.id) {
            approval.id = `approval-${request.id}-${index}`
          }

          // Add missing status if needed
          if (!approval.status) {
            approval.status = "pending"
          }

          return approval
        })

        // Update the request with fixed approvals
        return {
          ...request,
          approvals: fixedApprovals,
          // Ensure status is set
          status: request.status || "draft",
          // Ensure currentLevel is set
          currentLevel: request.currentLevel || 0,
        }
      })

      // Save fixed requests back to localStorage
      localStorage.setItem("requestForms", JSON.stringify(fixedRequests))

      setFixed(true)
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Error fixing data:", error)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Fix Existing Data</CardTitle>
        <CardDescription>Repair issues with existing request data</CardDescription>
      </CardHeader>
      <CardContent>
        {fixed ? (
          <div className="text-green-600 font-medium">Data fixed successfully! Reloading page...</div>
        ) : (
          <div className="space-y-4">
            <p>
              This will fix common issues with existing request data in localStorage, such as missing approval IDs or
              status fields.
            </p>
            <Button onClick={fixExistingData}>Fix Existing Data</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

