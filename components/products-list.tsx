"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

type Product = {
  id: string
  title: string
  description: string
  price: number
  category: string
  image_url: string
  status: string
  created_at: string
}

export function ProductsList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Products</CardTitle>
          <CardDescription>You haven't added any products yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Products</CardTitle>
        <CardDescription>Manage your product listings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
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
                  <Badge
                    variant={
                      product.status === "approved"
                        ? "default"
                        : product.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
