import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="container mx-auto py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Discover Unique Products from Independent Sellers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
            Shop handcrafted items, vintage treasures, and one-of-a-kind finds from creative entrepreneurs around the
            world.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg">Start Shopping</Button>
            <Button size="lg" variant="outline">
              Become a Seller
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
