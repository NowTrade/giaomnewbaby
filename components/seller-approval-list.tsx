"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

type SellerProfile = {
  id: string
  user_id: string
  business_name: string
  business_description: string
  status: string
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

export function SellerApprovalList({ sellers }: { sellers: SellerProfile[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleApproval = async (sellerId: string, status: "approved" | "rejected") => {
    setLoading(sellerId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("seller_profiles").update({ status }).eq("id", sellerId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Failed to update seller status:", error)
    } finally {
      setLoading(null)
    }
  }

  const pendingSellers = sellers.filter((s) => s.status === "pending")
  const approvedSellers = sellers.filter((s) => s.status === "approved")
  const rejectedSellers = sellers.filter((s) => s.status === "rejected")

  return (
    <div className="space-y-6">
      {pendingSellers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Seller Applications</CardTitle>
            <CardDescription>Review and approve new seller applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingSellers.map((seller) => (
                <div key={seller.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{seller.business_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {seller.profiles.full_name} ({seller.profiles.email})
                    </p>
                    <p className="text-sm text-muted-foreground">{seller.business_description}</p>
                    <Badge variant="secondary">{seller.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-2"
                      onClick={() => handleApproval(seller.id, "approved")}
                      disabled={loading === seller.id}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                      onClick={() => handleApproval(seller.id, "rejected")}
                      disabled={loading === seller.id}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Sellers</CardTitle>
          <CardDescription>View all seller accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...approvedSellers, ...rejectedSellers].map((seller) => (
              <div key={seller.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{seller.business_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {seller.profiles.full_name} ({seller.profiles.email})
                  </p>
                  <Badge variant={seller.status === "approved" ? "default" : "destructive"}>{seller.status}</Badge>
                </div>
                <div className="flex gap-2">
                  {seller.status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(seller.id, "rejected")}
                      disabled={loading === seller.id}
                    >
                      Suspend
                    </Button>
                  )}
                  {seller.status === "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(seller.id, "approved")}
                      disabled={loading === seller.id}
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
