// User data
export const currentUser = {
  id: "user-1",
  name: "Janie Doesage",
  email: "janie.sins@gmail.com",
  avatar: "/placeholder-avatar.png?height=40&width=40",
  role: "Administrator",
  department: "IT",
}

// Notifications
export const notifications = [
  {
    id: "notif-1",
    title: "System Maintenance",
    message: "Scheduled maintenance tonight at 10 PM",
    date: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    type: "system",
  },
  {
    id: "notif-2",
    title: "New Request",
    message: "You have a new approval request from Jane Macarayan",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    type: "request",
  },
  {
    id: "notif-3",
    title: "Meeting Reminder",
    message: "Team meeting in 15 minutes",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    type: "calendar",
  },
  {
    id: "notif-4",
    title: "Document Updated",
    message: "OKR report has been updated",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    type: "document",
  },
  {
    id: "notif-5",
    title: "New Message",
    message: "You have 3 unread messages",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    read: true,
    type: "message",
  },
]

// Activities
export const activities = [
  {
    id: "activity-1",
    user: {
      name: "Jane Macarayan",
      avatar: "/placeholder-avatar.png?height=40&width=40",
    },
    action: "submitted a new request",
    target: "Keyboard Replacement",
    date: new Date(Date.now() - 1000 * 60 * 15),
    type: "request",
  },
  {
    id: "activity-2",
    user: {
      name: "Reggie Sins",
      avatar: "/placeholder-avatar.png?height=40&width=40",
    },
    action: "approved",
    target: "PO #1234 (PC Set",
    date: new Date(Date.now() - 1000 * 60 * 45),
    type: "approval",
  },
  {
    id: "activity-3",
    user: {
      name: "Janice Legaspi",
      avatar: "/placeholder-avatar.png?height=40&width=40",
    },
    action: "commented on",
    target: "Project Netsuite",
    date: new Date(Date.now() - 1000 * 60 * 60),
    type: "comment",
  },
  {
    id: "activity-4",
    user: {
      name: "Robert Kin Gohil",
      avatar: "/placeholder-avatar.png?height=40&width=40",
    },
    action: "uploaded",
    target: "Netsuite Report",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3),
    type: "document",
  },
  {
    id: "activity-5",
    user: {
      name: "Eva Marie Masana",
      avatar: "/placeholder-avatar.png?height=40&width=40",
    },
    action: "created",
    target: "New Project Proposal",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5),
    type: "project",
  },
]

// Announcements
export const announcements = [
  {
    id: "announce-1",
    title: "Pricing Update",
    content:
      "Motorcycle prices will increase by 5% starting next month. Please inform your customers.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    author: "Pricing Department",
    important: true,
  },
  {
    id: "announce-2",
    title: "HMO Benefits Update",
    content: "We're excited to announce enhanced health benefits starting next month. Check your email for details.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    author: "Benefits Team",
    important: true,
  },
  {
    id: "announce-3",
    title: "Office Renovation",
    content: "The 3rd floor will be under renovation from July 15-30. Please plan accordingly.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    author: "Construction Team",
    important: false,
  },
  {
    id: "announce-4",
    title: "Quarterly Results",
    content: "Q2 results exceeded expectations. Great job everyone! Details in the attached report.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    author: "Executive Team",
    important: false,
  },
]

// Applications
export const applications = [
  {
    id: "app-1",
    name: "Chat",
    description: "Internal messaging platform",
    icon: "message-square",
    url: "/apps/chat",
    color: "bg-blue-500",
  },
  {
    id: "app-2",
    name: "Ticketing",
    description: "IT support and service requests",
    icon: "ticket",
    url: "/apps/ticketing",
    color: "bg-purple-500",
  },
  {
    id: "app-3",
    name: "Request Forms",
    description: "Submit various company requests",
    icon: "file-text",
    url: "/requests",
    color: "bg-green-500",
  },
  {
    id: "app-4",
    name: "HR Portal",
    description: "HR services and information",
    icon: "users",
    url: "/apps/hr",
    color: "bg-yellow-500",
  },
  {
    id: "app-5",
    name: "Attendance",
    description: "Time tracking and attendance",
    icon: "calendar",
    url: "/apps/attendance",
    color: "bg-red-500",
  },
  {
    id: "app-6",
    name: "Document Library",
    description: "Company documents and resources",
    icon: "file",
    url: "/apps/documents",
    color: "bg-indigo-500",
  },
  {
    id: "app-7",
    name: "Projects",
    description: "Project management and tracking",
    icon: "briefcase",
    url: "/apps/projects",
    color: "bg-pink-500",
  },
  {
    id: "app-8",
    name: "Analytics",
    description: "Business intelligence dashboards",
    icon: "bar-chart",
    url: "/apps/analytics",
    color: "bg-cyan-500",
  },
]

