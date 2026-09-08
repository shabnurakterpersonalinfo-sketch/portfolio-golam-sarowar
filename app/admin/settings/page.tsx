import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ChangePasswordForm } from "@/components/change-password-form"

export default async function AdminSettings() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Change the password used to sign in to this admin panel</p>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
