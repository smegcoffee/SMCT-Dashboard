// "use client"

// import { type ReactNode, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { ThemeProvider } from "@/components/theme-provider"
// import { AuthProvider, useAuth } from "@/lib/auth-context"
// import { DataProvider } from "@/lib/data-context"
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// import { DashboardSidebar } from "@/components/dashboard-sidebar"
// import { DashboardHeader } from "@/components/dashboard-header"

// function AuthCheck({ children }: { children: ReactNode }) {
//   const { isAuthenticated, isLoading } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!isLoading) {
//       if (!isAuthenticated) {
//         console.log("Not authenticated, redirecting to login...", isAuthenticated);
//         router.push("/login");
//       }
//     }
//   }, [isAuthenticated, isLoading, router]);
  

//   if (isLoading) {
//     return <div className="flex min-h-screen items-center justify-center">Loading...</div>
//   }

//   if (!isAuthenticated) {
//     return <div className="flex min-h-screen items-center justify-center">Redirecting to login...</div>
//   }

//   return <>{children}</>
// }

// export function Providers({ children }: { children: ReactNode }) {
//   return (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//       <AuthProvider>
//         <DataProvider>
//           <SidebarProvider>
//             <div className="flex min-h-screen">
//               <DashboardSidebar />
//               <SidebarInset>
//                 <div className="flex min-h-screen flex-col">
//                   <DashboardHeader />
//                   <main className="flex-1 p-4 md:p-6">
//                     <AuthCheck>{children}</AuthCheck>
//                   </main>
//                 </div>
//               </SidebarInset>
//             </div>
//           </SidebarProvider>
//         </DataProvider>
//       </AuthProvider>
//     </ThemeProvider>
//   )
// }

"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { RequestFormProvider } from "@/lib/request-form-context"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

function AuthCheck({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login...")
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center">Redirecting to login...</div>
  }

  return <>{children}</>
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <DataProvider>
          <RequestFormProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <DashboardSidebar />
                <SidebarInset>
                  <div className="flex min-h-screen flex-col">
                    <DashboardHeader />
                    <main className="flex-1 p-4 md:p-6">
                      <AuthCheck>{children}</AuthCheck>
                    </main>
                  </div>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </RequestFormProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

