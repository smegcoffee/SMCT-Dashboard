"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { socketService } from "./socket-service"
import {
  notifications as initialNotifications,
  activities as initialActivities,
  announcements as initialAnnouncements,
} from "./data/dummy-data"

interface DataContextType {
  notifications: any[]
  activities: any[]
  announcements: any[]
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activities, setActivities] = useState(initialActivities)
  const [announcements, setAnnouncements] = useState(initialAnnouncements)

  useEffect(() => {
    // Initialize socket connection
    socketService.connect()

    // Set up event listeners
    const handleNewNotification = (notification: any) => {
      setNotifications((prev) => [notification, ...prev])
    }

    const handleNewActivity = (activity: any) => {
      setActivities((prev) => [activity, ...prev])
    }

    const handleNewAnnouncement = (announcement: any) => {
      setAnnouncements((prev) => [announcement, ...prev])
    }

    socketService.on("notification", handleNewNotification)
    socketService.on("activity", handleNewActivity)
    socketService.on("announcement", handleNewAnnouncement)

    return () => {
      socketService.off("notification", handleNewNotification)
      socketService.off("activity", handleNewActivity)
      socketService.off("announcement", handleNewAnnouncement)
      socketService.disconnect()
    }
  }, [])

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  return (
    <DataContext.Provider
      value={{
        notifications,
        activities,
        announcements,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

