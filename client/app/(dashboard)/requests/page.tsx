"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRequestForms } from "@/lib/request-form-context"
import { useAuth } from "@/lib/auth-context"
import { formatTimeAgo } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function RequestsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { userRequests, pendingApprovals } = useRequestForms()
  const [activeTab, setActiveTab] = useState("my-requests")

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-muted">
            <Clock className="mr-1 h-3 w-3" /> Draft
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Request Forms</h1>
          <p className="text-muted-foreground">Manage and track your request forms</p>
        </div>
        <Button onClick={() => router.push("/requests/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      <Tabs defaultValue="my-requests" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-requests">
            My Requests
            {userRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {userRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending-approval">
            Pending My Approval
            {pendingApprovals.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingApprovals.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-requests" className="space-y-4">
          {userRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userRequests.map((request) => (
                <Link href={`/requests/${request.id}`} key={request.id}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <StatusBadge status={request.status} />
                      </div>
                      <CardDescription>
                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <FileText className="mr-1 h-3 w-3" />
                        <span>
                          {request.approvals.length} approver{request.approvals.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {/* Show requester name if not the current user */}
                      {user && request.requestedBy.id !== user.id && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Requested by: {request.requestedBy.name}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                      Requested {formatTimeAgo(request.dateRequested)}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't created any requests yet</p>
                <Button onClick={() => router.push("/requests/new")}>
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Request
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending-approval" className="space-y-4">
          {pendingApprovals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingApprovals.map((request) => (
                <Link href={`/requests/${request.id}`} key={request.id}>
                  <Card className="h-full transition-all hover:shadow-md border-yellow-600 bg-black">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <StatusBadge status={request.status} />
                      </div>
                      <CardDescription>
                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <span className="font-medium">Requested by:</span>
                        <span className="ml-1">{request.requestedBy.name}</span>
                      </div>
                      <div className="mt-1 text-xs text-yellow-600 font-medium">
                        Waiting for your approval (Level {request.currentLevel})
                      </div>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                      Requested {formatTimeAgo(request.dateRequested)}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No requests pending your approval</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

