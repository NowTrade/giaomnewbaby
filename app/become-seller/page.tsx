"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/user-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, TrendingUp, Shield, Zap } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function BecomeSellerPage() {
  const [businessName, setBusinessName] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const router = useRouter()
  const { user, setUserType } = useUser()

  useEffect(() => {
    console.log("[v0] Checking Supabase configuration")
    const supabase = createClient()
    if (!supabase) {
      console.log("[v0] Supabase not configured - using user switcher mode")
      setSupabaseConfigured(false)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!supabaseConfigured) {
      setUserType("seller")
      router.push("/profile/seller")
      return
    }

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error: insertError } = await supabase.from("seller_profiles").insert({
        user_id: user.id,
        business_name: businessName,
        business_description: businessDescription,
        status: "pending",
      })

      if (insertError) throw insertError

      const { error: updateError } = await supabase.from("profiles").update({ role: "seller" }).eq("id", user.id)

      if (updateError) throw updateError

      alert("Seller application submitted successfully! Please wait for admin approval.")
      router.push("/profile/seller")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to submit application")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Start Selling on Giaom</h1>
              <p className="text-xl text-muted-foreground">
                Join thousands of successful sellers and grow your business with our marketplace
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card>
                <CardHeader>
                  <Store className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Easy Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create your store in minutes with our simple onboarding process
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Grow Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reach millions of customers actively shopping on Giaom
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Secure Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Get paid securely with our trusted payment processing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Fast Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">24/7 seller support to help you succeed</p>
                </CardContent>
              </Card>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Create Your Seller Account</CardTitle>
                <CardDescription>
                  {!supabaseConfigured
                    ? "Using demo mode - Click submit to switch to seller view"
                    : "Fill out the form below to get started"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder="My Awesome Store"
                      required={supabaseConfigured}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      placeholder="Tell us about your business"
                      required={supabaseConfigured}
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Submitting..." : !supabaseConfigured ? "Switch to Seller View" : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
