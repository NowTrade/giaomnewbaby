"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
}

const demoProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 89.99,
    image: "/wireless-headphones.png",
    rating: 4.5,
    reviews: 124,
  },
  {
    id: "2",
    name: "Vintage Leather Bag",
    price: 129.99,
    image: "/vintage-leather-bag.jpg",
    rating: 5.0,
    reviews: 89,
  },
  {
    id: "3",
    name: "Handmade Ceramic Mug",
    price: 24.99,
    image: "/ceramic-mug.png",
    rating: 4.8,
    reviews: 203,
  },
  {
    id: "4",
    name: "Smart Watch",
    price: 199.99,
    image: "/smartwatch-lifestyle.png",
    rating: 4.3,
    reviews: 156,
  },
  {
    id: "5",
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "/cotton-tshirt.png",
    rating: 4.6,
    reviews: 312,
  },
  {
    id: "6",
    name: "Yoga Mat",
    price: 39.99,
    image: "/rolled-yoga-mat.png",
    rating: 4.7,
    reviews: 178,
  },
]

export function FeaturedProducts() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>(demoProducts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient()
        if (!supabase) {
          setProducts(demoProducts)
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("products")
          .select("id, title, description, price, image_url, category, status")
          .eq("status", "approved")
          .limit(6)

        if (error || !data || data.length === 0) {
          setProducts(demoProducts)
        } else {
          setProducts(
            data.map((p) => ({
              id: p.id,
              name: p.title,
              price: Number(p.price),
              image: p.image_url || "/generic-product-display.png",
              rating: 4.5,
              reviews: Math.floor(Math.random() * 200) + 50,
            }))
          )
        }
      } catch {
        setProducts(demoProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (e: React.MouseEvent, product: (typeof products)[0]) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <section className="container mx-auto py-12 md:py-16 bg-muted/30">
      <h3 className="text-2xl md:text-3xl font-bold mb-8">Featured Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-0">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 p-4">
                <h4 className="font-semibold text-lg">{product.name}</h4>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-bold">${product.price}</span>
                  <Button size="sm" onClick={(e) => handleAddToCart(e, product)}>
                    Add to Cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
