"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Home,
  LogOut,
  MessageSquare,
  Ticket,
  FileText,
  Users,
  Calendar,
  File,
  Briefcase,
  BarChart,
  Settings,
  ClipboardList,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRequestForms } from "@/lib/request-form-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { applications } from "@/lib/data/dummy-data"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { notifications } = useData()
  const { pendingApprovals } = useRequestForms()

  const unreadCount = notifications.filter((n) => !n.read).length
  const pendingApprovalsCount = pendingApprovals.length

  // Group applications by category
  const appGroups = {
    Communication: applications.filter((app) => ["Chat"].includes(app.name)),
    Support: applications.filter((app) => ["Ticketing"].includes(app.name)),
    Forms: applications.filter((app) => ["Request Forms"].includes(app.name)),
    "HR & Admin": applications.filter((app) => ["HR Portal", "Attendance"].includes(app.name)),
    Resources: applications.filter((app) => ["Document Library", "Projects", "Analytics"].includes(app.name)),
  }

  // Map icon names to Lucide icons
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      "message-square": <MessageSquare className="h-5 w-5" />,
      ticket: <Ticket className="h-5 w-5" />,
      "file-text": <FileText className="h-5 w-5" />,
      users: <Users className="h-5 w-5" />,
      calendar: <Calendar className="h-5 w-5" />,
      file: <File className="h-5 w-5" />,
      briefcase: <Briefcase className="h-5 w-5" />,
      "bar-chart": <BarChart className="h-5 w-5" />,
    }

    return icons[iconName] || <File className="h-5 w-5" />
  }

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">SMCT</span>
          </div> */}
          <div className="font-semibold">SMCT Portal</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/notifications"}>
                  <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}

              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/requests")}>
                  <Link href="/requests">
                    <ClipboardList className="h-5 w-5" />
                    <span>Requests</span>
                    {pendingApprovalsCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {pendingApprovalsCount}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Applications Groups */}
        {/* {Object.entries(appGroups).map(([groupName, apps]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {apps.map((app) => (
                  <SidebarMenuItem key={app.id}>
                    <SidebarMenuButton asChild isActive={pathname === app.url}>
                      <Link href={app.url}>
                        {getIcon(app.icon)}
                        <span>{app.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))} */}
        {Object.entries(appGroups).map(([groupName, apps]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {apps.map((app) => {
                  const isDisabledApp = [
                    "Chat",
                    "Ticketing",
                    "HR Portal",
                    "Attendance",
                    "Document Library",
                    "Projects",
                    "Analytics",
                  ].includes(app.name)

                  return (
                    <SidebarMenuItem key={app.id}>
                      {isDisabledApp ? (
                        <SidebarMenuButton className="cursor-not-allowed opacity-50">
                          {getIcon(app.icon)}
                          <span>{app.name}</span>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton asChild isActive={pathname === app.url}>
                          <Link href={app.url}>
                            {getIcon(app.icon)}
                            <span>{app.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}



        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

