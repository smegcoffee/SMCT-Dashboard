"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { RequestForm, RequestComment, Approval, ApprovalStatus } from "./data/request-forms-data"
import { useAuth } from "./auth-context"
import { tempUsers } from "./data/tempUsers"
import { getDefaultPreApproverSetByType, getUserPreApproverSets, type PreApproverSet } from "./data/pre-approvers-data"

interface RequestFormContextType {
  requests: RequestForm[]
  userRequests: RequestForm[]
  pendingApprovals: RequestForm[]
  userPreApproverSets: PreApproverSet[]
  getRequestById: (id: string) => RequestForm | undefined
  createRequest: (
    request: Omit<RequestForm, "id" | "dateRequested" | "status" | "comments" | "currentLevel">,
  ) => RequestForm
  updateRequest: (id: string, updates: Partial<RequestForm>) => RequestForm | undefined
  deleteRequest: (id: string) => boolean
  addComment: (requestId: string, content: string) => RequestComment | undefined
  updateApproval: (
    requestId: string,
    approvalId: string,
    status: ApprovalStatus,
    comment?: string,
  ) => Approval | undefined
  addApprover: (
    requestId: string,
    approverId: string,
    approverName: string,
    approverAvatar: string,
    approverPosition: string,
    approverLevel: number,
  ) => Approval | undefined
  removeApprover: (requestId: string, approvalId: string) => boolean
  submitRequest: (id: string) => RequestForm | undefined
  cancelRequest: (id: string) => RequestForm | undefined
  canViewRequest: (requestId: string) => boolean
  canApproveRequest: (requestId: string) => boolean
  getAvailableApprovers: () => any[]
  clearAllData: () => void
  saveUserPreApproverSet: (set: PreApproverSet) => boolean
  deleteUserPreApproverSet: (setId: string) => boolean
  getPreApproversForRequestType: (requestType: string) => PreApproverSet[]
}

const RequestFormContext = createContext<RequestFormContextType | undefined>(undefined)

