"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import Image from "next/image"

type Product = {
  id: string
  seller_id: string
  title: string
  description: string
  price: number
  category: string
  image_url: string
  status: string
  created_at: string
  seller: {
    full_name: string
    email: string
  }
}

export function ProductApprovalList({ products }: { products: Product[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleApproval = async (productId: string, status: "approved" | "rejected") => {
    setLoading(productId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("products").update({ status }).eq("id", productId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Failed to update product status:", error)
    } finally {
      setLoading(null)
    }
  }

  const pendingProducts = products.filter((p) => p.status === "pending")
  const approvedProducts = products.filter((p) => p.status === "approved")
  const rejectedProducts = products.filter((p) => p.status === "rejected")

  return (
    <div className="space-y-6">
      {pendingProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Product Reviews</CardTitle>
            <CardDescription>Review and approve new product listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg relative overflow-hidden">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <p className="text-sm font-medium">
                        ${product.price} • {product.category}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Seller: {product.seller.full_name} ({product.seller.email})
                      </p>
                      <Badge variant="secondary">{product.status}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-2"
                      onClick={() => handleApproval(product.id, "approved")}
                      disabled={loading === product.id}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                      onClick={() => handleApproval(product.id, "rejected")}
                      disabled={loading === product.id}
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
          <CardTitle>All Products</CardTitle>
          <CardDescription>View all product listings in the marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...approvedProducts, ...rejectedProducts].slice(0, 10).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg relative overflow-hidden">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      ${product.price} • {product.category}
                    </p>
                    <Badge variant={product.status === "approved" ? "default" : "destructive"}>{product.status}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {product.status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(product.id, "rejected")}
                      disabled={loading === product.id}
                    >
                      Remove
                    </Button>
                  )}
                  {product.status === "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(product.id, "approved")}
                      disabled={loading === product.id}
                    >
                      Restore
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
