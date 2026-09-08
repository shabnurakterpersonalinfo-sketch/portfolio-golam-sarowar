import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessagesList } from "@/components/messages-list"

export default async function AdminMessages() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Messages</h1>
        <p className="text-muted-foreground mt-1">Enquiries submitted through your portfolio's Contact page</p>
      </div>

      <MessagesList initialMessages={messages || []} />
    </div>
  )
}
