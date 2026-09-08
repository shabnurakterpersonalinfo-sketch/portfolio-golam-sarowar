import nodemailer from "nodemailer"

interface ContactEmailPayload {
  name: string
  email: string
  message: string
}

const SITE_NAME = "Mohammad Golam Sarowar"
const SITE_TITLE = "Network Engineer & Researcher"
const BRAND_COLOR_DARK = "#036445"
const BRAND_COLOR = "#0F766E"
const BRAND_COLOR_LIGHT = "#14B8A6"

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    return null
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    })
  }

  return cachedTransporter
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function buildEmailHtml({ name, email, message }: ContactEmailPayload) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />")
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  })

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Portfolio Enquiry</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f4;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(3,100,69,0.12);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg, ${BRAND_COLOR_DARK} 0%, ${BRAND_COLOR} 50%, ${BRAND_COLOR_LIGHT} 100%);padding:36px 40px;text-align:center;">
                <p style="margin:0 0 6px;color:rgba(255,255,255,0.75);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Portfolio Contact Form</p>
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">You've received a new message</h1>
              </td>
            </tr>

            <!-- Intro -->
            <tr>
              <td style="padding:32px 40px 8px;">
                <p style="margin:0;color:#1f2937;font-size:15px;line-height:1.6;">
                  Someone reached out through your portfolio's <strong>Contact</strong> page. Here are the details:
                </p>
              </td>
            </tr>

            <!-- Details card -->
            <tr>
              <td style="padding:16px 40px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4faf8;border-radius:10px;">
                  <tr>
                    <td style="padding:18px 22px;border-bottom:1px solid #e2ede9;">
                      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND_COLOR};">Name</p>
                      <p style="margin:0;font-size:15px;color:#111827;">${safeName}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 22px;">
                      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND_COLOR};">Email</p>
                      <p style="margin:0;font-size:15px;color:#111827;">
                        <a href="mailto:${safeEmail}" style="color:${BRAND_COLOR};text-decoration:none;">${safeEmail}</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:16px 40px 8px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND_COLOR};">Message</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-left:4px solid ${BRAND_COLOR_LIGHT};border-radius:6px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <p style="margin:0;font-size:15px;line-height:1.7;color:#1f2937;">${safeMessage}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:28px 40px 8px;text-align:center;">
                <a href="mailto:${safeEmail}" style="display:inline-block;background-color:${BRAND_COLOR_DARK};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
                  Reply to ${safeName}
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:28px 40px 32px;border-top:1px solid #eef2f1;margin-top:24px;">
                <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
                  Submitted on ${submittedAt} via ${SITE_NAME}'s portfolio contact form.<br />
                  This is an automated notification — replying goes directly to the sender.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">${SITE_NAME} &middot; ${SITE_TITLE}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function buildEmailText({ name, email, message }: ContactEmailPayload) {
  return `New portfolio enquiry\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSubmitted via ${SITE_NAME}'s portfolio contact form.`
}

export async function sendContactNotification(
  payload: ContactEmailPayload,
): Promise<{ sent: boolean; error?: string }> {
  const transporter = getTransporter()

  if (!transporter) {
    return { sent: false, error: "Gmail SMTP is not configured (GMAIL_USER / GMAIL_APP_PASSWORD missing)." }
  }

  const fromName = process.env.CONTACT_FROM_NAME || SITE_NAME
  const toAddress = process.env.CONTACT_TO || process.env.GMAIL_USER

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${process.env.GMAIL_USER}>`,
      to: toAddress,
      replyTo: payload.email,
      subject: `New Contact Form Submission — ${payload.name}`,
      text: buildEmailText(payload),
      html: buildEmailHtml(payload),
    })
    return { sent: true }
  } catch (error: any) {
    console.error("[contact] Gmail SMTP send failed:", error?.message || error)
    return { sent: false, error: error?.message || "Unknown SMTP error" }
  }
}
