"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { tempUsers } from "@/lib/data/tempUsers"
import { setCookie, getCookie, deleteCookie } from "cookies-next";

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
  firstName?: string
  lastName?: string
  username?: string
  contact?: string
  position?: string
  branchCode?: string
  employeeId?: string
  signature?: string
  isApprover?: boolean
  approverLevel?: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  getAllUsers: () => User[]
  getApprovers: () => User[]
}

export interface RegisterData {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  contact: string
  position: string
  branchCode: string
  employeeId: string
  signature: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = getCookie("user") as string; // Retrieve the cookie
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    checkAuth();
  }, []);
  

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    let loggedInUser: User | null = null;
  
    // First check temp users
    const tempUser = tempUsers.find((u) => u.email === email && u.password === password);
    if (tempUser) {
      loggedInUser = tempUser;
    } else if (typeof window !== "undefined") {
      // Then check registered users
      const savedUsers = localStorage.getItem("registeredUsers");
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        if (foundUser) {
          loggedInUser = {
            id: foundUser.employeeId,
            name: `${foundUser.firstName} ${foundUser.lastName}`,
            email: foundUser.email,
            avatar: "/placeholder.svg?height=40&width=40",
            role: foundUser.position,
            department: foundUser.branchCode,
            ...foundUser,
            isApprover: false,
            approverLevel: 0,
          };
        }
      }
    }
  
    if (loggedInUser) {
      setUser(loggedInUser);
  
      // Store user in cookie
      setCookie("user", JSON.stringify(loggedInUser), {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
  
      // Debugging: Check if cookie is set
      console.log("User cookie set:", getCookie("user"));
  
      setIsLoading(false);
      return true;
    }
  
    setIsLoading(false);
    return false;
  };
  

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // In a real app, you would send this data to your API
      // For demo purposes, we'll store it in localStorage
      if (typeof window !== "undefined") {
        const savedUsers = localStorage.getItem("registeredUsers")
        const users = savedUsers ? JSON.parse(savedUsers) : []

        // Check if user already exists
        if (users.some((u: any) => u.email === userData.email || u.username === userData.username)) {
          setIsLoading(false)
          return false
        }

        // Add new user
        users.push(userData)
        localStorage.setItem("registeredUsers", JSON.stringify(users))
      }

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    // This is a mock logout function
    setUser(null)
    if (typeof window !== "undefined") {
      // window.localStorage.clear() 
      deleteCookie("user")
      window.location.reload()
    }
  }

  // Get all users (for approver selection)
  const getAllUsers = (): User[] => {
    return tempUsers
  }

  // Get all approvers
  const getApprovers = (): User[] => {
    return tempUsers.filter((u) => u.isApprover)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        getAllUsers,
        getApprovers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

