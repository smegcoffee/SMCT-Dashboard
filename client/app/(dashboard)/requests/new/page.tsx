"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRequestForms } from "@/lib/request-form-context"
import { useAuth } from "@/lib/auth-context"
import { requestTypes } from "@/lib/data/request-forms-data"
import { tempUsers } from "@/lib/data/tempUsers"
import type { PreApproverSet } from "@/lib/data/pre-approvers-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Calendar, Save, Send, ArrowLeft, X, UserPlus, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function NewRequestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createRequest, submitRequest, getPreApproversForRequestType, saveUserPreApproverSet, userPreApproverSets } =
    useRequestForms()
  const { toast } = useToast()

  // Get all available users for approver selection
  const allUsers = tempUsers.filter((u) => u.isApprover && u.id !== user?.id)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "purchase",
    department: user?.department || "",
    dateNeeded: "",
    approvals: [] as any[],
    items: [{ id: `item-${Date.now()}`, description: "", quantity: 1, unit: "", estimatedCost: 0 }],
  })

  // Pre-approver sets for the current request type
  const [preApproverSets, setPreApproverSets] = useState<PreApproverSet[]>([])
  const [selectedPreApproverSet, setSelectedPreApproverSet] = useState<string>("")
  const [saveApproverSetDialogOpen, setSaveApproverSetDialogOpen] = useState(false)
  const [newApproverSetName, setNewApproverSetName] = useState("")
  const [newApproverSetDescription, setNewApproverSetDescription] = useState("")
  const [activeTab, setActiveTab] = useState<"details" | "approvers">("details")

  const [submitting, setSubmitting] = useState(false)

  // Load pre-approver sets when request type changes
  useEffect(() => {
    if (formData.type) {
      const sets = getPreApproversForRequestType(formData.type)
      setPreApproverSets(sets)

      // Reset selected set
      setSelectedPreApproverSet("")
    }
  }, [formData.type, getPreApproversForRequestType])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle item change
  const handleItemChange = (id: string, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  // Add new item
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { id: `item-${Date.now()}`, description: "", quantity: 1, unit: "", estimatedCost: 0 }],
    }))
  }

  // Remove item
  const removeItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  // Add approver
  const addApprover = (approverId: string) => {
    const approver = allUsers.find((user) => user.id === approverId)
    if (!approver) return

    // Check if already added
    if (formData.approvals.some((a) => a.userId === approverId)) return

    setFormData((prev) => ({
      ...prev,
      approvals: [
        ...prev.approvals,
        {
          userId: approver.id,
          userName: approver.name,
          userAvatar: approver.avatar,
          userPosition: approver.position || approver.role,
          level: approver.approverLevel || 1,
        },
      ],
    }))
  }

  // Remove approver
  const removeApprover = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      approvals: prev.approvals.filter((a) => a.userId !== userId),
    }))
  }

  // Apply pre-approver set
  const applyPreApproverSet = (setId: string) => {
    if (setId === "none") {
      // Clear approvals if "None" is selected
      setFormData((prev) => ({
        ...prev,
        approvals: [],
      }))
      setSelectedPreApproverSet("none")
      return
    }

    const set = preApproverSets.find((s) => s.id === setId)
    if (!set) return

    // Replace current approvals with the ones from the set
    setFormData((prev) => ({
      ...prev,
      approvals: [...set.approvers],
    }))

    setSelectedPreApproverSet(setId)

    toast({
      title: "Pre-approvers applied",
      description: `Applied approvers from "${set.name}"`,
      duration: 3000,
    })
  }

  // Save current approvers as a new set
  const saveCurrentApproversAsSet = () => {
    if (!user || formData.approvals.length === 0 || !newApproverSetName) return

    const newSet: PreApproverSet = {
      id: `pre-app-user-${Date.now().toString(36)}`,
      name: newApproverSetName,
      description: newApproverSetDescription,
      requestType: formData.type,
      approvers: [...formData.approvals],
      isDefault: false,
      createdBy: user.id,
      isGlobal: false, // User-created sets are not global
    }

    const success = saveUserPreApproverSet(newSet)

    if (success) {
      toast({
        title: "Approver set saved",
        description: `Your custom approver set "${newSet.name}" has been saved.`,
        duration: 3000,
      })

      // Update local state
      setPreApproverSets((prev) => [...prev, newSet])
      setSelectedPreApproverSet(newSet.id)

      // Reset form
      setNewApproverSetName("")
      setNewApproverSetDescription("")
      setSaveApproverSetDialogOpen(false)
    } else {
      toast({
        title: "Error saving approver set",
        description: "There was a problem saving your approver set.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, asDraft = true) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Please enter a title for the request")
      return
    }

    setSubmitting(true)

    try {
      // Format items
      const formattedItems = formData.items
        .filter((item) => item.description.trim() !== "")
        .map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          estimatedCost: Number(item.estimatedCost),
        }))

      // Sort approvals by level
      const formattedApprovals = [...formData.approvals].sort((a, b) => a.level - b.level)

      // Create request
      const newRequest = createRequest({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        requestedBy: {
          id: user?.id || "",
          name: user?.name || "",
          avatar: user?.avatar || "",
          position: user?.role || "",
        },
        department: formData.department,
        dateNeeded: formData.dateNeeded ? new Date(formData.dateNeeded) : undefined,
        approvals: formattedApprovals,
        items: formattedItems,
      })

      // If not saving as draft, submit immediately
      if (!asDraft && newRequest.approvals.length > 0) {
        submitRequest(newRequest.id)
      }

      // Redirect to the new request
      router.push(`/requests/${newRequest.id}`)
    } catch (error) {
      console.error("Error creating request:", error)
      alert("An error occurred while creating the request")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/requests")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">New Request</h1>
        </div>
      </div>

      <Tabs
        defaultValue="details"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "details" | "approvers")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="details">Request Details</TabsTrigger>
          <TabsTrigger value="approvers">Approvers</TabsTrigger>
        </TabsList>

        <form onSubmit={(e) => handleSubmit(e, true)}>
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>Fill in the details of your request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a title for your request"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about your request"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Request Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {requestTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Enter department"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateNeeded">Date Needed</Label>
                    <div className="relative">
                      <Input
                        id="dateNeeded"
                        name="dateNeeded"
                        type="date"
                        value={formData.dateNeeded}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
                <CardDescription>Add items to your request</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Est. Cost</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.unit}
                            onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                            placeholder="Unit"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.estimatedCost}
                            onChange={(e) => handleItemChange(item.id, "estimatedCost", e.target.value)}
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={formData.items.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push("/requests")}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save className="mr-2 h-4 w-4" /> Save as Draft
              </Button>
              <Button type="button" onClick={() => setActiveTab("approvers")}>
                Next: Add Approvers
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="approvers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle>Approvers</CardTitle>
                      <CardDescription>Add people who need to approve this request</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserPlus className="mr-2 h-4 w-4" /> Add Approver
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Approver</DialogTitle>
                          <DialogDescription>Select an approver to add to this request.</DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                          <Select onValueChange={addApprover}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an approver" />
                            </SelectTrigger>
                            <SelectContent>
                              {allUsers.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name} - {user.position || user.role} (Level {user.approverLevel})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {formData.approvals.length > 0 ? (
                      <div className="space-y-2">
                        {formData.approvals
                          .sort((a, b) => a.level - b.level) // Sort by level
                          .map((approval, index) => (
                            <div
                              key={approval.userId}
                              className="flex items-center justify-between p-2 border rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                  {approval.level}
                                </div>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={approval.userAvatar} alt={approval.userName} />
                                  <AvatarFallback>{approval.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{approval.userName}</p>
                                  <p className="text-xs text-muted-foreground">{approval.userPosition}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeApprover(approval.userId)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No approvers added yet</div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Dialog open={saveApproverSetDialogOpen} onOpenChange={setSaveApproverSetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" disabled={formData.approvals.length === 0}>
                          <Save className="mr-2 h-4 w-4" /> Save as Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save Approver Template</DialogTitle>
                          <DialogDescription>
                            Save this set of approvers as a template for future requests.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="templateName">Template Name</Label>
                            <Input
                              id="templateName"
                              value={newApproverSetName}
                              onChange={(e) => setNewApproverSetName(e.target.value)}
                              placeholder="My Custom Approvers"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="templateDescription">Description (Optional)</Label>
                            <Textarea
                              id="templateDescription"
                              value={newApproverSetDescription}
                              onChange={(e) => setNewApproverSetDescription(e.target.value)}
                              placeholder="Description of this approver template"
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setSaveApproverSetDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="button" onClick={saveCurrentApproversAsSet} disabled={!newApproverSetName}>
                            Save Template
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                        Back
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="default"
                            disabled={submitting || formData.approvals.length === 0}
                          >
                            <Send className="mr-2 h-4 w-4" /> Submit for Approval
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Submit request for approval?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will notify all approvers and start the approval process.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => handleSubmit(e, false)}>Submit</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pre-Approver Templates</CardTitle>
                    <CardDescription>Use pre-defined approver templates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {preApproverSets.length > 0 ? (
                      <div className="space-y-2">
                        <Label>Select a template</Label>
                        <Select value={selectedPreApproverSet} onValueChange={applyPreApproverSet}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {preApproverSets.map((set) => (
                              <SelectItem key={set.id} value={set.id}>
                                {set.name} {set.isDefault && "(Default)"} {!set.isGlobal && "(Custom)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedPreApproverSet && (
                          <div className="mt-4">
                            <p className="text-sm font-medium">Template details:</p>
                            {preApproverSets.find((s) => s.id === selectedPreApproverSet)?.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {preApproverSets.find((s) => s.id === selectedPreApproverSet)?.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <Users className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          No pre-approver templates available for this request type.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {userPreApproverSets.length > 0 && (
                  <Card>
                    <CardHeader>
                      {" "}
                      <CardTitle>Your Custom Templates</CardTitle>
                      <CardDescription>Your saved approver templates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {userPreApproverSets
                          .filter((set) => set.requestType === formData.type)
                          .map((set) => (
                            <div key={set.id} className="p-2 border rounded-md">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{set.name}</p>
                                  {set.description && (
                                    <p className="text-xs text-muted-foreground">{set.description}</p>
                                  )}
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => applyPreApproverSet(set.id)}>
                                  Apply
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}

