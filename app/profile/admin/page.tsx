"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/user-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShoppingBag, Store, AlertCircle } from "lucide-react"
import { SellerApprovalList } from "@/components/seller-approval-list"
import { ProductApprovalList } from "@/components/product-approval-list"
import { UserManagementList } from "@/components/user-management-list"

export default function AdminProfilePage() {
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const [allProfiles, setAllProfiles] = useState<any[]>([])
  const [allSellers, setAllSellers] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const { user } = useUser()

  useEffect(() => {
    async function loadData() {
      console.log("[v0] Loading admin dashboard data")
      const supabase = createClient()

      if (!supabase) {
        console.log("[v0] Supabase not configured - using demo data")
        setSupabaseConfigured(false)
        // Demo data
        setAllProfiles([
          { id: "1", full_name: "John Doe", email: "john@example.com", role: "customer" },
          { id: "2", full_name: "Jane Smith", email: "jane@seller.com", role: "seller" },
        ])
        setAllSellers([
          { id: "1", business_name: "Demo Store", status: "pending", profiles: { full_name: "Jane Smith" } },
        ])
        setAllProducts([
          { id: "1", name: "Pending Product", price: 99, status: "pending", seller: { full_name: "Jane Smith" } },
        ])
        return
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          console.log("[v0] No user found - using demo mode")
          setSupabaseConfigured(false)
          return
        }

        const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })
        setAllProfiles(profiles || [])

        const { data: sellers } = await supabase
          .from("seller_profiles")
          .select("*, profiles(*)")
          .order("created_at", { ascending: false })
        setAllSellers(sellers || [])

        const { data: products } = await supabase
          .from("products")
          .select("*, seller:profiles!products_seller_id_fkey(full_name, email)")
          .order("created_at", { ascending: false })
        setAllProducts(products || [])
      } catch (error) {
        console.log("[v0] Error loading admin data:", error)
        setSupabaseConfigured(false)
      }
    }

    loadData()
  }, [])

  const pendingSellers = allSellers.filter((s) => s.status === "pending")
  const pendingProducts = allProducts.filter((p) => p.status === "pending")
  const activeSellers = allSellers.filter((s) => s.status === "approved").length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage the entire marketplace</p>
            {!supabaseConfigured && (
              <p className="text-sm text-blue-600 mt-2">Demo Mode - Using user switcher for testing</p>
            )}
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allProfiles.length}</div>
                <p className="text-xs text-muted-foreground">Registered accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSellers}</div>
                <p className="text-xs text-muted-foreground">{pendingSellers.length} pending approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allProducts.length}</div>
                <p className="text-xs text-muted-foreground">{pendingProducts.length} pending review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$234K</div>
                <p className="text-xs text-muted-foreground">Total marketplace revenue</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sellers" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sellers" className="gap-2">
                <Store className="h-4 w-4" />
                Sellers
                {pendingSellers.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                    {pendingSellers.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Products
                {pendingProducts.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                    {pendingProducts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sellers" className="space-y-4">
              <SellerApprovalList sellers={allSellers || []} />
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <ProductApprovalList products={allProducts || []} />
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <UserManagementList users={allProfiles || []} />
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Reports</CardTitle>
                  <CardDescription>Review user and product reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No pending reports</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
