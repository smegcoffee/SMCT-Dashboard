"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { tempUsers } from "@/lib/data/tempUsers"
import { requestTypes } from "@/lib/data/request-forms-data"
import { type PreApproverSet, getPreApproverSets, savePreApproverSets } from "@/lib/data/pre-approvers-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, Trash2, Edit, X, Users, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useToast } from "@/components/ui/use-toast"

export default function PreApproversPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [preApproverSets, setPreApproverSets] = useState<PreApproverSet[]>([])
  const [activeTab, setActiveTab] = useState("travel")
  const [editingSet, setEditingSet] = useState<PreApproverSet | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [availableApprovers, setAvailableApprovers] = useState<any[]>([])

  // Load pre-approver sets and available approvers
  useEffect(() => {
    // Load pre-approver sets
    const loadedSets = getPreApproverSets()
    setPreApproverSets(loadedSets)

    // Load available approvers (users with isApprover=true)
    const approvers = tempUsers.filter((user) => user.isApprover)
    setAvailableApprovers(approvers)
  }, [])

  // Filter sets by request type for the active tab
  const filteredSets = preApproverSets.filter((set) => set.requestType === activeTab && set.isGlobal)

  // Create a new pre-approver set
  const createNewSet = () => {
    if (!user) return

    const newSet: PreApproverSet = {
      id: `pre-app-${Date.now().toString(36)}`,
      name: `New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Approver Set`,
      description: "",
      requestType: activeTab,
      approvers: [],
      isDefault: false,
      createdBy: user.id,
      isGlobal: true,
    }

    setPreApproverSets([...preApproverSets, newSet])
    setEditingSet(newSet)
    setIsEditing(true)

    toast({
      title: "New approver set created",
      description: "Configure the approvers and save your changes.",
      duration: 3000,
    })
  }

  // Save changes to a pre-approver set
  const saveSet = (set: PreApproverSet) => {
    const updatedSets = preApproverSets.map((s) => (s.id === set.id ? set : s))

    // If this set is marked as default, remove default from other sets of same type
    if (set.isDefault) {
      updatedSets.forEach((s) => {
        if (s.id !== set.id && s.requestType === set.requestType && s.isGlobal) {
          s.isDefault = false
        }
      })
    }

    setPreApproverSets(updatedSets)
    savePreApproverSets(updatedSets)
    setEditingSet(null)
    setIsEditing(false)

    toast({
      title: "Changes saved",
      description: "Pre-approver set has been updated successfully.",
      duration: 3000,
    })
  }

  // Delete a pre-approver set
  const deleteSet = (setId: string) => {
    const updatedSets = preApproverSets.filter((s) => s.id !== setId)
    setPreApproverSets(updatedSets)
    savePreApproverSets(updatedSets)

    toast({
      title: "Set deleted",
      description: "Pre-approver set has been deleted.",
      duration: 3000,
    })
  }

  // Add an approver to the editing set
  const addApprover = (approverId: string) => {
    if (!editingSet) return

    const approver = availableApprovers.find((a) => a.id === approverId)
    if (!approver) return

    // Check if already added
    if (editingSet.approvers.some((a) => a.userId === approverId)) {
      toast({
        title: "Approver already added",
        description: "This approver is already in the set.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Determine level (use approver's level or next available level)
    const level =
      approver.approverLevel ||
      (editingSet.approvers.length > 0 ? Math.max(...editingSet.approvers.map((a) => a.level)) + 1 : 1)

    const newApprover = {
      userId: approver.id,
      userName: approver.name,
      userAvatar: approver.avatar,
      userPosition: approver.position || approver.role,
      level,
    }

    const updatedSet = {
      ...editingSet,
      approvers: [...editingSet.approvers, newApprover],
    }

    setEditingSet(updatedSet)
  }

  // Remove an approver from the editing set
  const removeApprover = (userId: string) => {
    if (!editingSet) return

    const updatedSet = {
      ...editingSet,
      approvers: editingSet.approvers.filter((a) => a.userId !== userId),
    }

    setEditingSet(updatedSet)
  }

  // Update approver level
  const updateApproverLevel = (userId: string, level: number) => {
    if (!editingSet) return

    const updatedSet = {
      ...editingSet,
      approvers: editingSet.approvers.map((a) => (a.userId === userId ? { ...a, level } : a)),
    }

    setEditingSet(updatedSet)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pre-Approvers</h1>
            <p className="text-muted-foreground">Configure default approvers for different request types</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="travel" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {requestTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {requestTypes.map((type) => (
          <TabsContent key={type.value} value={type.value} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{type.label} Pre-Approvers</h2>
              <Button onClick={createNewSet} disabled={isEditing}>
                <Plus className="mr-2 h-4 w-4" /> Add New Set
              </Button>
            </div>

            {filteredSets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Users className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No pre-approver sets defined for this request type</p>
                  <Button onClick={createNewSet}>
                    <Plus className="mr-2 h-4 w-4" /> Create First Set
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredSets.map((set) => (
                  <Card key={set.id} className={editingSet?.id === set.id ? "border-primary" : ""}>
                    <CardHeader className="pb-2">
                      {editingSet?.id === set.id ? (
                        <div className="space-y-2">
                          <Label htmlFor="setName">Set Name</Label>
                          <Input
                            id="setName"
                            value={editingSet.name}
                            onChange={(e) => setEditingSet({ ...editingSet, name: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{set.name}</CardTitle>
                          {set.isDefault && <Badge className="bg-primary">Default</Badge>}
                        </div>
                      )}

                      {editingSet?.id === set.id ? (
                        <div className="space-y-2">
                          <Label htmlFor="setDescription">Description</Label>
                          <Textarea
                            id="setDescription"
                            value={editingSet.description || ""}
                            onChange={(e) => setEditingSet({ ...editingSet, description: e.target.value })}
                          />
                        </div>
                      ) : (
                        <CardDescription>{set.description}</CardDescription>
                      )}
                    </CardHeader>

                    <CardContent>
                      {editingSet?.id === set.id ? (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={editingSet.isDefault}
                              onCheckedChange={(checked) => setEditingSet({ ...editingSet, isDefault: checked })}
                            />
                            <Label>Set as default for {type.label}</Label>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Approvers</Label>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <UserPlus className="mr-2 h-4 w-4" /> Add Approver
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Approver</DialogTitle>
                                    <DialogDescription>Select an approver to add to this set.</DialogDescription>
                                  </DialogHeader>

                                  <div className="py-4">
                                    <Select onValueChange={addApprover}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an approver" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableApprovers.map((approver) => (
                                          <SelectItem key={approver.id} value={approver.id}>
                                            {approver.name} - {approver.role} (Level {approver.approverLevel})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>

                            {editingSet.approvers.length > 0 ? (
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Approver</TableHead>
                                      <TableHead>Level</TableHead>
                                      <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {editingSet.approvers
                                      .sort((a, b) => a.level - b.level)
                                      .map((approver) => (
                                        <TableRow key={approver.userId}>
                                          <TableCell>
                                            <div className="flex items-center gap-2">
                                              <Avatar className="h-8 w-8">
                                                <AvatarImage src={approver.userAvatar} alt={approver.userName} />
                                                <AvatarFallback>{approver.userName.charAt(0)}</AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <div className="font-medium">{approver.userName}</div>
                                                <div className="text-xs text-muted-foreground">
                                                  {approver.userPosition}
                                                </div>
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <Select
                                              value={approver.level.toString()}
                                              onValueChange={(value) =>
                                                updateApproverLevel(approver.userId, Number.parseInt(value))
                                              }
                                            >
                                              <SelectTrigger className="w-[80px]">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="1">Level 1</SelectItem>
                                                <SelectItem value="2">Level 2</SelectItem>
                                                <SelectItem value="3">Level 3</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </TableCell>
                                          <TableCell>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => removeApprover(approver.userId)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-20 border rounded-md bg-muted/50">
                                <p className="text-sm text-muted-foreground">No approvers added yet</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Approvers:</h3>
                          {set.approvers.length > 0 ? (
                            <div className="space-y-2">
                              {set.approvers
                                .sort((a, b) => a.level - b.level)
                                .map((approver) => (
                                  <div key={approver.userId} className="flex items-center gap-2 p-2 border rounded-md">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                      {approver.level}
                                    </div>
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={approver.userAvatar} alt={approver.userName} />
                                      <AvatarFallback>{approver.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{approver.userName}</p>
                                      <p className="text-xs text-muted-foreground">{approver.userPosition}</p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-20 border rounded-md bg-muted/50">
                              <p className="text-sm text-muted-foreground">No approvers defined</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                      {editingSet?.id === set.id ? (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingSet(null)
                              setIsEditing(false)
                            }}
                          >
                            <X className="mr-2 h-4 w-4" /> Cancel
                          </Button>
                          <Button onClick={() => saveSet(editingSet)}>
                            <Save className="mr-2 h-4 w-4" /> Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Pre-Approver Set</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this pre-approver set? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteSet(set.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingSet(set)
                              setIsEditing(true)
                            }}
                            disabled={isEditing}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

