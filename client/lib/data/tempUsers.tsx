// Temporary users for testing
export const tempUsers = [
  {
    id: "user-1",
    email: "admin@example.com",
    password: "123456",
    firstName: "Admin",
    lastName: "User",
    name: "Admin User",
    username: "admin",
    employeeId: "ADMN-12345678",
    position: "Administrator",
    role: "Administrator",
    department: "IT",
    branchCode: "dsmt",
    contact: "+639123456789",
    signature: "",
    avatar: "/placeholder.svg?height=40&width=40",
    isApprover: true,
    approverLevel: 3, // High-level approver (final approval)
  },
  {
    id: "user-2",
    email: "manager@example.com",
    password: "123456",
    firstName: "Department",
    lastName: "Manager",
    name: "Department Manager",
    username: "manager",
    employeeId: "MNGR-87654321",
    position: "Department Manager",
    role: "Department Manager",
    department: "Finance",
    branchCode: "loay",
    contact: "+639234567890",
    signature: "",
    avatar: "/placeholder.svg?height=40&width=40",
    isApprover: true,
    approverLevel: 2, // Mid-level approver
  },
  {
    id: "user-3",
    email: "supervisor@example.com",
    password: "123456",
    firstName: "Team",
    lastName: "Supervisor",
    name: "Team Supervisor",
    username: "supervisor",
    employeeId: "SPRV-23456789",
    position: "Team Supervisor",
    role: "Team Supervisor",
    department: "Operations",
    branchCode: "valen",
    contact: "+639345678901",
    signature: "",
    avatar: "/placeholder.svg?height=40&width=40",
    isApprover: true,
    approverLevel: 1, // First-level approver
  },
  {
    id: "user-4",
    email: "user@example.com",
    password: "123456",
    firstName: "Regular",
    lastName: "User",
    name: "Regular User",
    username: "user",
    employeeId: "USER-34567890",
    position: "Staff",
    role: "Staff",
    department: "HR",
    branchCode: "carmb",
    contact: "+639456789012",
    signature: "",
    avatar: "/placeholder.svg?height=40&width=40",
    isApprover: false,
    approverLevel: 0, // Not an approver
  },
  {
    id: "user-5",
    email: "employee@example.com",
    password: "123456",
    firstName: "Junior",
    lastName: "Employee",
    name: "Junior Employee",
    username: "employee",
    employeeId: "EMPL-45678901",
    position: "Junior Staff",
    role: "Junior Staff",
    department: "Marketing",
    branchCode: "dsmt",
    contact: "+639567890123",
    signature: "",
    avatar: "/placeholder.svg?height=40&width=40",
    isApprover: false,
    approverLevel: 0, // Not an approver
  },
  {
    id: "user-6",
    email: "dario@example.com",
    password: "123456",
    firstName: "Dario",
    lastName: "Toston",
    name: "Dario Toston",
    username: "teamlead",
    employeeId: "LEAD-56789012",
    position: "Team Supervisor",
    role: "Team Supervisor",
    department: "Sales",
    branchCode: "dsmt",
    contact: "+639678901234",
    signature: "",
    avatar: "/placeholder.svg?height=40&width=40",
    isApprover: true,
    approverLevel: 1, // First-level approver
  },
]

// Function to get all approvers
export function getApprovers() {
  return tempUsers.filter((user) => user.isApprover)
}

// Function to get approvers by level
export function getApproversByLevel(level: number) {
  return tempUsers.filter((user) => user.isApprover && user.approverLevel === level)
}

// Function to get user by ID
export function getUserById(id: string) {
  return tempUsers.find((user) => user.id === id)
}

