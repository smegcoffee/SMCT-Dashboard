import { currentUser } from "./dummy-data"
import { tempUsers } from "./tempUsers"

// Request form status
export type RequestStatus = "draft" | "pending" | "approved" | "rejected" | "cancelled"

// Approval status for each approver
export type ApprovalStatus = "pending" | "approved" | "rejected"

// Approval level
export interface Approval {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userPosition: string
  level: number
  status: ApprovalStatus
  comments?: string
  timestamp?: Date
}

// Comment on a request
export interface RequestComment {
  id: string
  requestId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
}

// Request form
export interface RequestForm {
  id: string
  title: string
  description: string
  type: string
  requestedBy: {
    id: string
    name: string
    avatar: string
    position: string
  }
  department: string
  dateRequested: Date
  dateNeeded?: Date
  status: RequestStatus
  approvals: Approval[]
  attachments?: string[]
  comments: RequestComment[]
  currentLevel: number
  items?: RequestItem[]
}

// Request item (for requests with multiple items)
export interface RequestItem {
  id: string
  description: string
  quantity: number
  unit: string
  estimatedCost?: number
}

// Request types
export const requestTypes = [
  { value: "purchase", label: "Purchase Request" },
  { value: "travel", label: "Travel Request" },
  { value: "leave", label: "Leave Request" },
  { value: "reimbursement", label: "Reimbursement Request" },
  { value: "equipment", label: "Equipment Request" },
  { value: "other", label: "Other" },
]

// Get user data for approvers from tempUsers
const getApproverData = (userId: string) => {
  const user = tempUsers.find((u) => u.id === userId)
  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    position: user.position || user.role,
  }
}

// Sample users for approvals - now derived from tempUsers
export const approverUsers = tempUsers
  .filter((user) => user.isApprover)
  .map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    position: user.position || user.role,
  }))

