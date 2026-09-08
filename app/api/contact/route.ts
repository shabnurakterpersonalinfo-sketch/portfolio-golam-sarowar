import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendContactNotification } from "@/lib/mail"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
    }

    // Always persist the enquiry first, so nothing is lost even if the
    // outbound email later fails or Gmail SMTP hasn't been configured yet.
    const supabase = await createClient()
    const { error: dbError } = await supabase.from("contact_messages").insert({
      name,
      email,
      message,
    })

    if (dbError) {
      console.error("[contact] Failed to save message to database:", dbError)
    }

    // Send the notification email via Gmail SMTP. If GMAIL_USER /
    // GMAIL_APP_PASSWORD aren't set, this is skipped gracefully and the
    // message (if saved above) is still available in the admin panel.
    const { sent, error: emailError } = await sendContactNotification({ name, email, message })

    if (!sent) {
      console.warn("[contact] Email not sent:", emailError)
    }

    if (dbError && !sent) {
      // Neither the database save nor the email succeeded — this submission is genuinely lost.
      return NextResponse.json(
        { error: "Failed to submit your message. Please try again or email directly." },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[contact] Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
