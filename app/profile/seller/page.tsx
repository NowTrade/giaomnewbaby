"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/user-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingBag, TrendingUp, DollarSign } from "lucide-react"
import { AddProductForm } from "@/components/add-product-form"
import { ProductsList } from "@/components/products-list"

export default function SellerProfilePage() {
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const [sellerProfile, setSellerProfile] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [userId, setUserId] = useState<string>("")
  const { user } = useUser()

  useEffect(() => {
    async function loadData() {
      console.log("[v0] Loading seller profile data")
      const supabase = createClient()

      if (!supabase) {
        console.log("[v0] Supabase not configured - using demo data")
        setSupabaseConfigured(false)
        setSellerProfile({ business_name: "Demo Store", status: "approved" })
        setProducts([
          { id: "1", name: "Demo Product 1", price: 29.99, status: "approved", created_at: new Date().toISOString() },
          { id: "2", name: "Demo Product 2", price: 49.99, status: "pending", created_at: new Date().toISOString() },
        ])
        setUserId("demo-user-id")
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

        setUserId(user.id)

        const { data: profile } = await supabase.from("seller_profiles").select("*").eq("user_id", user.id).single()
        setSellerProfile(profile)

        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false })
        setProducts(productsData || [])
      } catch (error) {
        console.log("[v0] Error loading data:", error)
        setSupabaseConfigured(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-muted-foreground">
              {sellerProfile?.business_name || user.name || "Manage your store and products"}
            </p>
            {!supabaseConfigured && (
              <p className="text-sm text-blue-600 mt-2">Demo Mode - Using user switcher for testing</p>
            )}
            {sellerProfile?.status === "pending" && (
              <p className="text-sm text-orange-600 mt-2">Your seller account is pending approval</p>
            )}
            {sellerProfile?.status === "rejected" && (
              <p className="text-sm text-red-600 mt-2">Your seller application was rejected</p>
            )}
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,345</div>
                <p className="text-xs text-muted-foreground">+20% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">145</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {products?.filter((p) => p.status === "approved").length || 0} approved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products?.filter((p) => p.status === "pending").length || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{sellerProfile?.status || "N/A"}</div>
                <p className="text-xs text-muted-foreground">Account status</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <AddProductForm userId={userId} />
              <ProductsList products={products || []} />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Manage and fulfill customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>Track your store performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>View your earnings and payouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No recent payments</p>
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
