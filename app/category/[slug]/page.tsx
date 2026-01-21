"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeaturedProducts } from "@/components/featured-products"

export default function CategoryPage() {
  const params = useParams()
  const category = params.slug

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-muted py-12">
          <div className="container">
            <h1 className="text-4xl font-bold capitalize">{String(category).replace("-", " ")}</h1>
          </div>
        </div>
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  )
}