export function RequestFormProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [requests, setRequests] = useState<RequestForm[]>([])
  const [userRequests, setUserRequests] = useState<RequestForm[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<RequestForm[]>([])
  const [userPreApproverSets, setUserPreApproverSets] = useState<PreApproverSet[]>([])

  // Initialize with sample data
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Try to load from localStorage
      const savedRequests = localStorage.getItem("requestForms")
      if (savedRequests) {
        const parsedRequests = JSON.parse(savedRequests)
        // Convert string dates back to Date objects
        const requestsWithDates = parsedRequests.map((req: any) => ({
          ...req,
          dateRequested: new Date(req.dateRequested),
          dateNeeded: req.dateNeeded ? new Date(req.dateNeeded) : undefined,
          approvals: req.approvals.map((approval: any) => ({
            ...approval,
            timestamp: approval.timestamp ? new Date(approval.timestamp) : undefined,
          })),
          comments: req.comments.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp),
          })),
        }))
        setRequests(requestsWithDates)
      } else {
        // Initialize with empty array instead of sample data
        setRequests([])
      }
    }
  }, [])

  // Load user's pre-approver sets
  useEffect(() => {
    if (user) {
      const userSets = getUserPreApproverSets(user.id)
      setUserPreApproverSets(userSets)
    } else {
      setUserPreApproverSets([])
    }
  }, [user])

  // Add this function after the useEffect that initializes with sample data
  useEffect(() => {
    // Fix any existing data in localStorage
    if (typeof window !== "undefined" && requests.length > 0) {
      const fixedRequests = requests.map((request) => {
        // Fix approvals
        const fixedApprovals = request.approvals.map((approval, index) => {
          // Add missing id if needed
          if (!approval.id) {
            approval.id = `approval-${request.id}-${index}-${Date.now().toString(36)}`
          }

          // Add missing status if needed
          if (!approval.status) {
            approval.status = "pending" as ApprovalStatus
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

      // Only update if there were changes
      if (JSON.stringify(fixedRequests) !== JSON.stringify(requests)) {
        console.log("Fixed request data:", fixedRequests)
        setRequests(fixedRequests)
      }
    }
  }, [requests])

  // Update filtered requests when user or all requests change
  useEffect(() => {
    if (user && requests.length > 0) {
      // Filter requests created by the user ONLY
      const userReqs = requests.filter((req) => req.requestedBy.id === user.id)
      setUserRequests(userReqs)

      // Filter requests pending approval from the user
      // Only include requests where the user is an approver and NOT the creator
      const pendingApprovals = requests.filter(
        (req) =>
          req.status === "pending" &&
          req.requestedBy.id !== user.id && // Don't include user's own requests
          req.approvals.some(
            (approval) =>
              approval.userId === user.id && approval.status === "pending" && approval.level === req.currentLevel,
          ),
      )
      setPendingApprovals(pendingApprovals)
    } else {
      setUserRequests([])
      setPendingApprovals([])
    }
  }, [user, requests])

  // Save requests to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && requests.length > 0) {
      localStorage.setItem("requestForms", JSON.stringify(requests))
    }
  }, [requests])

  // Check if user can view a specific request
  const canViewRequest = (requestId: string): boolean => {
    if (!user) return false

    const request = getRequestById(requestId)
    if (!request) return false

    // User is the requester
    if (request.requestedBy.id === user.id) return true

    // User is an approver for this request
    if (request.approvals.some((approval) => approval.userId === user.id)) return true

    // User is an admin
    if (user.role === "Administrator") return true

    return false
  }

  // Update the canApproveRequest function to properly check approver permissions
  const canApproveRequest = (requestId: string): boolean => {
    if (!user) return false

    const request = getRequestById(requestId)
    if (!request || request.status !== "pending") return false

    // Find the approval for the current user at the current level
    const approval = request.approvals.find(
      (approval) =>
        approval.userId === user.id && approval.level === request.currentLevel && approval.status === "pending",
    )

    // Add debugging
    console.log("Checking approval permissions:", {
      userId: user.id,
      currentLevel: request.currentLevel,
      approvals: request.approvals,
      foundApproval: approval,
    })

    return !!approval
  }

  // Get available approvers for selection
  const getAvailableApprovers = () => {
    if (!user) return []

    // Get all users who can be approvers
    return tempUsers.filter((u) => u.isApprover && u.id !== user.id)
  }

  // Get a request by ID
  const getRequestById = (id: string) => {
    return requests.find((req) => req.id === id)
  }

  // Create a new request
  const createRequest = (
    requestData: Omit<RequestForm, "id" | "dateRequested" | "status" | "comments" | "currentLevel">,
  ) => {
    const newRequest: RequestForm = {
      id: `req-${Date.now().toString(36)}`,
      ...requestData,
      dateRequested: new Date(),
      status: "draft",
      comments: [],
      currentLevel: 0,
    }

    setRequests((prev) => [...prev, newRequest])
    return newRequest
  }

  // Update a request
  const updateRequest = (id: string, updates: Partial<RequestForm>) => {
    let updatedRequest: RequestForm | undefined

    setRequests((prev) => {
      const newRequests = prev.map((req) => {
        if (req.id === id) {
          updatedRequest = { ...req, ...updates }
          return updatedRequest
        }
        return req
      })
      return newRequests
    })

    return updatedRequest
  }

  // Delete a request
  const deleteRequest = (id: string) => {
    let deleted = false

    setRequests((prev) => {
      const newRequests = prev.filter((req) => {
        if (req.id === id) {
          // Only allow deletion if user is the requester and request is in draft
          const request = getRequestById(id)
          if (request && user && request.requestedBy.id === user.id && request.status === "draft") {
            deleted = true
            return false
          }
        }
        return true
      })
      return newRequests
    })

    return deleted
  }

  // Add a comment to a request
  const addComment = (requestId: string, content: string) => {
    if (!user) return undefined

    // Check if user can view this request (only requester and approvers can comment)
    if (!canViewRequest(requestId)) return undefined

    const newComment: RequestComment = {
      id: `comment-${Date.now().toString(36)}`,
      requestId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      timestamp: new Date(),
    }

    let addedComment: RequestComment | undefined

    setRequests((prev) => {
      const newRequests = prev.map((req) => {
        if (req.id === requestId) {
          addedComment = newComment
          return {
            ...req,
            comments: [...req.comments, newComment],
          }
        }
        return req
      })
      return newRequests
    })

    return addedComment
  }

  // Update an approval status
  const updateApproval = (requestId: string, approvalId: string, status: ApprovalStatus, comment?: string) => {
    if (!user) return undefined

    // Get the request
    const request = getRequestById(requestId)
    if (!request) return undefined

    // Find the approval
    const approval = request.approvals.find((a) => a.id === approvalId)
    if (!approval) return undefined

    // Check if user can approve this request
    if (approval.userId !== user.id || approval.level !== request.currentLevel || request.status !== "pending") {
      console.log("Cannot approve:", {
        approvalUserId: approval.userId,
        userId: user.id,
        approvalLevel: approval.level,
        requestLevel: request.currentLevel,
        requestStatus: request.status,
      })
      return undefined
    }

    let updatedApproval: Approval | undefined

    setRequests((prev) => {
      const newRequests = prev.map((req) => {
        if (req.id === requestId) {
          const newApprovals = req.approvals.map((a) => {
            if (a.id === approvalId) {
              updatedApproval = {
                ...a,
                status,
                comments: comment,
                timestamp: new Date(),
              }
              return updatedApproval
            }
            return a
          })

          // Update request status based on approval
          let newStatus = req.status
          let newCurrentLevel = req.currentLevel

          if (status === "approved") {
            // Get all approvers at the current level
            const currentLevelApprovals = newApprovals.filter((a) => a.level === req.currentLevel)

            // Check if ALL approvers at the current level have approved
            const allCurrentLevelApproved = currentLevelApprovals.every((a) => a.status === "approved")

            console.log("Approval status check:", {
              currentLevel: req.currentLevel,
              currentLevelApprovals,
              allCurrentLevelApproved,
            })

            if (allCurrentLevelApproved) {
              // All approvers at this level have approved, move to next level
              const nextLevel = req.currentLevel + 1
              const hasNextLevel = newApprovals.some((a) => a.level === nextLevel)

              if (hasNextLevel) {
                // Move to next level
                newCurrentLevel = nextLevel
                console.log("Moving to next approval level:", {
                  from: req.currentLevel,
                  to: nextLevel,
                })
              } else {
                // No more levels, request is fully approved
                newStatus = "approved"
                console.log("Request fully approved")
              }
            } else {
              console.log("Waiting for other approvers at level", req.currentLevel)
            }
          } else if (status === "rejected") {
            // If rejected at any level, the whole request is rejected
            newStatus = "rejected"
            console.log("Request rejected")
          }

          // Add a comment about the approval/rejection
          const approvalComment: RequestComment = {
            id: `comment-${Date.now().toString(36)}-approval`,
            requestId,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            content: `${status === "approved" ? "Approved" : "Rejected"} the request at level ${req.currentLevel}${comment ? `: ${comment}` : ""}`,
            timestamp: new Date(),
          }

          return {
            ...req,
            approvals: newApprovals,
            status: newStatus,
            currentLevel: newCurrentLevel,
            comments: [...req.comments, approvalComment],
          }
        }
        return req
      })
      return newRequests
    })

    return updatedApproval
  }

  // Add an approver to a request
  const addApprover = (
    requestId: string,
    approverId: string,
    approverName: string,
    approverAvatar: string,
    approverPosition: string,
    approverLevel: number,
  ) => {
    let addedApproval: Approval | undefined

    setRequests((prev) => {
      return prev.map((req) => {
        if (req.id === requestId) {
          // Check if this approver is already added
          if (req.approvals.some((a) => a.userId === approverId)) {
            return req
          }

          // Create new approval with required fields
          const newApproval: Approval = {
            id: `approval-${requestId}-${Date.now().toString(36)}`,
            userId: approverId,
            userName: approverName,
            userAvatar: approverAvatar,
            userPosition: approverPosition,
            level: approverLevel,
            status: "pending", // Ensure status is set
          }

          addedApproval = newApproval

          // Sort approvals by level
          const newApprovals = [...req.approvals, newApproval].sort((a, b) => a.level - b.level)

          return {
            ...req,
            approvals: newApprovals,
          }
        }
        return req
      })
    })

    return addedApproval
  }

  // Remove an approver from a request
  const removeApprover = (requestId: string, approvalId: string) => {
    let removed = false

    setRequests((prev) => {
      const newRequests = prev.map((req) => {
        if (req.id === requestId) {
          // Only allow removal if request is in draft
          if (req.status !== "draft") return req

          const newApprovals = req.approvals.filter((approval) => {
            if (approval.id === approvalId) {
              removed = true
              return false
            }
            return true
          })

          return {
            ...req,
            approvals: newApprovals,
          }
        }
        return req
      })
      return newRequests
    })

    return removed
  }

  // Submit a request for approval
  const submitRequest = (id: string) => {
    let updatedRequest: RequestForm | undefined

    setRequests((prev) => {
      return prev.map((req) => {
        if (req.id === id) {
          // Can only submit if in draft status and has approvers
          if (req.status === "draft" && req.approvals.length > 0) {
            // Ensure all approvals have the required fields
            const validatedApprovals = req.approvals.map((approval, index) => {
              // Make sure each approval has an id
              const approvalId = approval.id || `approval-${id}-${index}-${Date.now().toString(36)}`

              // Make sure each approval has a status set to pending
              return {
                ...approval,
                id: approvalId,
                status: "pending" as ApprovalStatus,
              }
            })

            // Sort approvals by level to ensure proper flow
            const sortedApprovals = [...validatedApprovals].sort((a, b) => a.level - b.level)

            // Get the lowest approval level
            const firstLevel = sortedApprovals[0].level

            console.log("Submitting request:", {
              requestId: id,
              firstApprovalLevel: firstLevel,
              approvals: sortedApprovals,
            })

            updatedRequest = {
              ...req,
              status: "pending",
              currentLevel: firstLevel,
              approvals: sortedApprovals,
            }
            return updatedRequest
          }
        }
        return req
      })
    })

    return updatedRequest
  }

  // Cancel a request
  const cancelRequest = (id: string) => {
    let updatedRequest: RequestForm | undefined

    setRequests((prev) => {
      const newRequests = prev.map((req) => {
        if (req.id === id) {
          // Can only cancel if not already approved or rejected
          if (req.status !== "approved" && req.status !== "rejected") {
            // Only the requester can cancel
            if (user && req.requestedBy.id === user.id) {
              updatedRequest = {
                ...req,
                status: "cancelled",
              }
              return updatedRequest
            }
          }
        }
        return req
      })
      return newRequests
    })

    return updatedRequest
  }

  // Add this function to the RequestFormProvider component
  const clearAllData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("requestForms")
      setRequests([])
    }
  }

  // Save a user's custom pre-approver set
  const saveUserPreApproverSet = (set: PreApproverSet): boolean => {
    if (!user) return false

    try {
      // Get all pre-approver sets
      const savedSets = localStorage.getItem("preApproverSets")
      const allSets: PreApproverSet[] = savedSets ? JSON.parse(savedSets) : []

      // Check if this set already exists
      const existingIndex = allSets.findIndex((s) => s.id === set.id)

      if (existingIndex >= 0) {
        // Update existing set
        allSets[existingIndex] = set
      } else {
        // Add new set
        allSets.push(set)
      }

      // Save back to localStorage
      localStorage.setItem("preApproverSets", JSON.stringify(allSets))

      // Update state
      setUserPreApproverSets(getUserPreApproverSets(user.id))

      return true
    } catch (error) {
      console.error("Error saving pre-approver set:", error)
      return false
    }
  }

  // Delete a user's custom pre-approver set
  const deleteUserPreApproverSet = (setId: string): boolean => {
    if (!user) return false

    try {
      // Get all pre-approver sets
      const savedSets = localStorage.getItem("preApproverSets")
      let allSets: PreApproverSet[] = savedSets ? JSON.parse(savedSets) : []

      // Filter out the set to delete
      allSets = allSets.filter((s) => s.id !== setId)

      // Save back to localStorage
      localStorage.setItem("preApproverSets", JSON.stringify(allSets))

      // Update state
      setUserPreApproverSets(getUserPreApproverSets(user.id))

      return true
    } catch (error) {
      console.error("Error deleting pre-approver set:", error)
      return false
    }
  }

  // Get pre-approvers for a specific request type
  const getPreApproversForRequestType = (requestType: string): PreApproverSet[] => {
    // Get default admin-defined set
    const defaultSet = getDefaultPreApproverSetByType(requestType)

    // Get user's custom sets for this type
    const userSets = userPreApproverSets.filter((set) => set.requestType === requestType)

    return defaultSet ? [defaultSet, ...userSets] : userSets
  }

  // Add clearAllData to the context value
  return (
    <RequestFormContext.Provider
      value={{
        requests,
        userRequests,
        pendingApprovals,
        userPreApproverSets,
        getRequestById,
        createRequest,
        updateRequest,
        deleteRequest,
        addComment,
        updateApproval,
        addApprover,
        removeApprover,
        submitRequest,
        cancelRequest,
        canViewRequest,
        canApproveRequest,
        getAvailableApprovers,
        clearAllData,
        saveUserPreApproverSet,
        deleteUserPreApproverSet,
        getPreApproversForRequestType,
      }}
    >
      {children}
    </RequestFormContext.Provider>
  )
}

export function useRequestForms() {
  const context = useContext(RequestFormContext)
  if (context === undefined) {
    throw new Error("useRequestForms must be used within a RequestFormProvider")
  }
  return context
}

