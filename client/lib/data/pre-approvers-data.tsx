// Types for pre-approvers
export interface PreApprover {
    userId: string
    userName: string
    userAvatar: string
    userPosition: string
    level: number
  }
  
  export interface PreApproverSet {
    id: string
    name: string
    description?: string
    requestType: string
    approvers: PreApprover[]
    isDefault: boolean
    createdBy: string // userId
    isGlobal: boolean // true for admin-created, false for user-created
  }
  
  // Sample pre-approver sets (admin-defined)
  export const samplePreApproverSets: PreApproverSet[] = [
    {
      id: "pre-app-001",
      name: "Standard Travel Request Approvers",
      description: "Default approvers for travel requests",
      requestType: "travel",
      approvers: [
        {
          userId: "user-3", // Team Supervisor
          userName: "Team Supervisor",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Team Supervisor",
          level: 1,
        },
        {
          userId: "user-2", // Department Manager
          userName: "Department Manager",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Department Manager",
          level: 2,
        },
      ],
      isDefault: true,
      createdBy: "user-1", // Admin
      isGlobal: true,
    },
    {
      id: "pre-app-002",
      name: "Standard Purchase Request Approvers",
      description: "Default approvers for purchase requests",
      requestType: "purchase",
      approvers: [
        {
          userId: "user-3", // Team Supervisor
          userName: "Team Supervisor",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Team Supervisor",
          level: 1,
        },
        {
          userId: "user-2", // Department Manager
          userName: "Department Manager",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Department Manager",
          level: 2,
        },
        {
          userId: "user-1", // Admin
          userName: "Admin User",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Administrator",
          level: 3,
        },
      ],
      isDefault: true,
      createdBy: "user-1", // Admin
      isGlobal: true,
    },
    {
      id: "pre-app-003",
      name: "Standard Leave Request Approvers",
      description: "Default approvers for leave requests",
      requestType: "leave",
      approvers: [
        {
          userId: "user-3", // Team Supervisor
          userName: "Team Supervisor",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Team Supervisor",
          level: 1,
        },
        {
          userId: "user-2", // Department Manager
          userName: "Department Manager",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userPosition: "Department Manager",
          level: 2,
        },
      ],
      isDefault: true,
      createdBy: "user-1", // Admin
      isGlobal: true,
    },
  ]
  
  // Helper functions
  export function getPreApproverSets(): PreApproverSet[] {
    if (typeof window === "undefined") return []
  
    try {
      const savedSets = localStorage.getItem("preApproverSets")
      if (savedSets) {
        return JSON.parse(savedSets)
      }
  
      // Initialize with sample data if nothing exists
      localStorage.setItem("preApproverSets", JSON.stringify(samplePreApproverSets))
      return samplePreApproverSets
    } catch (error) {
      console.error("Error loading pre-approver sets:", error)
      return []
    }
  }
  
  export function savePreApproverSets(sets: PreApproverSet[]): boolean {
    if (typeof window === "undefined") return false
  
    try {
      localStorage.setItem("preApproverSets", JSON.stringify(sets))
      return true
    } catch (error) {
      console.error("Error saving pre-approver sets:", error)
      return false
    }
  }
  
  export function getPreApproverSetsByType(requestType: string): PreApproverSet[] {
    const sets = getPreApproverSets()
    return sets.filter((set) => set.requestType === requestType)
  }
  
  export function getDefaultPreApproverSetByType(requestType: string): PreApproverSet | undefined {
    const sets = getPreApproverSets()
    return sets.find((set) => set.requestType === requestType && set.isDefault)
  }
  
  export function getUserPreApproverSets(userId: string): PreApproverSet[] {
    const sets = getPreApproverSets()
    return sets.filter((set) => set.createdBy === userId && !set.isGlobal)
  }
  
  