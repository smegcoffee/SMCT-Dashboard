"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { tempUsers } from "@/lib/data/tempUsers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function UserManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterApprover, setFilterApprover] = useState<string>("all")
  const [hasChanges, setHasChanges] = useState(false)

  // Load users from localStorage or use tempUsers as fallback
  useEffect(() => {
    const loadUsers = () => {
      try {
        // Try to get users from localStorage first
        const savedUsers = localStorage.getItem("registeredUsers")
        let registeredUsers = savedUsers ? JSON.parse(savedUsers) : []

        // Format registered users to match tempUsers structure
        registeredUsers = registeredUsers.map((user: any) => ({
          id: user.employeeId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          avatar: "/placeholder.svg?height=40&width=40",
          role: user.position,
          department: user.branchCode,
          isApprover: user.isApprover || false,
          approverLevel: user.approverLevel || 0,
          ...user,
        }))

        // Combine with tempUsers
        const allUsers = [...tempUsers, ...registeredUsers]

        // Remove duplicates (in case a tempUser was also registered)
        const uniqueUsers = allUsers.filter(
          (user, index, self) => index === self.findIndex((u) => u.email === user.email),
        )

        setUsers(uniqueUsers)
        setFilteredUsers(uniqueUsers)
      } catch (error) {
        console.error("Error loading users:", error)
        setUsers(tempUsers)
        setFilteredUsers(tempUsers)
      }
    }

    loadUsers()
  }, [])

  // Filter users based on search query and approver filter
  useEffect(() => {
    let result = [...users]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query),
      )
    }

    // Apply approver filter
    if (filterApprover !== "all") {
      if (filterApprover === "approver") {
        result = result.filter((user) => user.isApprover)
      } else {
        result = result.filter((user) => !user.isApprover)
      }
    }

    setFilteredUsers(result)
  }, [searchQuery, filterApprover, users])

  // Toggle approver status
  const toggleApproverStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          // If turning off approver status, also reset approver level
          const approverLevel = !user.isApprover ? 1 : 0
          return {
            ...user,
            isApprover: !user.isApprover,
            approverLevel: !user.isApprover ? approverLevel : 0,
          }
        }
        return user
      }),
    )
    setHasChanges(true)
  }

  // Update approver level
  const updateApproverLevel = (userId: string, level: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          return { ...user, approverLevel: level }
        }
        return user
      }),
    )
    setHasChanges(true)
  }

  // Save changes
  const saveChanges = () => {
    try {
      // Update tempUsers in localStorage
      const registeredUsers = localStorage.getItem("registeredUsers")
      if (registeredUsers) {
        const parsedUsers = JSON.parse(registeredUsers)

        // Update registered users with new approver status
        const updatedRegisteredUsers = parsedUsers.map((regUser: any) => {
          const updatedUser = users.find((u) => u.email === regUser.email)
          if (updatedUser) {
            return {
              ...regUser,
              isApprover: updatedUser.isApprover,
              approverLevel: updatedUser.approverLevel,
            }
          }
          return regUser
        })

        localStorage.setItem("registeredUsers", JSON.stringify(updatedRegisteredUsers))
      }

      // Show success message
      toast({
        title: "Changes saved",
        description: "User approver settings have been updated successfully.",
        duration: 3000,
      })

      setHasChanges(false)
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage user approver settings</p>
          </div>
        </div>

        {hasChanges && (
          <Button onClick={saveChanges}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage which users can approve requests and their approval levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={filterApprover} onValueChange={setFilterApprover}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by approver status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="approver">Approvers Only</SelectItem>
                  <SelectItem value="non-approver">Non-Approvers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Switch checked={user.isApprover} onCheckedChange={() => toggleApproverStatus(user.id)} />
                        </TableCell>
                        <TableCell>
                          {user.isApprover ? (
                            <Select
                              value={user.approverLevel.toString()}
                              onValueChange={(value) => updateApproverLevel(user.id, Number.parseInt(value))}
                              disabled={!user.isApprover}
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Level 1</SelectItem>
                                <SelectItem value="2">Level 2</SelectItem>
                                <SelectItem value="3">Level 3</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="outline" className="bg-muted">
                              Not an approver
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

