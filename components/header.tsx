"use client"

import { Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { useUser } from "@/lib/user-context"
import { CartDrawer } from "@/components/cart-drawer"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">Giaom</h1>
          </Link>
        </div>

        <div className="flex-1 flex items-center gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search for products..." className="pl-10" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.type === "guest" && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/become-seller">Become a Seller</Link>
            </Button>
          )}
          {user.type === "customer" && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile/customer">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {user.type === "seller" && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile/seller">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {user.type === "admin" && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile/admin">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <CartDrawer />
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container py-4 flex flex-col gap-2">
            <Button variant="ghost" className="justify-start">
              Electronics
            </Button>
            <Button variant="ghost" className="justify-start">
              Fashion
            </Button>
            <Button variant="ghost" className="justify-start">
              Home & Garden
            </Button>
            <Button variant="ghost" className="justify-start">
              Sports
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
