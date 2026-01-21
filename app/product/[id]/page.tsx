"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  category: string
}

const demoProducts: Record<string, Product> = {
  "1": { id: "1", title: "Wireless Headphones", description: "Premium noise-canceling headphones with 30-hour battery life. Features high-quality drivers for immersive sound.", price: 89.99, image_url: "/wireless-headphones.png", category: "electronics" },
  "2": { id: "2", title: "Vintage Leather Bag", description: "Handcrafted genuine leather messenger bag. Perfect for work or travel with multiple compartments.", price: 129.99, image_url: "/vintage-leather-bag.jpg", category: "fashion" },
  "3": { id: "3", title: "Handmade Ceramic Mug", description: "Artisan pottery coffee mug with unique glaze. Microwave and dishwasher safe.", price: 24.99, image_url: "/ceramic-mug.png", category: "home" },
  "4": { id: "4", title: "Smart Watch", description: "Feature-rich smartwatch with health monitoring, GPS, and 7-day battery life.", price: 199.99, image_url: "/smartwatch-lifestyle.png", category: "electronics" },
  "5": { id: "5", title: "Organic Cotton T-Shirt", description: "Sustainably made premium cotton tee. Soft, breathable, and eco-friendly.", price: 29.99, image_url: "/cotton-tshirt.png", category: "fashion" },
  "6": { id: "6", title: "Yoga Mat", description: "Eco-friendly non-slip exercise mat. Perfect for yoga, pilates, and workouts.", price: 39.99, image_url: "/rolled-yoga-mat.png", category: "sports" },
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createClient()
        if (supabase) {
          const { data, error } = await supabase
            .from("products")
            .select("id, title, description, price, image_url, category")
            .eq("id", productId)
            .single()

          if (!error && data) {
            setProduct(data)
            setLoading(false)
            return
          }
        }
      } catch {
        // Fall through to demo data
      }
      
      // Use demo data
      const demo = demoProducts[productId] || {
        id: productId,
        title: `Product ${productId}`,
        description: "This is a detailed description of the product. It includes all the important information about features, materials, dimensions, and care instructions.",
        price: 89.99,
        image_url: "/generic-product-display.png",
        category: "general"
      }
      setProduct(demo)
      setLoading(false)
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.title,
      price: Number(product.price),
      image: product.image_url,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image_url || "/generic-product-display.png"}
              alt={product.title}
              className="w-full rounded-lg"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.5</span>
              </div>
              <span className="text-muted-foreground">(124 reviews)</span>
            </div>
            <p className="text-3xl font-bold">${Number(product.price).toFixed(2)}</p>
            <p className="text-muted-foreground">{product.description}</p>
            <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart} disabled={added}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {added ? "Added to Cart!" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
