"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type UserType = "guest" | "customer" | "seller" | "admin"

interface User {
  type: UserType
  name: string
  email: string
}

interface UserContextType {
  user: User
  setUserType: (type: UserType) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const userProfiles: Record<UserType, User> = {
  guest: { type: "guest", name: "Guest", email: "" },
  customer: { type: "customer", name: "John Doe", email: "john@example.com" },
  seller: { type: "seller", name: "Jane Smith", email: "jane@seller.com" },
  admin: { type: "admin", name: "Admin User", email: "admin@giaom.com" },
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(userProfiles.guest)

  const setUserType = (type: UserType) => {
    setUser(userProfiles[type])
  }

  return <UserContext.Provider value={{ user, setUserType }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