// Sample request forms
export const sampleRequestForms: RequestForm[] = [
  {
    id: "req-001",
    title: "Office Supplies Requests",
    description: "Request for new office supplies for the IT departments",
    type: "purchase",
    requestedBy: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      position: currentUser.role,
    },
    department: "IT",
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    dateNeeded: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    status: "pending",
    currentLevel: 1,
    approvals: [
      {
        id: "approval-001-1",
        // userId: "user-3", // Team Supervisor
        userId: "user-3",
        userName: "Team Supervisor",
        userAvatar: "/placeholder.svg?height=40&width=40",
        userPosition: "Team Supervisor",
        level: 1,
        status: "pending",
      },
      {
        id: "approval-001-2",
        userId: "user-2", // Department Manager
        userName: "Department Manager",
        userAvatar: "/placeholder.svg?height=40&width=40",
        userPosition: "Department Manager",
        level: 2,
        status: "pending",
      },
    ],
    comments: [
      {
        id: "comment-001-1",
        requestId: "req-001",
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: "Please review this request as soon as possible.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      },
    ],
    items: [
      {
        id: "item-001-1",
        description: "Printer Paper (A4)",
        quantity: 10,
        unit: "ream",
        estimatedCost: 50,
      },
      {
        id: "item-001-2",
        description: "Ballpoint Pens",
        quantity: 20,
        unit: "box",
        estimatedCost: 40,
      },
      {
        id: "item-001-3",
        description: "Notebooks",
        quantity: 15,
        unit: "piece",
        estimatedCost: 75,
      },
    ],
  },
  {
    id: "req-002",
    title: "Business Trip to Conference",
    description: "Request for approval to attend the annual tech conference",
    type: "travel",
    requestedBy: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      position: currentUser.role,
    },
    department: "IT",
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    dateNeeded: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
    status: "approved",
    currentLevel: 3,
    approvals: [
      {
        id: "approval-002-1",
        userId: "user-3", // Team Supervisor
        userName: "Team Supervisor",
        userAvatar: "/placeholder.svg?height=40&width=40",
        userPosition: "Team Supervisor",
        level: 1,
        status: "approved",
        comments: "Approved. This conference is important for our team.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      },
      {
        id: "approval-002-2",
        userId: "user-2", // Department Manager
        userName: "Department Manager",
        userAvatar: "/placeholder.svg?height=40&width=40",
        userPosition: "Department Manager",
        level: 2,
        status: "approved",
        comments: "Budget approved for this trip.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
      {
        id: "approval-002-3",
        userId: "user-1", // Admin User
        userName: "Admin User",
        userAvatar: "/placeholder.svg?height=40&width=40",
        userPosition: "Administrator",
        level: 3,
        status: "approved",
        comments: "Final approval granted.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      },
    ],
    comments: [
      {
        id: "comment-002-1",
        requestId: "req-002",
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: "This conference has workshops on the new technologies we're planning to implement.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      },
      {
        id: "comment-002-2",
        requestId: "req-002",
        userId: "user-3",
        userName: "Team Supervisor",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content: "Please provide an estimate of the total costs including accommodation.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4.5), // 4.5 days ago
      },
      {
        id: "comment-002-3",
        requestId: "req-002",
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: "I've updated the request with the estimated costs. Total is approximately $2,500.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4.2), // 4.2 days ago
      },
    ],
    items: [
      {
        id: "item-002-1",
        description: "Flight Tickets",
        quantity: 1,
        unit: "round trip",
        estimatedCost: 800,
      },
      {
        id: "item-002-2",
        description: "Hotel Accommodation",
        quantity: 3,
        unit: "nights",
        estimatedCost: 600,
      },
      {
        id: "item-002-3",
        description: "Conference Registration",
        quantity: 1,
        unit: "person",
        estimatedCost: 700,
      },
      {
        id: "item-002-4",
        description: "Meals and Incidentals",
        quantity: 4,
        unit: "days",
        estimatedCost: 400,
      },
    ],
  },
  {
    id: "req-003",
    title: "Annual Leave Request",
    description: "Request for annual leave for family vacation",
    type: "leave",
    requestedBy: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      position: currentUser.role,
    },
    department: "IT",
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    dateNeeded: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    status: "rejected",
    currentLevel: 1,
    approvals: [
      {
        id: "approval-003-1",
        userId: "user-3", // Team Supervisor
        userName: "Team Supervisor",
        userAvatar: "/placeholder.svg?height=40&width=40",
        userPosition: "Team Supervisor",
        level: 1,
        status: "rejected",
        comments: "Cannot approve at this time due to upcoming project deadline.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
      },
    ],
    comments: [
      {
        id: "comment-003-1",
        requestId: "req-003",
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: "I've already booked the flights and accommodation for these dates.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      },
      {
        id: "comment-003-2",
        requestId: "req-003",
        userId: "user-3",
        userName: "Team Supervisor",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content: "I understand, but we have a critical project deadline during this period. Can you reschedule?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), // 9 days ago
      },
      {
        id: "comment-003-3",
        requestId: "req-003",
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: "I'll check if I can change the dates and submit a new request.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      },
    ],
  },
  {
    id: "req-004",
    title: "New Laptop Request",
    description: "Request for a new laptop as current one is showing performance issues",
    type: "equipment",
    requestedBy: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      position: currentUser.role,
    },
    department: "IT",
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    dateNeeded: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    status: "draft",
    currentLevel: 0,
    approvals: [],
    comments: [],
    items: [
      {
        id: "item-004-1",
        description: "Laptop (16GB RAM, 512GB SSD)",
        quantity: 1,
        unit: "piece",
        estimatedCost: 1500,
      },
      {
        id: "item-004-2",
        description: "Laptop Bag",
        quantity: 1,
        unit: "piece",
        estimatedCost: 50,
      },
    ],
  },
  {
    id: "req-005",
    title: "Rolex Watch Purchase",
    description: "Request for a new Rolex watch as a gift for the CEO",
    type: "equipment",
    requestedBy: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      position: currentUser.role,
    },
    department: "IT",
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    dateNeeded: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    status: "pending",
    currentLevel: 1,
    approvals: [
      {
        id: "approval-005-1",
        userId: "user-3", // Team Supervisor
        userName: "Team Supervisor",
        userAvatar: "/placeholder.svg?height=40&width=40",
        userPosition: "Team Supervisor",
        level: 1,
        status: "pending",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
      },
      {
        id: "approval-005-2",
        userId: "user-2", // Department Manager
        userName: "Department Manager",
        userAvatar: "/placeholder.svg?height=40&width=40",
        userPosition: "Department Manager",
        level: 2,
        status: "pending",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
      },
    ],
    comments: [],
    items: [
      {
        id: "item-005-1",
        description: "Rolex Submariner",
        quantity: 1,
        unit: "piece",
        estimatedCost: 10000,
      },
      {
        id: "item-005-2",
        description: "Gift Box",
        quantity: 1,
        unit: "piece",
        estimatedCost: 100,
      },
    ],
  },
]

// Function to get requests for a specific user (either as requester or approver)
export function getRequestsForUser(userId: string): RequestForm[] {
  return sampleRequestForms.filter(
    (request) => request.requestedBy.id === userId || request.approvals.some((approval) => approval.userId === userId),
  )
}

// Function to get requests that need approval from a specific user
export function getPendingApprovalsForUser(userId: string): RequestForm[] {
  return sampleRequestForms.filter(
    (request) =>
      request.status === "pending" &&
      request.approvals.some(
        (approval) =>
          approval.userId === userId && approval.status === "pending" && approval.level === request.currentLevel,
      ),
  )
}

