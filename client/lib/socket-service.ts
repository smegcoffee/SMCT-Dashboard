import { notifications, activities, announcements } from "./data/dummy-data"

// This is a mock socket service for demonstration
// In a real application, you would connect to your actual socket.io server
class SocketService {
  private socket: any = null
  private listeners: Record<string, Function[]> = {
    notification: [],
    activity: [],
    announcement: [],
  }
  private intervals: NodeJS.Timeout[] = []

  connect() {
    if (typeof window === "undefined") return

    // In a real app, you would connect to your actual server
    // this.socket = io("https://your-socket-server.com");

    console.log("Socket service initialized (mock)")

    // Simulate receiving notifications every 30 seconds
    this.intervals.push(
      setInterval(() => {
        this.simulateNewNotification()
      }, 30000),
    )

    // Simulate receiving activities every 45 seconds
    this.intervals.push(
      setInterval(() => {
        this.simulateNewActivity()
      }, 45000),
    )

    // Simulate receiving announcements every 2 minutes
    this.intervals.push(
      setInterval(() => {
        this.simulateNewAnnouncement()
      }, 120000),
    )
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }

    // Clear all intervals
    this.intervals.forEach((interval) => clearInterval(interval))
    this.intervals = []
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
  }

  private emit(event: string, data: any) {
    if (!this.listeners[event]) return
    this.listeners[event].forEach((callback) => callback(data))
  }

  // Mock methods to simulate real-time events
  private simulateNewNotification() {
    const randomNotif = notifications[Math.floor(Math.random() * notifications.length)]
    const newNotif = {
      ...randomNotif,
      id: `notif-${Date.now()}`,
      date: new Date(),
      read: false,
    }
    this.emit("notification", newNotif)
  }

  private simulateNewActivity() {
    const randomActivity = activities[Math.floor(Math.random() * activities.length)]
    const newActivity = {
      ...randomActivity,
      id: `activity-${Date.now()}`,
      date: new Date(),
    }
    this.emit("activity", newActivity)
  }

  private simulateNewAnnouncement() {
    const randomAnnounce = announcements[Math.floor(Math.random() * announcements.length)]
    const newAnnounce = {
      ...randomAnnounce,
      id: `announce-${Date.now()}`,
      date: new Date(),
    }
    this.emit("announcement", newAnnounce)
  }
}

export const socketService = new SocketService()

