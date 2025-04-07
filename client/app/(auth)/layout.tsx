import type React from "react"
import { AuthProviders } from "@/components/auth-providers"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProviders>{children}</AuthProviders>
}

