"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useRequestForms } from "@/lib/request-form-context"
import { useAuth } from "@/lib/auth-context"
import { formatTimeAgo } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Send,
  CheckSquare,
  XSquare,
  MessageSquare,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react"

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const {
    getRequestById,
    addComment,
    updateApproval,
    submitRequest,
    cancelRequest,
    deleteRequest,
    canViewRequest,
    canApproveRequest,
  } = useRequestForms()

  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [approvalComment, setApprovalComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)

  // Get the request ID from the URL
  const requestId = Array.isArray(params.id) ? params.id[0] : params.id

  // Fetch the request data
  useEffect(() => {
    if (requestId) {
      const requestData = getRequestById(requestId ?? "")
      if (requestData) {
        // Check if user can view this request
        if (!canViewRequest(requestId ?? "")) {
          setUnauthorized(true)
          return
        }

        setRequest(requestData)
      } else {
        // Request not found, redirect to requests page
        router.push("/requests")
      }
      setLoading(false)
    }
  }, [requestId, getRequestById, router, canViewRequest])

  // Check if the current user is the requester
  const isRequester = user && request?.requestedBy.id === user.id

  // Check if the current user is an approver for the current level
  const userCanApprove = user && request ? canApproveRequest(requestId ?? "") : false

  // Find the current approval for this user
  const currentApproval =
    user &&
    request?.approvals.find(
      (approval: any) =>
        approval.userId === user.id && approval.level === request.currentLevel && approval.status === "pending",
    )

  // Add debugging for approval status
  useEffect(() => {
    if (request && user) {
      console.log("Request approval status:", {
        requestId,
        currentLevel: request.currentLevel,
        userCanApprove,
        currentApproval,
        userId: user.id,
        approvals: request.approvals,
      })
    }
  }, [request, user, userCanApprove, currentApproval, requestId])

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

  // Handle comment submission
  const handleAddComment = async () => {
    if (!comment.trim()) return

    setSubmitting(true)
    const newComment = addComment(requestId ?? "", comment)
    if (newComment) {
      setComment("")
      // Refresh request data
      const updatedRequest = getRequestById(requestId ?? '')
      if (updatedRequest) {
        setRequest(updatedRequest)
      }
    }
    setSubmitting(false)
  }

  // Handle approval/rejection
  const handleApproval = async (status: "approved" | "rejected") => {
    if (!currentApproval || !user) return

    setSubmitting(true)

    try {
      const updated = updateApproval(requestId ?? "", currentApproval.id, status, approvalComment)

      if (updated) {
        setApprovalComment("")
        // Refresh request data
        const updatedRequest = getRequestById(requestId ?? '')
        if (updatedRequest) {
          setRequest(updatedRequest)
        }
      }
    } catch (error) {
      console.error("Error updating approval:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle submit request
  const handleSubmitRequest = async () => {
    setSubmitting(true)
    const updated = submitRequest(requestId ?? "")
    if (updated) {
      // Refresh request data
      setRequest(updated)
    }
    setSubmitting(false)
  }

  // Handle cancel request
  const handleCancelRequest = async () => {
    setSubmitting(true)
    const updated = cancelRequest(requestId ?? "")
    if (updated) {
      // Refresh request data
      setRequest(updated)
    }
    setSubmitting(false)
  }

  // Handle delete request
  const handleDeleteRequest = async () => {
    setSubmitting(true)
    const deleted = deleteRequest(requestId ?? "")
    if (deleted) {
      // Redirect to requests page
      router.push("/requests")
    }
    setSubmitting(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You don't have permission to view this request</p>
        <Button onClick={() => router.push("/requests")}>Return to Requests</Button>
      </div>
    )
  }

  if (!request) {
    return <div className="flex items-center justify-center h-64">Request not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/requests")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{request.title}</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
              </p>
              <StatusBadge status={request.status} />
            </div>
          </div>
        </div>

        {isRequester && (
          <div className="flex gap-2">
            {request.status === "draft" && (
              <>
                <Button variant="outline" onClick={() => router.push(`/requests/${requestId}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this request form.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteRequest}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}

            {request.status === "draft" && request.approvals.length > 0 && (
              <Button onClick={handleSubmitRequest} disabled={submitting}>
                <Send className="mr-2 h-4 w-4" /> Submit
              </Button>
            )}

            {request.status === "pending" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" /> Cancel Request
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel the request and notify all approvers. Are you sure?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, keep it</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelRequest}>Yes, cancel it</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Request Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{request.description}</p>
              </div>

              {request.items && request.items.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Quantity</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Unit</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Est. Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {request.items.map((item: any, index: number) => (
                          <tr key={`item-${item.id || index}`} className="border-t">
                            <td className="px-4 py-2 text-sm">{item.description}</td>
                            <td className="px-4 py-2 text-sm">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm">{item.unit}</td>
                            <td className="px-4 py-2 text-sm">
                              {item.estimatedCost ? `$${item.estimatedCost.toFixed(2)}` : "N/A"}
                            </td>
                          </tr>
                        ))}
                        {request.items.some((item: any) => item.estimatedCost) && (
                          <tr className="border-t bg-muted/50">
                            <td colSpan={3} className="px-4 py-2 text-sm font-medium text-right">
                              Total:
                            </td>
                            <td className="px-4 py-2 text-sm font-medium">
                              $
                              {request.items
                                .reduce((sum: number, item: any) => sum + (item.estimatedCost || 0), 0)
                                .toFixed(2)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Requested By</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={request.requestedBy.avatar} alt={request.requestedBy.name} />
                      <AvatarFallback>{request.requestedBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{request.requestedBy.name}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                  <p className="mt-1">{request.department}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date Requested</h3>
                  <p className="mt-1">{request.dateRequested.toLocaleDateString()}</p>
                </div>

                {request.dateNeeded && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Date Needed</h3>
                    <p className="mt-1">{request.dateNeeded.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Approval Actions */}
          {userCanApprove && currentApproval && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle>Your Approval Required</CardTitle>
                <CardDescription>
                  You are required to approve or reject this request at level {currentApproval.level}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add comments about your decision (optional)"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                    onClick={() => handleApproval("approved")}
                    disabled={submitting}
                  >
                    <CheckSquare className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                    onClick={() => handleApproval("rejected")}
                    disabled={submitting}
                  >
                    <XSquare className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.comments.length > 0 ? (
                <div className="space-y-4">
                  {request.comments.map((comment: any, index: number) => (
                    <div key={`comment-${comment.id || index}`} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{comment.userName}</p>
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(comment.timestamp)}</p>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No comments yet</p>
              )}

              <Separator />

              <div className="space-y-2">
                <Textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button className="ml-auto" onClick={handleAddComment} disabled={!comment.trim() || submitting}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Approval Status */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.approvals.length > 0 ? (
                <div className="space-y-4">
                  {request.approvals
                    .sort((a: any, b: any) => a.level - b.level) // Sort by level
                    .map((approval: any, index: number) => (
                      <div key={`approval-status-${approval.id || index}`} className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {approval.status === "approved" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : approval.status === "rejected" ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              Level {approval.level}: {approval.userName}
                            </p>
                            {approval.timestamp && (
                              <p className="text-xs text-muted-foreground">{formatTimeAgo(approval.timestamp)}</p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{approval.userPosition}</p>
                          {approval.comments && (
                            <p className="text-sm mt-1 bg-muted p-2 rounded-md">{approval.comments}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No approvers added yet</p>
                  {request.status === "draft" && isRequester && (
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => router.push(`/requests/${requestId}/edit`)}
                    >
                      Add Approvers
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Request Created</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(request.dateRequested)}</p>
                  </div>
                </div>

                {request.status !== "draft" && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Send className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Request Submitted</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(new Date(request.dateRequested.getTime() + 1000 * 60))}
                      </p>
                    </div>
                  </div>
                )}

                {request.approvals
                  .filter((a: any) => a.timestamp)
                  .map((approval: any, index: number) => (
                    <div key={`timeline-${approval.id || index}`} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {approval.status === "approved" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {approval.userName} {approval.status} the request
                        </p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(approval.timestamp)}</p>
                      </div>
                    </div>
                  ))}

                {request.status === "cancelled" && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <XCircle className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Request Cancelled</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(new Date(Date.now() - 1000 * 60 * 60))}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

