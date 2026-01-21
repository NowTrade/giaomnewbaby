import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Laptop, Shirt, Home, Dumbbell, Paintbrush, Book } from "lucide-react"

const categories = [
  { name: "Electronics", icon: Laptop, href: "/category/electronics" },
  { name: "Fashion", icon: Shirt, href: "/category/fashion" },
  { name: "Home & Garden", icon: Home, href: "/category/home-garden" },
  { name: "Sports", icon: Dumbbell, href: "/category/sports" },
  { name: "Art", icon: Paintbrush, href: "/category/art" },
  { name: "Books", icon: Book, href: "/category/books" },
]

export function Categories() {
  return (
    <section className="container mx-auto py-12 md:py-16">
      <h3 className="text-2xl md:text-3xl font-bold mb-8">Shop by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link key={category.name} href={category.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                  <Icon className="h-8 w-8" />
                  <span className="font-medium text-center">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
