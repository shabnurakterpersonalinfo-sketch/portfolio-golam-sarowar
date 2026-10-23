# Contact Form Email Setup (Gmail App Password)

The contact form (`/contact` and the homepage contact section) saves every message to the
`contact_messages` table (visible in **Admin → Messages**) and then emails a notification
through Gmail SMTP using a Google **App Password**. Sending is done with `nodemailer` in
`lib/mail.ts`; the API route is `app/api/contact/route.ts`.

If Gmail isn't configured, the message is still saved in the admin panel; only the email is skipped.

## 1. Create a Google App Password

App Passwords only work on a Google account with **2-Step Verification** turned on.

1. Sign in to the Gmail account that will send the notifications.
2. Turn on 2-Step Verification: <https://myaccount.google.com/signinoptions/twosv>
3. Open <https://myaccount.google.com/apppasswords>
4. Enter a name (e.g. "Portfolio contact form") and click **Create**.forwarder
5. Copy the 16-character password Google shows (spaces don't matter). You can't view it again later.

## 2. Set the environment variables

| Variable | Required | Value |
| --- | --- | --- |
| `GMAIL_USER` | Yes | The Gmail address that sends the email, e.g. `mohammad.sarowar06@gmail.com` |
| `GMAIL_APP_PASSWORD` | Yes | The 16-character App Password from step 1 |
| `CONTACT_TO` | No | Where notifications go. Defaults to `GMAIL_USER` |
| `CONTACT_FROM_NAME` | No | Sender display name. Defaults to "Mohammad Golam Sarowar" |

**Local:** add them to `.env.local`.

**Vercel:** Project → **Settings → Environment Variables**, add the variables for Production
(and Preview if you want), then **redeploy** so the new values are picked up.

`RESEND_API_KEY` is no longer used and can be deleted from Vercel.

## 3. Test

1. Open the site and submit the contact form with your own email address.
2. The notification arrives at `CONTACT_TO` (or `GMAIL_USER`). Clicking **Reply** answers the visitor
   directly, because the email's Reply-To is set to the visitor's address.
3. The message also appears in **Admin → Messages**.

## Troubleshooting

- **`Invalid login` / `535-5.7.8 Username and Password not accepted`**: the App Password is wrong or was
  revoked, `GMAIL_USER` doesn't match the account that created it, or 2-Step Verification is off.
  Create a new App Password and update the variable.
- **No email, but the message is in Admin → Messages**: check the Vercel function logs for
  `[contact] Email not sent:`; usually a missing variable or a deploy made before the variables were added.
- **Email in spam**: mark it "Not spam" once; Gmail learns quickly since it is sent from your own account.
- **Limits**: a normal Gmail account can send about 500 emails a day, far more than a portfolio needs.
