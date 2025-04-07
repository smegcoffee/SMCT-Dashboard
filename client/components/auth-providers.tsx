// "use client"

// import type { ReactNode } from "react"
// import { ThemeProvider } from "@/components/theme-provider"
// import { AuthProvider } from "@/lib/auth-context"

// export function AuthProviders({ children }: { children: ReactNode }) {
//   return (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//       <AuthProvider>{children}</AuthProvider>
//     </ThemeProvider>
//   )
// }



"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { RequestFormProvider } from "@/lib/request-form-context"

export function AuthProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <RequestFormProvider>{children}</RequestFormProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

