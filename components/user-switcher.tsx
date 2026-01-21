"use client"

import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { User, Store, Shield, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserSwitcher() {
  const { user, setUserType } = useUser()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 shadow-lg bg-transparent">
            {user.type === "guest" && <User className="h-4 w-4" />}
            {user.type === "customer" && <User className="h-4 w-4" />}
            {user.type === "seller" && <Store className="h-4 w-4" />}
            {user.type === "admin" && <Shield className="h-4 w-4" />}
            <span className="font-medium">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch User Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUserType("guest")}>
            <LogOut className="mr-2 h-4 w-4" />
            Guest
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUserType("customer")}>
            <User className="mr-2 h-4 w-4" />
            Customer (John Doe)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUserType("seller")}>
            <Store className="mr-2 h-4 w-4" />
            Seller (Jane Smith)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUserType("admin")}>
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
