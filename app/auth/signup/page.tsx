"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { UserPlus } from "lucide-react"

// Supabase / Postgres return technical error messages verbatim — translate the
// common ones into friendly, actionable copy for the toast.
function friendlySignUpError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes("row-level security") || lower.includes("row level security")) {
    return "Sign-up is not enabled for this project's database yet. Please contact the site administrator."
  }
  if (lower.includes("already registered") || lower.includes("user already registered")) {
    return "This email is already registered. Please log in instead."
  }
  return message
}

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) throw signUpError

      // Insert admin user record
      if (data.user) {
        const { error: insertError } = await supabase.from("admin_users").insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
        })

        if (insertError) throw insertError
      }

      if (data.user?.identities?.length === 0) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: "This email is already registered. Please log in instead.",
        })
      } else {
        toast({
          title: "Account created",
          description:
            "Account created successfully! If email confirmation is enabled, please check your email. Otherwise, you can log in now.",
        })
        setTimeout(() => router.push("/auth/login"), 2000)
      }
    } catch (err: any) {
      const message = err?.message || "An error occurred during sign up"
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: friendlySignUpError(message),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-light to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Create Admin Account</CardTitle>
          <CardDescription className="text-center">Sign up to manage the portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
