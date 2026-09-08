"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MailOpen, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

interface MessagesListProps {
  initialMessages: ContactMessage[]
}

export function MessagesList({ initialMessages }: MessagesListProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [busyId, setBusyId] = useState<string | null>(null)
  const { toast } = useToast()

  const toggleRead = async (msg: ContactMessage) => {
    setBusyId(msg.id)
    const supabase = createClient()
    const { error } = await supabase.from("contact_messages").update({ is_read: !msg.is_read }).eq("id", msg.id)

    if (error) {
      toast({ title: "Failed to update message", description: error.message, variant: "destructive" })
    } else {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m)))
    }
    setBusyId(null)
  }

  const deleteMessage = async (id: string) => {
    setBusyId(id)
    const supabase = createClient()
    const { error } = await supabase.from("contact_messages").delete().eq("id", id)

    if (error) {
      toast({ title: "Failed to delete message", description: error.message, variant: "destructive" })
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id))
      toast({ title: "Message deleted" })
    }
    setBusyId(null)
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">
            No messages yet. Enquiries submitted through your Contact page will show up here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <Card key={msg.id} className={`border-l-4 ${msg.is_read ? "border-muted" : "border-primary"}`}>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground">{msg.name}</h3>
                  {!msg.is_read && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-primary text-white px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">
                  {msg.email}
                </a>
                <p className="text-xs text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={busyId === msg.id} onClick={() => toggleRead(msg)}>
                  {busyId === msg.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : msg.is_read ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <MailOpen className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">{msg.is_read ? "Mark unread" : "Mark read"}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === msg.id}
                  onClick={() => deleteMessage(msg.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground whitespace-pre-line leading-relaxed">{msg.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
