"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, type RegisterData } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check } from "lucide-react"
import { SignatureCanvas } from "@/components/signature-canvas"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Branch codes
const branchCodes = [
  { value: "dsmt", label: "DSMT" },
  { value: "loay", label: "Loay" },
  { value: "valen", label: "Valen" },
  { value: "carmb", label: "Carmb" },
]

// Extended interface for form state that includes confirmPassword
interface RegisterFormData extends RegisterData {
  confirmPassword: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form state with proper typing
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "+63",
    position: "",
    branchCode: "",
    employeeId: "",
    signature: "",
  })

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    matches: false,
  })

  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validate password if needed
    if (name === "password" || name === "confirmPassword") {
      validatePassword(
        name === "password" ? value : formData.password,
        name === "confirmPassword" ? value : formData.confirmPassword,
      )
    }

    // Format employee ID
    if (name === "employeeId") {
      const formatted = formatEmployeeId(value)
      setFormData((prev) => ({
        ...prev,
        employeeId: formatted,
      }))
    }
  }

  // Format employee ID as xxxx-xxxxxxxx
  const formatEmployeeId = (value: string) => {
    // Remove any non-alphanumeric characters
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "")

    // Format as xxxx-xxxxxxxx
    if (cleaned.length <= 4) {
      return cleaned
    } else {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4, Math.min(cleaned.length, 12))}`
    }
  }

  // Validate password
  const validatePassword = (password: string, confirmPassword: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      matches: password === confirmPassword,
    })
  }

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.username.trim() !== "" &&
      formData.email.includes("@") &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.contact.length >= 12 &&
      formData.position.trim() !== "" &&
      formData.branchCode !== "" &&
      formData.employeeId.length >= 9 &&
      formData.signature !== ""
    )
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      setError("Please fill in all required fields correctly.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...registerData } = formData

      const success = await register(registerData)
      if (success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError("Username or email already exists.")
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription>Your account has been created. You will be redirected to the login page.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-4xl my-8">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">CP</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Fill in your details to register for the corporate portal</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="text-xs space-y-1 mt-1">
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.minLength ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`h-1 w-1 rounded-full ${passwordValidation.minLength ? "bg-green-500" : "bg-muted-foreground"}`}
                    />
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`h-1 w-1 rounded-full ${passwordValidation.hasUppercase ? "bg-green-500" : "bg-muted-foreground"}`}
                    />
                    <span>Contains uppercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.hasLowercase ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`h-1 w-1 rounded-full ${passwordValidation.hasLowercase ? "bg-green-500" : "bg-muted-foreground"}`}
                    />
                    <span>Contains lowercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`h-1 w-1 rounded-full ${passwordValidation.hasNumber ? "bg-green-500" : "bg-muted-foreground"}`}
                    />
                    <span>Contains number</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.hasSpecial ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`h-1 w-1 rounded-full ${passwordValidation.hasSpecial ? "bg-green-500" : "bg-muted-foreground"}`}
                    />
                    <span>Contains special character</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {formData.password && formData.confirmPassword && (
                  <div className={`text-xs mt-1 ${passwordValidation.matches ? "text-green-500" : "text-red-500"}`}>
                    {passwordValidation.matches ? "Passwords match" : "Passwords do not match"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+63 9XX XXX XXXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchCode">Branch Code</Label>
                <Select
                  value={formData.branchCode}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, branchCode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchCodes.map((branch) => (
                      <SelectItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="xxxx-xxxxxxxx"
                  maxLength={13}
                  required
                />
                <div className="text-xs text-muted-foreground">Format: xxxx-xxxxxxxx</div>
              </div>
            </div>

            {/* Signature */}
            <div className="space-y-2 pt-4">
              <Label htmlFor="signature">Signature</Label>
              <SignatureCanvas
                value={formData.signature}
                onChange={(value) => setFormData((prev) => ({ ...prev, signature: value }))}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoading || !isFormValid()}>
              {isLoading ? "Registering..." : "Register"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

